import { NextRequest, NextResponse } from 'next/server'
import { generateLinkedInPost, PostGenerationRequest } from '@/lib/ai/post-generator'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: PostGenerationRequest = await request.json()
    
    // Validate request
    if (!body.topic || !body.tone || !body.length) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, tone, length' },
        { status: 400 }
      )
    }

    // Generate the post
    const generatedPost = await generateLinkedInPost(body)

    // Return the generated post without saving to database initially
    // The frontend will handle saving via the separate save functionality
    return NextResponse.json({
      ...generatedPost,
      id: `temp-${Date.now()}`,
      status: 'generated'
    })
  } catch (error) {
    console.error('Post generation error:', error)
    
    let errorMessage = 'Failed to generate post'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}