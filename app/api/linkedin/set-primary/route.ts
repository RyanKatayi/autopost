import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await request.json();
    
    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // First, remove primary status from all accounts for this user
    const { error: clearPrimaryError } = await supabase
      .from('linkedin_accounts')
      .update({ is_primary: false })
      .eq('user_id', user.id);

    if (clearPrimaryError) {
      console.error('Error clearing primary status:', clearPrimaryError);
      return NextResponse.json({ error: 'Failed to update primary account' }, { status: 500 });
    }

    // Then set the new primary account
    const { error: setPrimaryError } = await supabase
      .from('linkedin_accounts')
      .update({ is_primary: true })
      .eq('id', accountId)
      .eq('user_id', user.id);

    if (setPrimaryError) {
      console.error('Error setting primary account:', setPrimaryError);
      return NextResponse.json({ error: 'Failed to set primary account' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in set primary account route:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}