'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { API_BASE_URL } from '@/lib/api';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase session error:', error);
          throw error;
        }

        if (!session?.user) {
          console.error('No session or user data found');
          throw new Error('No session');
        }

        // Get user data from GitHub session
        const { user } = session;
        
        // Log the user metadata for debugging
        console.log('GitHub user metadata:', user.user_metadata);
        
        const githubData = {
          name: user.user_metadata.full_name || user.user_metadata.name || user.user_metadata.user_name,
          email: user.email,
          avatar: user.user_metadata.avatar_url,
          github: user.user_metadata.user_name
        };

        // Validate required fields
        if (!githubData.name || !githubData.email) {
          console.error('Missing required GitHub data:', githubData);
          throw new Error('Missing required GitHub user data');
        }

        // Sync with MongoDB
        const response = await fetch(`${API_BASE_URL}/api/auth/github/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(githubData),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('MongoDB sync error:', data);
          throw new Error(data.message || 'Failed to sync with MongoDB');
        }

        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Dispatch auth state change event
        const event = new CustomEvent('auth-state-change', { 
          detail: data.data.user 
        });
        window.dispatchEvent(event);

        // Check for error in URL params and redirect accordingly
        const error_description = searchParams.get('error_description');
        if (error_description) {
          router.push(`/login?error=${encodeURIComponent(error_description)}`);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push(`/login?error=${encodeURIComponent(error instanceof Error ? error.message : 'Authentication failed')}`);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
} 