'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

type LinkedInAccount = {
  id: string
  linkedin_id: string
  display_name: string | null
  profile_picture_url: string | null
  headline: string | null
  is_primary: boolean
  is_active: boolean
}

interface LinkedInAccountSelectorProps {
  selectedAccountId?: string
  onAccountSelect: (accountId: string) => void
  className?: string
}

export function LinkedInAccountSelector({ 
  selectedAccountId, 
  onAccountSelect, 
  className 
}: LinkedInAccountSelectorProps) {
  const [accounts, setAccounts] = useState<LinkedInAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLinkedInAccounts()
  }, [])

  useEffect(() => {
    // Auto-select primary account if no account is selected
    if (!selectedAccountId && accounts.length > 0) {
      const primaryAccount = accounts.find(account => account.is_primary)
      if (primaryAccount) {
        onAccountSelect(primaryAccount.id)
      }
    }
  }, [accounts, selectedAccountId, onAccountSelect])

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
    try {
      const response = await fetch('/api/linkedin/connect?force_reauth=true')
      if (response.ok) {
        const { authUrl } = await response.json()
        window.location.href = authUrl
      }
    } catch (error) {
      console.error('Failed to connect LinkedIn:', error)
    }
  }

  if (loading) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              <span className="text-sm text-gray-600">Loading LinkedIn accounts...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className={className}>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              No LinkedIn Accounts Connected
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-yellow-700 mb-3">
              Connect a LinkedIn account to publish this post
            </p>
            <Button size="sm" onClick={connectLinkedIn}>
              Connect LinkedIn
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedAccount = accounts.find(account => account.id === selectedAccountId)

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Publish to LinkedIn Account</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={selectedAccountId} onValueChange={onAccountSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select LinkedIn account">
                {selectedAccount && (
                  <div className="flex items-center space-x-2">
                    {selectedAccount.profile_picture_url ? (
                      <Image 
                        src={selectedAccount.profile_picture_url} 
                        alt={selectedAccount.display_name || 'LinkedIn Profile'}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.5 6v11.5c0 .5-.5 1-1 1h-3v-6.5c0-.5-.5-1-1-1s-1 .5-1 1v6.5h-3c-.5 0-1-.5-1-1V6c0-.5.5-1 1-1h3v1.5c.5-.5 1.5-1.5 3-1.5s2.5 1 2.5 2.5z"/>
                        </svg>
                      </div>
                    )}
                    <span className="text-sm">
                      {selectedAccount.display_name || 'LinkedIn User'}
                      {selectedAccount.is_primary && (
                        <span className="text-xs text-green-600 ml-1">(Primary)</span>
                      )}
                    </span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center space-x-2">
                    {account.profile_picture_url ? (
                      <Image 
                        src={account.profile_picture_url} 
                        alt={account.display_name || 'LinkedIn Profile'}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.5 6v11.5c0 .5-.5 1-1 1h-3v-6.5c0-.5-.5-1-1-1s-1 .5-1 1v6.5h-3c-.5 0-1-.5-1-1V6c0-.5.5-1 1-1h3v1.5c.5-.5 1.5-1.5 3-1.5s2.5 1 2.5 2.5z"/>
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {account.display_name || 'LinkedIn User'}
                        {account.is_primary && (
                          <span className="text-xs text-green-600 ml-1">(Primary)</span>
                        )}
                      </div>
                      {account.headline && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {account.headline}
                        </div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
            </p>
            <Button variant="outline" size="sm" onClick={connectLinkedIn}>
              Add Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}