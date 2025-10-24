import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layouts/AppLayout'
import { Breadcrumb } from '@/components/breadcrumb'
import { Heading } from '@/components/heading'
import { CustomersView } from '@/components/customers/CustomersView'

export default function CustomersPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Customers' }]} />
        <div className="mt-4">
          <Heading>Customers</Heading>
          <div className="mt-6">
            <CustomersView />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
