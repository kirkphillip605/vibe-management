# Vibe Management Platform - Architecture Overview

## Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         Index Page                           │
│                   (Landing / Marketing)                      │
│                                                              │
│  [Get Started] [Sign In] ──────────────────────────────────┐│
└──────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                       Auth Page                              │
│               Sign In / DJ Registration                      │
│                                                              │
│  - Email / Password Authentication                          │
│  - New DJ Registration Form                                 │
└──────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                         [Authenticated]
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard Router                          │
│              (Role-based Redirect)                          │
│                                                              │
│  Admin → /dashboard/customers                               │
│  DJ    → /dashboard/schedule                                │
└──────────────────────────────────────────────────────────────┘
```

## Admin Dashboard Layout (Sidebar Navigation)

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌────────────┐  Top Navbar (Mobile only)                        │
│  │  ☰  Menu   │  [User Avatar] ▼                                 │
│  └────────────┘                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌────────────────────────────────────────┐    │
│  │             │  │  [Dashboard] > [Customers]              │    │
│  │   SIDEBAR   │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │             │  │                                         │    │
│  │ ┌─────────┐ │  │  # Customers                           │    │
│  │ │  VIBE   │ │  │  Manage your customer database         │    │
│  │ │ MGMT    │ │  │                                         │    │
│  │ │ Admin   │ │  │  [Table] [Grid]  [+ New Customer]      │    │
│  │ └─────────┘ │  │                                         │    │
│  │             │  │  ┌────────────────────────────────────┐ │    │
│  │ ■ Customers │  │  │ Name  Business  Contact  Actions  │ │    │
│  │   Venues    │  │  ├────────────────────────────────────┤ │    │
│  │   Gigs      │  │  │ John  Acme Inc  @📧 📞  [Edit][Del]│ │    │
│  │   DJs       │  │  │ Jane  XYZ Corp  @📧 📞  [Edit][Del]│ │    │
│  │   Billing   │  │  │ ...                                │ │    │
│  │             │  │  └────────────────────────────────────┘ │    │
│  │ ─────────── │  │                                         │    │
│  │             │  └────────────────────────────────────────┘    │
│  │ [User Info] │                                                │
│  │ John Doe    │                                                │
│  │ [Sign Out]▼ │                                                │
│  └─────────────┘                                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Page Navigation Map

```
/dashboard
    │
    ├─> /customers ──┐
    │                │
    ├─> /venues ─────┤
    │                ├─> Each page has:
    ├─> /gigs ───────┤   - Breadcrumb navigation
    │                │   - Heading with description
    ├─> /djs ────────┤   - View toggles (where applicable)
    │                │   - Create button
    └─> /billing ────┘   - Data table with actions
                         - CRUD operations
```

## Component Hierarchy

```
App
├── BrowserRouter
    ├── Index (Landing Page)
    ├── Auth (Sign In / Register)
    ├── Dashboard (Redirect based on role)
    └── Protected Routes (AuthGuard)
        ├── CustomersPage
        │   └── AppLayout
        │       ├── Sidebar (with navigation)
        │       ├── Navbar (mobile)
        │       └── Content
        │           ├── Breadcrumb
        │           ├── Heading
        │           └── CustomersView
        │               ├── ViewMode Toggle
        │               ├── Create Button
        │               ├── CustomersList (Table)
        │               │   └── Actions (Edit, Delete, Note)
        │               └── CustomersGrid
        │
        ├── VenuesPage (similar structure)
        ├── GigsPage (similar structure)
        ├── DJsPage (similar structure)
        └── BillingPage (similar structure)
```

## Data Flow

```
User Action
    │
    ▼
Component Event Handler
    │
    ▼
Supabase Query/Mutation
    │
    ├─> Success
    │   ├─> Update Local State
    │   ├─> Show Success Toast
    │   └─> Reload Data
    │
    └─> Error
        ├─> Catch Error
        ├─> Show Error Toast
        └─> Keep Previous State
