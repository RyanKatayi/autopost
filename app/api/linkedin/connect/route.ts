import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify environment variables are set
  if (!process.env.LINKEDIN_CLIENT_ID) {
    return NextResponse.json({ error: 'LinkedIn Client ID not configured' }, { status: 500 });
  }
  
  if (!process.env.LINKEDIN_REDIRECT_URI) {
    return NextResponse.json({ error: 'LinkedIn Redirect URI not configured' }, { status: 500 });
  }

  // Generate OAuth URL with proper scopes
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
    state: user.id, // Use user ID as state for security
    scope: 'openid profile w_member_social', // Scopes for profile access and posting
  });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;

  console.log('Generated LinkedIn OAuth URL:', authUrl);
  console.log('Client ID:', process.env.LINKEDIN_CLIENT_ID);
  console.log('Redirect URI:', process.env.LINKEDIN_REDIRECT_URI);

  return NextResponse.json({ authUrl });
}

export async function DELETE() {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Remove LinkedIn connection
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      linkedin_access_token: null,
      linkedin_refresh_token: null,
      linkedin_expires_at: null,
      linkedin_id: null,
    })
    .eq('id', user.id);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to remove LinkedIn connection' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}