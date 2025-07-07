'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Image from 'next/image'
import { useSupabase } from '@/contexts/supabase-context'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { LinkedInStatus } from '@/components/linkedin-status'
import { DashboardSidebar } from '@/components/dashboard-sidebar'

interface GeneratedPost {
  id: string
  title: string
  content: string
  hashtags: string[]
  suggestedTime?: string
  status: string
  images?: string[]
}

interface UploadedImage {
  url: string
  filename: string
  size: number
  type: string
  isReal?: boolean
  previewUrl?: string // For showing the actual image preview
}

function CreatePostContent() {
  const { user, supabase } = useSupabase()
  const searchParams = useSearchParams()
  const router = useRouter()
  const postId = searchParams.get('postId')
  
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'thought-leadership' | 'storytelling'>('professional')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [includeQuestion, setIncludeQuestion] = useState(false)
  const [targetAudience, setTargetAudience] = useState('')
  // Removed AI provider selection - using Gemini only
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [savedPostId, setSavedPostId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [linkedinAccounts, setLinkedinAccounts] = useState<{id: string; display_name: string; is_primary: boolean; profile_picture_url?: string}[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
  const [settingPrimary, setSettingPrimary] = useState(false)

  // Define functions first
  const fetchLinkedInAccounts = useCallback(async () => {
    try {
      const { data: accounts, error } = await supabase
        .from('linkedin_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false })

      if (error) throw error

      setLinkedinAccounts(accounts || [])
      
      // Set primary account as default or first account
      const primaryAccount = accounts?.find(acc => acc.is_primary)
      const defaultAccount = primaryAccount || accounts?.[0]
      if (defaultAccount) {
        setSelectedAccountId(defaultAccount.id)
      }
    } catch (error) {
      console.error('Error fetching LinkedIn accounts:', error)
    }
  }, [supabase, user])

  const setPrimaryAccount = async (accountId: string) => {
    setSettingPrimary(true)
    try {
      const response = await fetch('/api/linkedin/set-primary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      })

      if (!response.ok) {
        throw new Error('Failed to set primary account')
      }

      // Refresh accounts to show updated primary status
      await fetchLinkedInAccounts()
      alert('Primary account updated successfully!')
    } catch (error) {
      console.error('Error setting primary account:', error)
      alert('Failed to set primary account')
    } finally {
      setSettingPrimary(false)
    }
  }

  const loadExistingPost = useCallback(async (id: string) => {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single()

      if (error) throw error

      if (post) {
        setIsEditMode(true)
        setSavedPostId(post.id)
        setTopic(post.content) // Use content as topic for regeneration
        
        // Set the generated post data
        setGeneratedPost({
          id: post.id,
          title: post.title,
          content: post.content,
          hashtags: post.hashtags || [],
          status: post.status,
          images: post.images || [],
          suggestedTime: post.scheduled_at
        })

        // Load images if any
        if (post.images && post.images.length > 0) {
          const images = post.images.map((url: string, index: number) => ({
            url,
            filename: `image-${index + 1}.jpg`,
            size: 0,
            type: 'image/jpeg',
            isReal: true
          }))
          setUploadedImages(images)
        }
      }
    } catch (error) {
      console.error('Error loading post:', error)
      alert('Failed to load post')
    }
  }, [supabase, user])

  // Load LinkedIn accounts
  useEffect(() => {
    if (user) {
      fetchLinkedInAccounts()
    }
  }, [user, fetchLinkedInAccounts])

  // Load existing post if postId is provided
  useEffect(() => {
    if (postId && user) {
      loadExistingPost(postId)
    }
  }, [postId, user, loadExistingPost])

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/posts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          tone,
          length,
          includeHashtags,
          includeQuestion,
          targetAudience: targetAudience || undefined,
          // Using Gemini as the only AI provider
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const post = await response.json()
      setGeneratedPost(post)
    } catch (error) {
      alert('Failed to generate post. Please try again.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload called', event.target.files)
    const file = event.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    console.log('Selected file:', file.name, file.type, file.size)
    setUploading(true)
    
    try {
      // Create preview URL from the actual file
      const previewUrl = URL.createObjectURL(file)
      console.log('Created preview URL:', previewUrl)

      const formData = new FormData()
      formData.append('file', file)

      console.log('Sending upload request...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      console.log('Upload response status:', response.status)
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload error response:', errorData)
        throw new Error(errorData.error || 'Upload failed')
      }

      const uploadedImage = await response.json()
      console.log('Upload successful:', uploadedImage)
      
      // Add the preview URL so we can show the actual image
      const imageWithPreview = {
        ...uploadedImage,
        previewUrl
      }
      
      setUploadedImages(prev => [...prev, imageWithPreview])
      
      // Clear the input so the same file can be uploaded again
      event.target.value = ''
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const imageToRemove = prev[index]
      // Clean up the object URL to prevent memory leaks
      if (imageToRemove.previewUrl) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  // Clean up object URLs when component unmounts or form resets
  const cleanupImages = () => {
    uploadedImages.forEach(image => {
      if (image.previewUrl) {
        URL.revokeObjectURL(image.previewUrl)
      }
    })
  }

  const handleSavePost = async (status: 'draft' | 'scheduled') => {
    if (!generatedPost || !user) return

    setSaving(true)
    try {
      if (isEditMode && savedPostId) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({
            title: generatedPost.title,
            content: generatedPost.content,
            images: uploadedImages.map(img => img.url),
            hashtags: generatedPost.hashtags || [],
            status: status,
            scheduled_at: status === 'scheduled' ? generatedPost.suggestedTime : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', savedPostId)

        if (error) throw error
        alert(`Post updated as ${status} successfully!`)
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert({
            user_id: user.id,
            title: generatedPost.title,
            content: generatedPost.content,
            images: uploadedImages.map(img => img.url),
            hashtags: generatedPost.hashtags || [],
            status: status,
            scheduled_at: status === 'scheduled' ? generatedPost.suggestedTime : null
          })

        if (error) throw error

        // Get the saved post ID
        const { data: savedPost } = await supabase
          .from('posts')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (savedPost) {
          setSavedPostId(savedPost.id)
        }

        alert(`Post saved as ${status} successfully!`)
      }
      
      // Don't reset form in edit mode, just redirect back
      if (isEditMode) {
        router.push('/dashboard/posts')
      } else {
        // Reset form for new posts
        setGeneratedPost(null)
        setTopic('')
        cleanupImages()
        setUploadedImages([])
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePublishToLinkedIn = async () => {
    setPublishing(true)
    try {
      let postId = savedPostId
      
      // If post hasn't been saved yet, save it first
      if (!postId && generatedPost) {
        if (!user) {
          throw new Error('Not authenticated')
        }

        const { data, error } = await supabase
          .from('posts')
          .insert({
            user_id: user.id,
            title: generatedPost.title,
            content: generatedPost.content,
            images: uploadedImages.map(img => img.url),
            hashtags: generatedPost.hashtags || [],
            status: 'draft',
          })
          .select()
          .single()

        if (error) throw error
        postId = data.id
      }

      if (!postId) {
        throw new Error('No post to publish')
      }

      const response = await fetch('/api/posts/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postId,
          accountId: selectedAccountId 
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to publish')
      }

      await response.json()
      alert('Post published to LinkedIn successfully!')
      
      // Reset after successful publish
      setGeneratedPost(null)
      setSavedPostId(null)
      setTopic('')
      cleanupImages()
      setUploadedImages([])
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to publish to LinkedIn')
    } finally {
      setPublishing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-400"></div>
      </div>
    )
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
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditMode ? 'Edit Post' : 'Create Post'}
              </h2>
              {isEditMode && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Edit Mode
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5z" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  AI-Powered LinkedIn Post Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <form onSubmit={handleGenerate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="topic">Topic or Idea</Label>
                        <Textarea
                          id="topic"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          rows={3}
                          placeholder="Describe your post topic, share a URL, or provide key points..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tone">Tone</Label>
                        <Select value={tone} onValueChange={(value) => setTone(value as typeof tone)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                            <SelectItem value="storytelling">Storytelling</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">Length</Label>
                        <Select value={length} onValueChange={(value) => setLength(value as typeof length)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short (1-2 paragraphs)</SelectItem>
                            <SelectItem value="medium">Medium (2-3 paragraphs)</SelectItem>
                            <SelectItem value="long">Long (3-4 paragraphs)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
                        <Input
                          id="targetAudience"
                          type="text"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          placeholder="e.g., Software developers, Marketing managers..."
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">LinkedIn Account</Label>
                          <p className="text-xs text-muted-foreground mt-1 mb-3">
                            Select which account to publish to
                          </p>
                          
                          {linkedinAccounts.length > 0 ? (
                            <div className="space-y-3">
                              <Select value={selectedAccountId || ''} onValueChange={setSelectedAccountId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select LinkedIn account" />
                                </SelectTrigger>
                                <SelectContent>
                                  {linkedinAccounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id}>
                                      <div className="flex items-center space-x-2">
                                        {account.profile_picture_url && (
                                          <Image 
                                            src={account.profile_picture_url} 
                                            alt={account.display_name}
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 rounded-full"
                                          />
                                        )}
                                        <span>{account.display_name}</span>
                                        {account.is_primary && (
                                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                            Primary
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              {linkedinAccounts.length > 1 && (
                                <div className="p-3 bg-gray-50 rounded-md border">
                                  <p className="text-xs font-medium text-gray-700 mb-2">
                                    Manage Primary Account
                                  </p>
                                  <div className="space-y-2">
                                    {linkedinAccounts.map((account) => (
                                      <div key={account.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          {account.profile_picture_url && (
                                            <Image 
                                              src={account.profile_picture_url} 
                                              alt={account.display_name}
                                              width={16}
                                              height={16}
                                              className="w-4 h-4 rounded-full"
                                            />
                                          )}
                                          <span className="text-sm">{account.display_name}</span>
                                        </div>
                                        {account.is_primary ? (
                                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                            Primary
                                          </span>
                                        ) : (
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => setPrimaryAccount(account.id)}
                                            disabled={settingPrimary}
                                            className="text-xs px-2 py-1"
                                          >
                                            Set Primary
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-yellow-800 font-medium mb-1">
                                  No LinkedIn accounts connected
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Connect your LinkedIn account to start publishing posts
                                </p>
                              </div>
                              <LinkedInStatus />
                              <div className="text-center">
                                <Link 
                                  href="/dashboard/account" 
                                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                  Go to Account Settings →
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="images">Images (Optional)</Label>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="image-upload"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                              onClick={() => console.log('Label clicked')}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 20">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, WebP or GIF (MAX. 10MB)</p>
                              </div>
                            </label>
                            <input
                              id="image-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              onClick={() => console.log('Input clicked')}
                            />
                          </div>

                          <div className="flex justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                console.log('Button clicked, triggering file input')
                                document.getElementById('image-upload')?.click()
                              }}
                              disabled={uploading}
                            >
                              {uploading ? 'Uploading...' : 'Choose Image File'}
                            </Button>
                          </div>

                          {uploading && (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-400"></div>
                              <span className="text-sm text-gray-500">Uploading...</span>
                            </div>
                          )}

                          {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {uploadedImages.map((image, index) => (
                                <div key={index} className="relative group">
                                  <Image
                                    src={image.previewUrl || image.url}
                                    alt={image.filename}
                                    width={400}
                                    height={128}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                    {image.filename}
                                  </div>
                                  {!image.isReal && (
                                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                      DEMO
                                    </div>
                                  )}
                                  {image.isReal && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                      REAL
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeHashtags"
                            checked={includeHashtags}
                            onCheckedChange={(checked) => setIncludeHashtags(checked === true)}
                          />
                          <Label htmlFor="includeHashtags" className="text-sm font-normal">
                            Include hashtags
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeQuestion"
                            checked={includeQuestion}
                            onCheckedChange={(checked) => setIncludeQuestion(checked === true)}
                          />
                          <Label htmlFor="includeQuestion" className="text-sm font-normal">
                            Include engaging question
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                        size="lg"
                      >
                        {loading ? 'Generating...' : 'Generate Post'}
                      </Button>
                    </form>
                  </div>

                  <div>
                    {generatedPost && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-medium">
                            Generated Post
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Title:</Label>
                            <p className="text-muted-foreground">{generatedPost.title}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Content:</Label>
                            <div className="bg-muted p-4 rounded-md border whitespace-pre-wrap text-sm">
                              {generatedPost.content}
                            </div>
                          </div>

                          {uploadedImages.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium">Images:</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {uploadedImages.map((image, index) => (
                                  <Image
                                    key={index}
                                    src={image.previewUrl || image.url}
                                    alt={image.filename}
                                    width={400}
                                    height={128}
                                    className="w-full h-32 object-cover rounded-md border"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {generatedPost.hashtags && generatedPost.hashtags.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium">Hashtags:</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {generatedPost.hashtags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {generatedPost.suggestedTime && (
                            <div>
                              <Label className="text-sm font-medium">Suggested Time:</Label>
                              <p className="text-muted-foreground text-sm">
                                {new Date(generatedPost.suggestedTime).toLocaleString()}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-6">
                            <Button 
                              onClick={handlePublishToLinkedIn}
                              disabled={publishing}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {publishing ? 'Publishing...' : 'Publish to LinkedIn'}
                            </Button>
                            <Button 
                              onClick={() => handleSavePost('scheduled')}
                              disabled={saving || savedPostId !== null}
                              variant="outline"
                            >
                              {saving ? 'Saving...' : 'Schedule Post'}
                            </Button>
                            <Button 
                              onClick={() => handleSavePost('draft')}
                              disabled={saving || savedPostId !== null}
                              variant="secondary"
                            >
                              {saving ? 'Saving...' : 'Save as Draft'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {!generatedPost && (
                      <Card className="h-full">
                        <CardContent className="flex items-center justify-center h-full p-6">
                          <div className="text-center text-muted-foreground">
                            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p>Your generated post will appear here</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreatePost() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePostContent />
    </Suspense>
  )
}