```

## Key Features by Page

### Customers (`/dashboard/customers`)
- View: Table / Grid toggle
- Create: Dialog form
- Actions: Edit (placeholder), Delete (✓), Add Note (placeholder)
- Fields: Name, Business, Email, Phone

### Venues (`/dashboard/venues`)
- View: Table / Grid toggle
- Create: Dialog form
- Actions: Edit (placeholder), Delete (placeholder)
- Fields: Name, Address, Type

### Gigs (`/dashboard/gigs`)
- View: Table only
- Create: Dialog form with recurring options
- Actions: 
  - Assign DJ (placeholder)
  - Edit (placeholder)
  - Mark Complete (✓)
  - Cancel (✓)
- Fields: Date/Time, Customer, Venue, Amount, Status
- Status Colors: Draft (zinc), Scheduled (sky), In Progress (amber), Completed (lime), Canceled (red)

### DJs (`/dashboard/djs`)
- View: Table / Grid toggle
- Create: Dialog form
- Actions: 
  - Upload Document (placeholder)
  - View Documents (placeholder)
  - Edit (placeholder)
  - Delete (✓)
- Fields: Name, Email, Phone, Employment Status, Document Count

### Billing (`/dashboard/billing`)
- View: Tab-based (Invoices / Payouts)
- Stats Dashboard: Total Quoted, Invoiced, Received, Pending Payouts
- Invoices Table: Customer, Amounts, Status
- Payouts Table: DJ, Customer, Event Date, Amount

## Catalyst UI Components Used

### Layout
- `SidebarLayout` - Main layout wrapper
- `Sidebar` - Navigation sidebar
  - `SidebarHeader` - Branding area
  - `SidebarBody` - Navigation items
  - `SidebarFooter` - User profile
  - `SidebarItem` - Individual nav links
  - `SidebarLabel` - Nav item text
- `Navbar` - Mobile top navigation
- `Breadcrumb` - Custom breadcrumb component

### Content
- `Heading` - Page titles
- `Text` - Descriptions and body text
- `Button` - All action buttons (with color prop)
- `Badge` - Status indicators (with color prop)

### Data Display
- `Table` - Data tables
  - `TableHead` - Table header
  - `TableBody` - Table body
  - `TableRow` - Table rows
  - `TableHeader` - Column headers
  - `TableCell` - Table cells

### Interactive
- `Dropdown` - User menu
  - `DropdownButton` - Trigger button
  - `DropdownMenu` - Menu container
  - `DropdownItem` - Menu items
- `Avatar` - User avatars

### Icons (lucide-react)
- Users, MapPin, Calendar, Disc3, DollarSign
- Pencil, Trash2, Plus, CheckCircle, XCircle
- UserPlus, Upload, Eye, FileText
- Mail, Phone, Building2, LayoutGrid, Table

## Responsive Breakpoints

```
Mobile (< 1024px)
├─ Hamburger menu
├─ Top navbar visible
└─ Sidebar hidden (drawer)

Desktop (≥ 1024px)
├─ Persistent sidebar
├─ Navbar hidden
└─ Full layout visible
```

## Color System (Catalyst)

```
Neutral Actions: zinc (gray)
Destructive: red
Success: lime (green)
Info: sky (blue)
Warning: amber (yellow/orange)
```

## Authentication Flow

```
┌────────────┐
│  Unauthenticated  │
└────────┬───────────┘
         │
         ▼
   [Auth Page]
         │
         ▼
   [Sign In]
         │
         ▼
  Supabase Auth
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  Admin      DJ
    │         │
    ▼         ▼
 Dashboard  Schedule
(/customers) (/schedule)
```

## Future Architecture Considerations

### Potential Additions
1. **State Management**: Consider Redux/Zustand for complex state
2. **Cache Layer**: React Query for better data caching
3. **Optimistic Updates**: Immediate UI feedback
4. **WebSockets**: Real-time updates for collaborative features
5. **Service Workers**: Offline support
6. **Analytics**: User behavior tracking
7. **Error Boundary**: Better error handling UI

### Scalability
- Code splitting by route (already supported by Vite)
- Lazy loading of heavy components
- Pagination for large datasets
- Virtual scrolling for very long lists
- Image optimization and lazy loading

This architecture provides a solid foundation for a scalable, maintainable DJ and event management platform with room for future enhancements.
