import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layouts/AppLayout'
import { Breadcrumb } from '@/components/breadcrumb'
import { Heading } from '@/components/heading'
import { VenuesView } from '@/components/venues/VenuesView'

export default function VenuesPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Venues' }]} />
        <div className="mt-4">
          <Heading>Venues</Heading>
          <div className="mt-6">
            <VenuesView />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
