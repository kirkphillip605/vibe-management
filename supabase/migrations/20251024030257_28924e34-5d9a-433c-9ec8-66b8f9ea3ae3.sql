-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'dj');
CREATE TYPE public.gig_status AS ENUM ('draft', 'scheduled', 'in_progress', 'completed', 'canceled');
CREATE TYPE public.pay_type AS ENUM ('flat', 'hourly', 'percentage');
CREATE TYPE public.gig_frequency AS ENUM ('weekly', 'bi-weekly', 'monthly');
CREATE TYPE public.employment_status AS ENUM ('employee', 'contractor', '1099');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'dj',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    business_name TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    billing_address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Customer notes table (for contact history)
CREATE TABLE public.customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;

-- Venue types table (dynamic list)
CREATE TABLE public.venue_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.venue_types ENABLE ROW LEVEL SECURITY;

-- Venues table
CREATE TABLE public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address JSONB NOT NULL,
    venue_type_id UUID REFERENCES public.venue_types(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Customer-Venue relationship (many-to-many)
CREATE TABLE public.customer_venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(customer_id, venue_id)
);

ALTER TABLE public.customer_venues ENABLE ROW LEVEL SECURITY;

-- DJ profiles table (sensitive data)
CREATE TABLE public.dj_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    dob DATE NOT NULL,
    ssn_encrypted TEXT NOT NULL,
    address JSONB NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    employment_status employment_status NOT NULL,
    emergency_contacts JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dj_profiles ENABLE ROW LEVEL SECURITY;

-- DJ documents table
CREATE TABLE public.dj_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dj_id UUID NOT NULL REFERENCES public.dj_profiles(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dj_documents ENABLE ROW LEVEL SECURITY;

-- Gigs table
CREATE TABLE public.gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    venue_id UUID NOT NULL REFERENCES public.venues(id),
    status gig_status NOT NULL DEFAULT 'draft',
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    quoted_amount DECIMAL(10,2) NOT NULL,
    invoiced_amount DECIMAL(10,2),
    amount_received DECIMAL(10,2),
    is_recurring BOOLEAN DEFAULT FALSE,
    frequency gig_frequency,
    recurrence_end_date DATE,
    recurrence_count INTEGER,
    parent_gig_id UUID REFERENCES public.gigs(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

-- Gig assignments table
CREATE TABLE public.gig_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
    dj_id UUID NOT NULL REFERENCES public.dj_profiles(id),
    pay_type pay_type NOT NULL DEFAULT 'flat',
    pay_rate DECIMAL(10,2) NOT NULL,
    total_payout DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(gig_id, dj_id)
);

ALTER TABLE public.gig_assignments ENABLE ROW LEVEL SECURITY;

-- Audit logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all, update their own
CREATE POLICY "Anyone can view profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- User roles: Only admins can manage
CREATE POLICY "Admins can view all user roles"
    ON public.user_roles FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user roles"
    ON public.user_roles FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
    ON public.user_roles FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

-- Customers: Admins full access, DJs read-only
CREATE POLICY "Admins have full access to customers"
    ON public.customers FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "DJs can view customers"
    ON public.customers FOR SELECT
    USING (public.has_role(auth.uid(), 'dj'));

-- Customer notes: Admins full access
CREATE POLICY "Admins have full access to customer notes"
    ON public.customer_notes FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Venue types: Admins full access, DJs read-only
CREATE POLICY "Admins have full access to venue types"
    ON public.venue_types FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "DJs can view venue types"
    ON public.venue_types FOR SELECT
    USING (public.has_role(auth.uid(), 'dj'));

-- Venues: Admins full access, DJs read-only
CREATE POLICY "Admins have full access to venues"
    ON public.venues FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "DJs can view venues"
    ON public.venues FOR SELECT
    USING (public.has_role(auth.uid(), 'dj'));

-- Customer-Venue: Admins full access
CREATE POLICY "Admins have full access to customer venues"
    ON public.customer_venues FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- DJ profiles: Admins full access, DJs can view own
CREATE POLICY "Admins have full access to dj profiles"
    ON public.dj_profiles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "DJs can view own profile"
    ON public.dj_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "DJs can update own profile"
    ON public.dj_profiles FOR UPDATE
    USING (auth.uid() = id);

-- DJ documents: Admins full access, DJs can view own
CREATE POLICY "Admins have full access to dj documents"
    ON public.dj_documents FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "DJs can view own documents"
    ON public.dj_documents FOR SELECT
    USING (dj_id = auth.uid());

-- Gigs: Admins full access, DJs can view assigned gigs
CREATE POLICY "Admins have full access to gigs"
    ON public.gigs FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "DJs can view assigned gigs"
    ON public.gigs FOR SELECT
    USING (
        public.has_role(auth.uid(), 'dj') AND
        EXISTS (
            SELECT 1 FROM public.gig_assignments
            WHERE gig_id = gigs.id AND dj_id = auth.uid()
        )
    );

-- Gig assignments: Admins full access, DJs can view own
CREATE POLICY "Admins have full access to gig assignments"
    ON public.gig_assignments FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "DJs can view own assignments"
    ON public.gig_assignments FOR SELECT
    USING (dj_id = auth.uid());

-- Audit logs: Admins read-only
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_venues_updated_at
    BEFORE UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dj_profiles_updated_at
    BEFORE UPDATE ON public.dj_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at
    BEFORE UPDATE ON public.gigs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gig_assignments_updated_at
    BEFORE UPDATE ON public.gig_assignments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        NEW.email
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default venue types
INSERT INTO public.venue_types (name) VALUES
    ('Bar'),
    ('Hall'),
    ('Event Center'),
    ('Restaurant'),
    ('Club'),
    ('Private Residence');

-- Audit log trigger for completed gigs
CREATE OR REPLACE FUNCTION public.audit_gig_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'completed' AND NEW.status = 'completed' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
        VALUES (
            'gigs',
            NEW.id,
            'UPDATE',
            to_jsonb(OLD),
            to_jsonb(NEW),
            auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_completed_gig_changes
    AFTER UPDATE ON public.gigs
    FOR EACH ROW
    WHEN (OLD.status = 'completed')
    EXECUTE FUNCTION public.audit_gig_changes();