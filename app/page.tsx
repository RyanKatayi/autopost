'use client'

import { useSupabase } from '@/contexts/supabase-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const { user, loading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-400"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 to-yellow-300">
      {/* Navigation */}
      <nav className="bg-gray-900 bg-opacity-90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">AutoPost AI</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Home</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Pricing plan</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Blog</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">About us</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Contact us</a>
                <Link href="/privacy" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Privacy Policy</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link href="/login">
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
                A powerful tool to automate{' '}
                <span className="italic">your social media</span>
              </h1>
              <p className="mt-6 text-lg text-gray-700 max-w-2xl">
                Enhance your ROI with detailed reports. Analyze data that matters to your brand and develop the best marketing strategy.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Start your free trial
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  How it works?
                </Button>
              </div>
              <div className="mt-8">
                <svg 
                  className="w-24 h-12 text-gray-700" 
                  fill="none" 
                  viewBox="0 0 100 50" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 25 Q25 10 40 25 T70 25 L85 25 M75 15 L85 25 L75 35" 
                  />
                </svg>
                <p className="text-sm text-gray-600 mt-2">No credit card required</p>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="mt-12 lg:mt-0 lg:ml-8">
              <Card className="bg-white shadow-2xl">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">AutoPost AI Dashboard</div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className="bg-primary/10">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground mb-2">Today&apos;s post</CardTitle>
                        <div className="text-2xl font-bold">721K</div>
                        <div className="text-sm text-green-600">+11.01% ↗</div>
                      </CardHeader>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground mb-2">Upcoming post</CardTitle>
                        <div className="text-2xl font-bold">367K</div>
                        <div className="text-sm text-green-600">+11.01% ↗</div>
                      </CardHeader>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-orange-50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground mb-2">New Users</CardTitle>
                        <div className="text-2xl font-bold">1,156</div>
                        <div className="text-sm text-green-600">+11.01% ↗</div>
                      </CardHeader>
                    </Card>
                    <Card className="bg-purple-50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground mb-2">Active Users</CardTitle>
                        <div className="text-2xl font-bold">239K</div>
                        <div className="text-sm text-green-600">+11.01% ↗</div>
                      </CardHeader>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
