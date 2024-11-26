import { FC } from 'react'
import UserMenu from './UserMenu'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface DesktopMenuProps {
    session: Session | null
}

const DesktopMenu: FC<DesktopMenuProps> = ({ session }) => {
    return session ? (
        <div className='flex space-x-4'>
            <UserMenu session={session} onSignOut={signOut} />
        </div>
    ) : (
        <div className='flex space-x-4'>
            <Button asChild variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform rotate-2 transition-transform hover:rotate-0">
                <Link href="/login">
                    <LogIn className="mr-2 h-5 w-5" /> Se connecter
                </Link>
            </Button>
            <Button asChild variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0">
                <Link href="/register">
                    <UserPlus className="mr-2 h-5 w-5" /> Créer un compte
                </Link>
            </Button>
        </div>
    )
}

export default DesktopMenu
