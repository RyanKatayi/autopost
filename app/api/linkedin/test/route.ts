import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LinkedInService } from '@/lib/linkedin/service';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth check:', { userId: user?.id, authError });
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create LinkedIn service instance
    const linkedInService = await LinkedInService.fromUserId(user.id);
    console.log('LinkedIn service lookup:', { userId: user.id, serviceExists: !!linkedInService });
    
    if (!linkedInService) {
      return NextResponse.json({ error: 'LinkedIn not connected' }, { status: 400 });
    }

    // Test the connection
    const result = await linkedInService.testConnection();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      profile: result.profile 
    });
  } catch (error) {
    console.error('Error testing LinkedIn connection:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}