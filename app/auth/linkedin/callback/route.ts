import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle errors from LinkedIn
  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard?error=missing_params', request.url)
    );
  }

  try {
    const supabase = await createClient();
    
    // Verify the state matches the user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || state !== user.id) {
      return NextResponse.redirect(
        new URL('/dashboard?error=invalid_state', request.url)
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('LinkedIn token error:', error);
      return NextResponse.redirect(
        new URL('/dashboard?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    // Get user's LinkedIn profile using OpenID Connect userinfo endpoint
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.redirect(
        new URL('/dashboard?error=profile_fetch_failed', request.url)
      );
    }

    const profile = await profileResponse.json();

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Upsert profile record with LinkedIn information
    // OpenID Connect returns 'sub' as the unique identifier
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        linkedin_id: profile.sub || profile.id,
        linkedin_access_token: access_token,
        linkedin_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.redirect(
        new URL('/dashboard?error=database_error', request.url)
      );
    }

    // Redirect back to dashboard with success message
    return NextResponse.redirect(
      new URL('/dashboard?linkedin=connected', request.url)
    );
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=unexpected_error', request.url)
    );
  }
}