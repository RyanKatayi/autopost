'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type LinkedInAccount = {
  id: string
  linkedin_id: string
  display_name: string | null
  profile_picture_url: string | null
  headline: string | null
  is_primary: boolean
  is_active: boolean
  last_used_at: string
}

export function LinkedInStatusMulti() {
  const [accounts, setAccounts] = useState<LinkedInAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    loadLinkedInAccounts()
  }, [])

  const loadLinkedInAccounts = async () => {
    try {
      const response = await fetch('/api/linkedin/accounts')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts || [])
      }
    } catch (error) {
      console.error('Failed to load LinkedIn accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectLinkedIn = async () => {
    setConnecting(true)
    try {
      const response = await fetch('/api/linkedin/connect?force_reauth=true')
      if (response.ok) {
        const { authUrl } = await response.json()
        window.location.href = authUrl
      } else {
        throw new Error('Failed to get auth URL')
      }
    } catch {
      alert('Failed to connect to LinkedIn. Please try again.')
      setConnecting(false)
    }
  }

  const setPrimaryAccount = async (accountId: string) => {
    try {
      const response = await fetch('/api/linkedin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, action: 'setPrimary' })
      })
      if (response.ok) {
        await loadLinkedInAccounts()
      }
    } catch (error) {
      console.error('Failed to set primary account:', error)
      alert('Failed to set primary account. Please try again.')
    }
  }

  const removeAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to remove this LinkedIn account?')) {
      return
    }

    try {
      const response = await fetch('/api/linkedin/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId })
      })
      if (response.ok) {
        await loadLinkedInAccounts()
      }
    } catch (error) {
      console.error('Failed to remove account:', error)
      alert('Failed to remove account. Please try again.')
    }
  }

  if (loading) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            <span className="text-sm text-gray-600">Loading LinkedIn accounts...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={accounts.length > 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            LinkedIn Accounts ({accounts.length})
          </CardTitle>
          <Button
            size="sm"
            onClick={connectLinkedIn}
            disabled={connecting}
          >
            {connecting ? 'Processing...' : 'Add Account'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {accounts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-2">No LinkedIn accounts connected</p>
            <p className="text-xs text-gray-500">Connect your first LinkedIn account to start publishing</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm"
            >
              <div className="flex items-center space-x-3">
                {account.profile_picture_url ? (
                  <Image 
                    src={account.profile_picture_url} 
                    alt={account.display_name || 'LinkedIn Profile'}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.5 6v11.5c0 .5-.5 1-1 1h-3v-6.5c0-.5-.5-1-1-1s-1 .5-1 1v6.5h-3c-.5 0-1-.5-1-1V6c0-.5.5-1 1-1h3v1.5c.5-.5 1.5-1.5 3-1.5s2.5 1 2.5 2.5z"/>
                    </svg>
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {account.display_name || 'LinkedIn User'}
                    </p>
                    {account.is_primary && (
                      <Badge variant="default" className="text-xs">Primary</Badge>
                    )}
                  </div>
                  {account.headline && (
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {account.headline}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Last used: {new Date(account.last_used_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!account.is_primary && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPrimaryAccount(account.id)}
                    className="text-xs"
                  >
                    Set Primary
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeAccount(account.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
        
        {accounts.length > 0 && (
          <div className="text-xs text-gray-500 text-center pt-2">
            Posts will be published to your primary account by default
          </div>
        )}
      </CardContent>
    </Card>
  )
}