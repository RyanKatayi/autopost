import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all LinkedIn accounts for this user
  const { data: accounts, error } = await supabase
    .from('linkedin_accounts')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('is_primary', { ascending: false })
    .order('display_name', { ascending: true });

  if (error) {
    console.error('Error fetching LinkedIn accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }

  return NextResponse.json({ accounts: accounts || [] });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { accountId, action } = await request.json();

    if (action === 'setPrimary') {
      // First, unset all primary accounts for this user
      await supabase
        .from('linkedin_accounts')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Then set the specified account as primary
      const { error: updateError } = await supabase
        .from('linkedin_accounts')
        .update({ 
          is_primary: true,
          last_used_at: new Date().toISOString()
        })
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error setting primary account:', updateError);
        return NextResponse.json({ error: 'Failed to set primary account' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { accountId } = await request.json();

    // Check if this is the only account
    const { data: accounts, error: countError } = await supabase
      .from('linkedin_accounts')
      .select('id, is_primary')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (countError) {
      console.error('Error checking account count:', countError);
      return NextResponse.json({ error: 'Failed to check accounts' }, { status: 500 });
    }

    const accountToDelete = accounts?.find(acc => acc.id === accountId);
    if (!accountToDelete) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // If this is the primary account and there are other accounts, set another as primary
    if (accountToDelete.is_primary && accounts.length > 1) {
      const otherAccount = accounts.find(acc => acc.id !== accountId);
      if (otherAccount) {
        await supabase
          .from('linkedin_accounts')
          .update({ is_primary: true })
          .eq('id', otherAccount.id);
      }
    }

    // Soft delete the account by setting is_active to false
    const { error: deleteError } = await supabase
      .from('linkedin_accounts')
      .update({ is_active: false })
      .eq('id', accountId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting account:', deleteError);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing delete request:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}