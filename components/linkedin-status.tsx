'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function LinkedInStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    checkLinkedInStatus()
  }, [])

  const checkLinkedInStatus = async () => {
    try {
      const response = await fetch('/api/linkedin/test')
      if (response.ok) {
        setIsConnected(true)
      } else if (response.status === 400) {
        // 400 means LinkedIn not connected, which is expected
        setIsConnected(false)
      } else {
        // Other errors (401, 500, etc.)
        console.error('LinkedIn test error:', response.status)
        setIsConnected(false)
      }
    } catch (error) {
      console.error('LinkedIn test request failed:', error)
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const connectLinkedIn = async () => {
    setConnecting(true)
    try {
      const response = await fetch('/api/linkedin/connect')
      if (response.ok) {
        const { authUrl } = await response.json()
        // Redirect user to LinkedIn OAuth page
        window.location.href = authUrl
      } else {
        throw new Error('Failed to get auth URL')
      }
    } catch {
      alert('Failed to connect to LinkedIn. Please try again.')
      setConnecting(false)
    }
  }

  const disconnectLinkedIn = async () => {
    if (!confirm('Are you sure you want to disconnect your LinkedIn account?')) {
      return
    }

    setConnecting(true)
    try {
      const response = await fetch('/api/linkedin/connect', {
        method: 'DELETE'
      })
      if (response.ok) {
        setIsConnected(false)
      } else {
        throw new Error('Failed to disconnect')
      }
    } catch {
      alert('Failed to disconnect from LinkedIn. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Checking LinkedIn connection...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <svg className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <div>
            <p className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              LinkedIn {isConnected ? 'Connected' : 'Not Connected'}
            </p>
            <p className={`text-xs ${isConnected ? 'text-green-600' : 'text-yellow-600'}`}>
              {isConnected 
                ? 'You can publish posts directly to LinkedIn' 
                : 'Connect your LinkedIn account to publish posts'}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant={isConnected ? 'outline' : 'default'}
          onClick={isConnected ? disconnectLinkedIn : connectLinkedIn}
          disabled={connecting}
        >
          {connecting ? 'Processing...' : (isConnected ? 'Disconnect' : 'Connect LinkedIn')}
        </Button>
      </CardContent>
    </Card>
  )
}