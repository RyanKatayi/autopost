'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/contexts/supabase-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText, 
  MoreVertical,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'

interface Post {
  id: string
  title: string
  content: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduled_at: string | null
  published_at: string | null
  linkedin_post_id: string | null
  images: string[] | null
  hashtags: string[] | null
  created_at: string
  updated_at: string
}

const statusConfig = {
  draft: {
    label: 'Drafts',
    icon: FileText,
    color: 'bg-gray-100 border-gray-200',
    badgeColor: 'bg-gray-100 text-gray-700',
    count: 0
  },
  scheduled: {
    label: 'Scheduled',
    icon: Calendar,
    color: 'bg-green-50 border-green-200',
    badgeColor: 'bg-green-100 text-green-700',
    count: 0
  },
  published: {
    label: 'Published',
    icon: CheckCircle,
    color: 'bg-green-50 border-green-200',
    badgeColor: 'bg-green-100 text-green-700',
    count: 0
  },
  failed: {
    label: 'Failed',
    icon: Clock,
    color: 'bg-red-50 border-red-200',
    badgeColor: 'bg-red-100 text-red-700',
    count: 0
  }
}

export default function Posts() {
  const { supabase, user } = useSupabase()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchPosts()
  }, [user, router, fetchPosts])

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      setPosts(posts.filter(p => p.id !== postId))
    } catch {
      alert('Failed to delete post')
    }
  }

  const duplicatePost = async (post: Post) => {
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user?.id,
          title: `${post.title} (Copy)`,
          content: post.content,
          images: post.images,
          hashtags: post.hashtags,
          status: 'draft',
        })

      if (error) throw error
      fetchPosts()
    } catch {
      alert('Failed to duplicate post')
    }
  }

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', postId)

      if (error) throw error
      fetchPosts()
    } catch {
      alert('Failed to update post status')
    }
  }

  const getPostsByStatus = (status: keyof typeof statusConfig) => {
    return posts.filter(post => post.status === status)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
  }

  const handlePostClick = (post: Post) => {
    // For drafts, failed, and scheduled posts, go to create page to edit
    if (post.status === 'draft' || post.status === 'failed' || post.status === 'scheduled') {
      router.push(`/dashboard/create?postId=${post.id}`)
    } else if (post.status === 'published') {
      // For published posts, show the modal with details
      setSelectedPost(post)
    }
  }

  const PostCard = ({ post }: { post: Post }) => {
    return (
      <Card 
        className="hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 bg-white"
        onClick={() => handlePostClick(post)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 pr-2">
              {post.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-gray-100 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setSelectedPost(post)} className="text-xs">
                  <Eye className="mr-2 h-3 w-3" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicatePost(post)} className="text-xs">
                  <Copy className="mr-2 h-3 w-3" />
                  Duplicate
                </DropdownMenuItem>
                {post.status === 'draft' && (
                  <DropdownMenuItem onClick={() => updatePostStatus(post.id, 'scheduled')} className="text-xs">
                    <Calendar className="mr-2 h-3 w-3" />
                    Schedule
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => deletePost(post.id)}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-xs text-gray-600 mb-3 line-clamp-3">
            {truncateContent(post.content, 80)}
          </p>
          
          {post.images && post.images.length > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-purple-600 text-xs">📷</span>
              </div>
              <span className="text-xs text-purple-600 font-medium">{post.images.length}</span>
            </div>
          )}
          
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.hashtags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
              {post.hashtags.length > 2 && (
                <span className="text-xs text-gray-500">+{post.hashtags.length - 2}</span>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-400 border-t pt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(post.created_at)}
            </div>
            {post.scheduled_at && (
              <div className="flex items-center gap-1 text-green-500 mt-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.scheduled_at)}
              </div>
            )}
            {post.published_at && (
              <div className="flex items-center gap-1 text-green-500 mt-1">
                <CheckCircle className="w-3 h-3" />
                {formatDate(post.published_at)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Update status counts
  Object.keys(statusConfig).forEach(status => {
    statusConfig[status as keyof typeof statusConfig].count = getPostsByStatus(status as keyof typeof statusConfig).length
  })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
              <p className="text-gray-600 mt-2">Manage your LinkedIn posts</p>
            </div>
            <Link href="/dashboard/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6">
              {Object.entries(statusConfig).map(([status, config]) => {
                const StatusIcon = config.icon
                const statusPosts = getPostsByStatus(status as keyof typeof statusConfig)

                return (
                  <div key={status} className={`flex-shrink-0 w-80 rounded-xl border ${config.color} shadow-sm`}>
                    {/* Column Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white shadow-sm">
                            <StatusIcon className="w-4 h-4 text-gray-700" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{config.label}</h3>
                        </div>
                        <Badge variant="secondary" className={`${config.badgeColor} font-medium text-xs px-2 py-1`}>
                          {config.count}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Column Content */}
                    <div className="p-4">
                      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {statusPosts.map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))}
                        
                        {statusPosts.length === 0 && (
                          <div className="text-center py-8 text-gray-400">
                            <div className="bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                              <StatusIcon className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-sm font-medium">No {config.label.toLowerCase()}</p>
                            <p className="text-xs mt-1">Drag posts here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Badge className={statusConfig[selectedPost.status].badgeColor}>
                    {statusConfig[selectedPost.status].label}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Content</h3>
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {selectedPost.content}
                  </div>
                </div>
                
                {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.hashtags.map((tag, index) => (
                        <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPost.images.map((image, index) => (
                        <Image 
                          key={index} 
                          src={image} 
                          alt={`Post image ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-md border"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Created:</strong> {formatDate(selectedPost.created_at)}
                  </div>
                  {selectedPost.scheduled_at && (
                    <div>
                      <strong>Scheduled:</strong> {formatDate(selectedPost.scheduled_at)}
                    </div>
                  )}
                  {selectedPost.published_at && (
                    <div>
                      <strong>Published:</strong> {formatDate(selectedPost.published_at)}
                    </div>
                  )}
                  {selectedPost.linkedin_post_id && (
                    <div>
                      <strong>LinkedIn ID:</strong> {selectedPost.linkedin_post_id}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}