// src/app/page.tsx
import { Suspense } from 'react';
import PostList from '@/components/PostList';
import CreatePostForm from '@/components/CreatePostForm';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="space-y-8">
      {session && <CreatePostForm />}
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostList />
      </Suspense>
    </div>
  );
}