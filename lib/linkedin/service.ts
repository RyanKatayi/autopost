import { LinkedInClient } from './client';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

type Post = Database['public']['Tables']['posts']['Row'];
type LinkedInAccount = {
  id: string;
  user_id: string;
  linkedin_id: string;
  linkedin_access_token: string;
  display_name: string | null;
  profile_picture_url: string | null;
  headline: string | null;
  is_primary: boolean;
  is_active: boolean;
};

export class LinkedInService {
  private client: LinkedInClient;
  private account: LinkedInAccount;

  constructor(account: LinkedInAccount) {
    this.client = new LinkedInClient(account.linkedin_access_token);
    this.account = account;
  }

  static async fromUserId(userId: string, accountId?: string): Promise<LinkedInService | null> {
    const supabase = await createClient();
    
    let query = supabase
      .from('linkedin_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
      
    if (accountId) {
      query = query.eq('id', accountId);
    } else {
      // Get primary account if no specific account requested
      query = query.eq('is_primary', true);
    }
    
    const { data: account, error } = await query.single();

    console.log('LinkedIn account lookup:', { userId, accountId, account, error });

    if (error || !account) {
      return null;
    }

    return new LinkedInService(account);
  }

  static async getAccountsForUser(userId: string): Promise<LinkedInAccount[]> {
    const supabase = await createClient();
    
    const { data: accounts, error } = await supabase
      .from('linkedin_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('display_name', { ascending: true });

    if (error) {
      console.error('Error fetching LinkedIn accounts:', error);
      return [];
    }

    return accounts || [];
  }

  getAccount(): LinkedInAccount {
    return this.account;
  }

  async publishPost(post: Post & { hashtags?: string[] }): Promise<{ success: boolean; linkedinPostId?: string; error?: string }> {
    try {
      let response;
      console.log('LinkedIn Service - Publishing post:', { 
        title: post.title, 
        hasImages: !!post.images?.length,
        imageCount: post.images?.length 
      });

      // Combine content with hashtags
      let fullContent = post.content;
      if (post.hashtags && post.hashtags.length > 0) {
        fullContent = `${post.content}\n\n${post.hashtags.map(tag => `#${tag}`).join(' ')}`;
      }

      // Handle different post types
      if (post.images && post.images.length > 0) {
        // Download the image from the URL
        const imageUrl = post.images[0];
        console.log('Downloading image from:', imageUrl);
        const imageResponse = await fetch(imageUrl);
        
        if (!imageResponse.ok) {
          throw new Error('Failed to download image');
        }

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        console.log('Image downloaded:', { size: imageBuffer.length, contentType });

        // Upload to LinkedIn with the image
        response = await this.client.shareWithImage({
          text: fullContent,
          imageBuffer,
          imageContentType: contentType,
          altText: post.title,
          visibility: 'PUBLIC',
        });
      } else {
        // Plain text post
        console.log('Publishing text-only post');
        response = await this.client.sharePost({
          text: fullContent,
          visibility: 'PUBLIC',
        });
      }
      
      console.log('LinkedIn API response:', response);

      // Update the post status in the database
      const supabase = await createClient();
      await supabase
        .from('posts')
        .update({
          status: 'published',
          linkedin_post_id: response.id,
          linkedin_account_id: this.account.id,
          published_at: new Date().toISOString(),
        })
        .eq('id', post.id);

      return { success: true, linkedinPostId: response.id };
    } catch (error) {
      console.error('Error publishing to LinkedIn:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async publishScheduledPosts(userId: string): Promise<void> {
    const supabase = await createClient();
    
    // Get all scheduled posts that are due
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'scheduled')
      .lte('scheduled_for', new Date().toISOString())
      .order('scheduled_for', { ascending: true });

    if (error || !posts || posts.length === 0) {
      return;
    }

    // Publish each post
    for (const post of posts) {
      await this.publishPost(post);
      // Add a small delay between posts to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  async testConnection(): Promise<{ success: boolean; profile?: unknown; error?: string }> {
    try {
      const profile = await this.client.getProfile();
      return { success: true, profile };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to LinkedIn' 
      };
    }
  }
}