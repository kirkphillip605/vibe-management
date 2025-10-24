import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/sidebar'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/dropdown'
import { Avatar } from '@/components/avatar'
import {
  Users,
  MapPin,
  Calendar,
  Disc3,
  DollarSign,
  LogOut,
  ChevronDown,
} from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single()

      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        setUserName(profile.full_name)
        setUserEmail(profile.email)
      }
      if (role) setUserRole(role.role)
    }

    loadUserData()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
    toast({
      title: 'Signed out successfully',
    })
  }

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar initials={userName.split(' ').map((n) => n[0]).join('')} square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/settings">
                  <div className="flex flex-col">
                    <span className="font-medium">{userName}</span>
                    <span className="text-xs text-zinc-500">{userEmail}</span>
                  </div>
                </DropdownItem>
                <DropdownItem onClick={handleSignOut}>
                  <LogOut data-slot="icon" />
                  <span>Sign Out</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300">
                <Disc3 className="h-6 w-6 text-white dark:text-zinc-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Vibe Management</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {userRole === 'admin' ? 'Admin Dashboard' : 'DJ Dashboard'}
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarBody>
            {userRole === 'admin' ? (
              <SidebarSection>
                <SidebarItem href="/dashboard/customers" current={isCurrentPath('/dashboard/customers')}>
                  <Users data-slot="icon" />
                  <SidebarLabel>Customers</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/dashboard/venues" current={isCurrentPath('/dashboard/venues')}>
                  <MapPin data-slot="icon" />
                  <SidebarLabel>Venues</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/dashboard/gigs" current={isCurrentPath('/dashboard/gigs')}>
                  <Calendar data-slot="icon" />
                  <SidebarLabel>Gigs</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/dashboard/djs" current={isCurrentPath('/dashboard/djs')}>
                  <Disc3 data-slot="icon" />
                  <SidebarLabel>DJs</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/dashboard/billing" current={isCurrentPath('/dashboard/billing')}>
                  <DollarSign data-slot="icon" />
                  <SidebarLabel>Billing</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            ) : (
              <SidebarSection>
                <SidebarItem href="/dashboard/schedule" current={isCurrentPath('/dashboard/schedule')}>
                  <Calendar data-slot="icon" />
                  <SidebarLabel>My Schedule</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/dashboard/payouts" current={isCurrentPath('/dashboard/payouts')}>
                  <DollarSign data-slot="icon" />
                  <SidebarLabel>My Payouts</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            )}
          </SidebarBody>

          <SidebarFooter>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar initials={userName.split(' ').map((n) => n[0]).join('')} className="size-10" square />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {userName}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {userEmail}
                    </span>
                  </span>
                </span>
                <ChevronDown data-slot="icon" />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem onClick={handleSignOut}>
                  <LogOut data-slot="icon" />
                  <span>Sign Out</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
