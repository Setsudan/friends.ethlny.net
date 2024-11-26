// app/page.tsx
'use client';

import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import PostList from '@/components/posts/PostList';
import CreatePostForm from '@/components/CreatePostForm';

import { useBackendStatus } from '@/hooks/useBackendStatus';
import { StatusDisplay } from '@/components/common/StatusDisplay';
import { AuthPrompt } from '@/components/common/AuthPrompt';

export default function Home() {
  const { data: session } = useSession();
  const backendStatus = useBackendStatus(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  return (
    <div className="space-y-8">
      <StatusDisplay status={backendStatus} />
      {session ? <CreatePostForm /> : <AuthPrompt />}
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostList />
      </Suspense>
    </div>
  );
}