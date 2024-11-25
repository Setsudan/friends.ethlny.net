'use client';

import { Suspense, useEffect, useState } from 'react';
import PostList from '@/components/PostList';
import CreatePostForm from '@/components/CreatePostForm';
import { useSession } from 'next-auth/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { InfoIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Home() {
  const { data: session } = useSession();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'up' | 'down'>('checking');
  const backendUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

  useEffect(() => {
    const checkBackend = async () => {
      if (!backendUrl) {
        console.error('Backend URL is not defined');
        setBackendStatus('down');
        return;
      }

      try {
        const response = await fetch(backendUrl);
        if (response.ok || response.status === 404) {
          setBackendStatus('up');
        } else {
          setBackendStatus('down');
        }
      } catch (error) {
        console.error('Backend check failed:', error);
        setBackendStatus('down');
      }
    };

    checkBackend();

    // Optional: Set up periodic checking
    const intervalId = setInterval(checkBackend, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [backendUrl]);

  return (
    <div className="space-y-8">
      <div className="flex items-center md:gap-2 gap-1">
        <span>Status: </span>
        {backendStatus === 'checking' ? (
          <span className="text-gray-500">Je regarde ça...</span>
        ) : backendStatus === 'up' ? (
          <span className="text-green-500">On est tout bon</span>
        ) : (
          <Drawer>
            <DrawerTrigger className='cursor-pointer w-full flex flex-row'>
              <span className="text-red-500">Ah y a un problème... Que faire ?</span>
              <InfoIcon className="text-red-500 mx-2 w-6 h-6" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Mon ordi est éteint</DrawerTitle>
                <DrawerClose />
              </DrawerHeader>
              <DrawerDescription>
                <div className='px-4 py-2'>
                  <p>Le premier défi pour ce site c&apos;était le stockage de fichier en quantité importante.</p>
                  <p>Pour régler ce problème on se sert de mon pc pour stocker les fichiers.</p>
                  <p>Appel moi ou envoie moi un message si je peux te le mettre en ligne je le fait</p>
                </div>
              </DrawerDescription>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      {session && <CreatePostForm />}
      {!session && (
        <Card className="bg-white border-2 border-black p-4 shadow-lg">
          <p className="text-lg font-semibold text-black">Connecte toi pour poster des médias</p>
        </Card>
      )}
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostList />
      </Suspense>
    </div>
  );
}