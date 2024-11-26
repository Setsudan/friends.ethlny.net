import { FC } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet"
import { LogIn, MenuIcon, UserPlus } from 'lucide-react'

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import UserMenu from './UserMenu'
import Link from 'next/link'

interface MobileMenuProps {
    session: Session | null
}

const MobileMenu: FC<MobileMenuProps> = ({ session }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform rotate-2 transition-transform hover:rotate-0">
                    <MenuIcon className="mr-2 h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent onClick={(e) => e.stopPropagation()} className="flex flex-col pt-8">
                {session ? (
                    <UserMenu session={session} onSignOut={signOut} />
                ) : (
                    <>
                        <SheetClose asChild>
                            <Button asChild variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform rotate-2 transition-transform hover:rotate-0">
                                <Link href="/login">
                                    <LogIn className="mr-2 h-5 w-5" /> Se connecter
                                </Link>
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button asChild variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0">
                                <Link href="/register">
                                    <UserPlus className="mr-2 h-5 w-5" /> Créer un compte
                                </Link>
                            </Button>
                        </SheetClose></>
                )}
                <SheetClose asChild>
                    <Button variant="destructive" className="font-bold text-lg border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0">
                        Fermer
                    </Button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    )
}

export default MobileMenu
