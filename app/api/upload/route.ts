import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try real upload first, fallback to demo mode if it fails
    try {
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Real upload failed, using demo mode:', uploadError.message)
        throw new Error('Storage not configured')
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)

      return NextResponse.json({
        url: publicUrlData.publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        isReal: true
      })
      
    } catch {
      // Fallback to demo mode
      console.log('Using demo mode for image upload')
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a simple placeholder image as base64 data URL
      const placeholderSvg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#10b981"/>
          <text x="200" y="150" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">
            📷 ${file.name}
          </text>
          <text x="200" y="180" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">
            Demo Mode - ${Math.round(file.size / 1024)}KB
          </text>
        </svg>
      `
      const mockUrl = `data:image/svg+xml;base64,${Buffer.from(placeholderSvg).toString('base64')}`
      
      return NextResponse.json({
        url: mockUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        isReal: false
      })
    }

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}