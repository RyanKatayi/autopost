import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LinkedInService } from '@/lib/linkedin/service';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Get the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if post is already published
    if (post.status === 'published') {
      return NextResponse.json({ error: 'Post is already published' }, { status: 400 });
    }

    // Create LinkedIn service instance
    const linkedInService = await LinkedInService.fromUserId(user.id);
    
    if (!linkedInService) {
      return NextResponse.json({ error: 'LinkedIn not connected' }, { status: 400 });
    }

    // Publish the post with hashtags
    console.log('Publishing post:', { 
      postId, 
      title: post.title, 
      hasImages: !!post.images?.length,
      hashtags: post.hashtags 
    });
    const result = await linkedInService.publishPost(post);
    console.log('Publish result:', result);

    if (!result.success) {
      // Update post status to failed
      await supabase
        .from('posts')
        .update({ status: 'failed' })
        .eq('id', postId);

      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      linkedinPostId: result.linkedinPostId 
    });
  } catch (error) {
    console.error('Error in publish post route:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}