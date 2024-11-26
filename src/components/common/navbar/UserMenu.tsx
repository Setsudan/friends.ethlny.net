import { FC } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { User, LogOut } from 'lucide-react'
import { Session } from 'next-auth'

interface UserMenuProps {
    session: Session
    onSignOut: () => void
}

const UserMenu: FC<UserMenuProps> = ({ session, onSignOut }) => {
    return (
        <>
            <Button asChild className="text-lg font-bold bg-white text-black px-3 py-1 border-2 border-black transform rotate-2">
                <Link href="/profile">
                    <User className="mr-2 h-5 w-5" />
                    {session.user?.email}
                </Link>
            </Button>
            <Button
                onClick={onSignOut}
                variant="destructive"
                className="font-bold text-lg border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0"
            >
                <LogOut className="mr-2 h-5 w-5" /> Logout
            </Button>
        </>
    )
}

export default UserMenu
