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
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const dashboardData = await response.json()
      setData(dashboardData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
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
    refetch
  }
}