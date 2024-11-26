'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

import MobileMenu from './MobileMenu'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import DesktopMenu from './DesktopMenu'

export default function NeoBrutalistNavbar() {
    const { data: session } = useSession()
    const isMobile = useMobileDetection()

    return (
        <nav className="bg-yellow-300 border-b-4 border-black max-w-full">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="text-3xl font-black transform -skew-x-6 bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Friends Wall
                    </Link>
                    {isMobile ? <MobileMenu session={session} /> : <DesktopMenu session={session} />}
                </div>
            </div>
        </nav>
    )
}
