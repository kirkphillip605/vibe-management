import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layouts/AppLayout'
import { Breadcrumb } from '@/components/breadcrumb'
import { Heading } from '@/components/heading'
import { DJsView } from '@/components/djs/DJsView'

export default function DJsPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'DJs' }]} />
        <div className="mt-4">
          <Heading>DJs</Heading>
          <div className="mt-6">
            <DJsView />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
