'use client'

import { useSupabase } from '@/contexts/supabase-context'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/hooks/useDashboard'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { DashboardSidebar } from '@/components/dashboard-sidebar'


export default function Dashboard() {
  const { user, supabase } = useSupabase()
  const router = useRouter()
  const { data: dashboardData, loading, error, refetch } = useDashboard()

  useEffect(() => {
    if (!user) {
      router.push('/')
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

  // Show placeholder data while loading for the first time
  const displayData = dashboardData || {
    stats: { drafts: 0, scheduled: 0, published: 0, failed: 0, total: 0 },
    linkedinAccounts: [],
    recentPosts: [],
    analytics: []
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Oops! Something went wrong</h3>
            <p className="text-slate-600">Error loading dashboard: {error}</p>
          </div>
          <Button onClick={refetch} className="bg-green-600 hover:bg-green-700 text-white">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:flex-shrink-0">
          <DashboardSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <header className="bg-card/80 backdrop-blur-sm border-b border-white/10">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Dashboard</h1>
                    {loading && (
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Welcome back! Here&apos;s your social media overview</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3"
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 lg:pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">Today&apos;s Overview</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Track your social media performance and engagement</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Last updated: {new Date().toLocaleTimeString()}</span>
                    <span className="sm:hidden">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Accounts Connected"
                  value={displayData?.linkedinAccounts?.length || 0}
                  icon={<svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                  description="LinkedIn accounts"
                />
                <StatCard
                  title="Drafts"
                  value={displayData?.stats.drafts || 0}
                  icon={<svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
                  description="Ready to publish"
                />
                <StatCard
                  title="Scheduled"
                  value={displayData?.stats.scheduled || 0}
                  icon={<svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  description="Posts queued"
                />
                <StatCard
                  title="Published"
                  value={displayData?.stats.published || 0}
                  icon={<svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  description="Live posts"
                />
              </div>

              {/* Analytics Summary - Only show if real analytics data exists */}
              {displayData?.analytics?.length > 0 && (
                <div className="mb-10">
                  <Card className="bg-card border shadow-xl">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <CardTitle className="text-xl font-bold text-foreground">Recent Analytics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {displayData.analytics.map((analytic) => (
                          <div key={analytic.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-xl border hover:shadow-md transition-all duration-200">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-foreground">Post Analytics</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(analytic.recorded_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-8 text-sm">
                              <div className="text-center">
                                <div className="font-bold text-lg text-green-600">{analytic.impressions?.toLocaleString() || 0}</div>
                                <div className="text-xs text-muted-foreground">Impressions</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-lg text-green-600">{analytic.clicks?.toLocaleString() || 0}</div>
                                <div className="text-xs text-muted-foreground">Clicks</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-lg text-destructive">{analytic.likes || 0}</div>
                                <div className="text-xs text-muted-foreground">Likes</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-lg text-green-600">{analytic.engagement_rate || 0}%</div>
                                <div className="text-xs text-muted-foreground">Engagement</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Content Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Post Activity Section */}
                  <Card>
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <CardTitle className="text-xl font-semibold">Post Activity</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-xs sm:text-sm">All Time</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                            <div>
                              <div className="text-2xl font-bold text-destructive">{displayData?.stats.failed || 0}</div>
                              <span className="text-sm text-destructive">Failed</span>
                            </div>
                            <div className="text-destructive/50">
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                            <div>
                              <div className="text-2xl font-bold text-green-600">{displayData?.stats.drafts || 0}</div>
                              <span className="text-sm text-green-600">Drafts</span>
                            </div>
                            <div className="text-green-600/50">
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                            <div>
                              <div className="text-2xl font-bold text-green-600">{displayData?.stats.scheduled || 0}</div>
                              <span className="text-sm text-green-600">Scheduled</span>
                            </div>
                            <div className="text-green-600/50">
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                            <div>
                              <div className="text-2xl font-bold text-green-600">{displayData?.stats.published || 0}</div>
                              <span className="text-sm text-green-600">Published</span>
                            </div>
                            <div className="text-green-600/50">
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Posts</span>
                            <span className="text-lg font-semibold">{displayData?.stats.total || 0}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                  <Card className="bg-card border shadow-lg">
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                          <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5z" />
                          </svg>
                        </div>
                        <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Accounts</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {displayData?.linkedinAccounts?.length > 0 ? (
                          <>
                            <div className="flex items-start space-x-3 p-3 bg-green-100 rounded-lg border">
                              <div className="w-3 h-3 bg-primary rounded-full mt-1.5"></div>
                              <div>
                                <p className="text-sm font-medium text-green-600">
                                  {displayData.linkedinAccounts.length} LinkedIn account{displayData.linkedinAccounts.length > 1 ? 's' : ''} connected
                                </p>
                                <p className="text-xs text-green-600/80 mt-1">Ready to publish content</p>
                              </div>
                            </div>
                            {displayData.stats.scheduled > 0 && (
                              <div className="flex items-start space-x-3 p-3 bg-green-100 rounded-lg border">
                                <div className="w-3 h-3 bg-primary rounded-full mt-1.5"></div>
                                <div>
                                  <p className="text-sm font-medium text-green-600">
                                    {displayData.stats.scheduled} post{displayData.stats.scheduled > 1 ? 's' : ''} scheduled
                                  </p>
                                  <p className="text-xs text-green-600/80 mt-1">Automated publishing active</p>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-start space-x-3 p-3 bg-destructive/10 rounded-lg border">
                            <div className="w-3 h-3 bg-destructive rounded-full mt-1.5"></div>
                            <div>
                              <p className="text-sm font-medium text-destructive">No LinkedIn accounts connected</p>
                              <p className="text-xs text-destructive/80 mt-1">Connect an account to start posting</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card border shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground">Recent Activities</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {displayData?.recentPosts?.length > 0 ? (
                          displayData.recentPosts.slice(0, 3).map((post) => (
                            <div key={post.id} className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg border hover:shadow-sm transition-all duration-200">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                                post.status === 'published' ? 'bg-green-100 text-green-600' :
                                post.status === 'scheduled' ? 'bg-green-100 text-green-600' :
                                'bg-destructive/10 text-destructive'
                              }`}>
                                {post.status === 'published' ? 'P' : post.status === 'scheduled' ? 'S' : 'D'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {post.status === 'published' ? 'Published' : post.status === 'scheduled' ? 'Scheduled' : 'Draft'}: {post.title?.slice(0, 25) || 'Untitled'}...
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg border">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                              <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">No recent posts</p>
                              <p className="text-xs text-muted-foreground mt-1">Create your first post to get started</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}