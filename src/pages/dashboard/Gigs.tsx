import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layouts/AppLayout'
import { Breadcrumb } from '@/components/breadcrumb'
import { Heading } from '@/components/heading'
import { GigsView } from '@/components/gigs/GigsView'

export default function GigsPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Gigs' }]} />
        <div className="mt-4">
          <Heading>Gigs</Heading>
          <div className="mt-6">
            <GigsView />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
