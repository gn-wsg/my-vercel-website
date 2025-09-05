import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Store email subscription in Supabase
    const { data, error } = await supabase
      .from('email_subscriptions')
      .upsert(
        { 
          email, 
          subscribed_at: new Date().toISOString(),
          active: true 
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('Error storing email subscription:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe email', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Email subscription successful: ${email}`);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to email updates',
      email: email
    });
    
  } catch (error) {
    console.error('Error in email subscription API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
