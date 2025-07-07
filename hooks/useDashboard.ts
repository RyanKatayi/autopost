'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  total: number
  drafts: number
  scheduled: number
  published: number
  failed: number
}

interface DashboardMetric {
  value: number
  change: string
  trending: 'up' | 'down'
}

interface DashboardMetrics {
  todaysPosts: DashboardMetric
  upcomingPosts: DashboardMetric
  newUsers: DashboardMetric
  activeUsers: DashboardMetric
}

interface Post {
  id: string
  title: string
  content: string
  status: string
  created_at: string
  scheduled_at?: string
  published_at?: string
}

interface Analytics {
  id: string
  impressions: number
  clicks: number
  likes: number
  comments: number
  shares: number
  engagement_rate: number
  recorded_at: string
}

interface DashboardData {
  stats: DashboardStats
  metrics: DashboardMetrics
  recentPosts: Post[]
  analytics: Analytics[]
  linkedinAccounts: any[]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false) // Start with false for background loading
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log('Starting dashboard fetch...')
      
      const response = await fetch('/api/dashboard', {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })
      
      console.log('Dashboard fetch response:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Dashboard API error response:', errorText)
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }
      
      const dashboardData = await response.json()
      console.log('Dashboard data received:', dashboardData)
      setData(dashboardData)
      setError(null)
      setInitialLoad(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Dashboard fetch error:', err)
      setInitialLoad(false)
    } finally {
      setLoading(false)
      console.log('Dashboard fetch completed')
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const refetch = () => {
    fetchDashboardData()
  }

  return {
    data,
    loading,
    error,
    initialLoad,
    refetch
  }
}