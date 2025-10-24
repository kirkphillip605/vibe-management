import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layouts/AppLayout'
import { Breadcrumb } from '@/components/breadcrumb'
import { Heading } from '@/components/heading'
import { BillingView } from '@/components/billing/BillingView'

export default function BillingPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Billing' }]} />
        <div className="mt-4">
          <Heading>Billing</Heading>
          <div className="mt-6">
            <BillingView />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
