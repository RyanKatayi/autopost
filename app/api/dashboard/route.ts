import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Dashboard API called')
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('User check:', { user: user?.id, error: userError })
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's posts with counts by status
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Posts fetch error:', postsError)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    // Calculate statistics
    const stats = {
      total: posts?.length || 0,
      drafts: posts?.filter(p => p.status === 'draft').length || 0,
      scheduled: posts?.filter(p => p.status === 'scheduled').length || 0,
      published: posts?.filter(p => p.status === 'published').length || 0,
      failed: posts?.filter(p => p.status === 'failed').length || 0,
    }

    // Get recent posts analytics - use left join to get all posts with optional analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('post_analytics')
      .select(`
        *,
        posts!inner(id, title, status, user_id)
      `)
      .eq('posts.user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(10)

    // Also get posts without analytics for a complete view
    const { error: postsAnalyticsError } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        status,
        created_at,
        post_analytics(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get LinkedIn accounts for platform data
    const { data: linkedinAccounts, error: linkedinError } = await supabase
      .from('linkedin_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (analyticsError) {
      console.error('Analytics fetch error:', analyticsError)
    }
    
    if (postsAnalyticsError) {
      console.error('Posts analytics fetch error:', postsAnalyticsError)
    }
    
    if (linkedinError) {
      console.error('LinkedIn accounts fetch error:', linkedinError)
    }

    // Use only real analytics data
    const displayTotalImpressions = analytics?.reduce((sum, a) => sum + (a.impressions || 0), 0) || 0
    const displayTotalEngagement = analytics?.reduce((sum, a) => sum + (a.likes || 0) + (a.comments || 0) + (a.shares || 0), 0) || 0
    const displayTotalClicks = analytics?.reduce((sum, a) => sum + (a.clicks || 0), 0) || 0
    const displayAvgEngagementRate = analytics && analytics.length > 0 
      ? (analytics.reduce((sum, a) => sum + (parseFloat(a.engagement_rate) || 0), 0) / analytics.length).toFixed(2)
      : '0.00'

    const dashboardData = {
      stats,
      metrics: {
        todaysPosts: {
          value: displayTotalImpressions,
          change: '0%',
          trending: 'up'
        },
        upcomingPosts: {
          value: displayTotalEngagement,
          change: '0%',
          trending: 'up'
        },
        newUsers: {
          value: displayTotalClicks,
          change: '0%',
          trending: 'up'
        },
        activeUsers: {
          value: parseFloat(displayAvgEngagementRate),
          change: '0%',
          trending: 'up'
        }
      },
      recentPosts: posts?.slice(0, 5) || [],
      analytics: analytics?.slice(0, 5) || [],
      linkedinAccounts: linkedinAccounts || [],
      platformStats: {
        linkedin: {
          accounts: linkedinAccounts?.length || 0,
          posts: posts?.filter(p => p.linkedin_post_id).length || 0,
          percentage: posts?.length > 0 ? ((posts.filter(p => p.linkedin_post_id).length / posts.length) * 100).toFixed(0) : 0
        }
      },
      hasRealAnalytics: analytics && analytics.length > 0
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}