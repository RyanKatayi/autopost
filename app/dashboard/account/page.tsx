'use client'

import { useSupabase } from '@/contexts/supabase-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LinkedInStatus } from '@/components/linkedin-status'
import { DashboardSidebar } from '@/components/dashboard-sidebar'

export default function AccountSettings() {
  const { user, supabase } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-400"></div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Integration */}
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Integration</CardTitle>
                <CardDescription>
                  Connect your LinkedIn account to publish posts directly from AutoPost AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LinkedInStatus />
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    When you connect your LinkedIn account, AutoPost AI will be able to:
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>View your LinkedIn profile information</li>
                    <li>Publish posts on your behalf</li>
                    <li>Track post engagement metrics</li>
                  </ul>
                  <p className="mt-3 text-xs text-gray-500">
                    Your LinkedIn credentials are securely stored and you can disconnect at any time.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}