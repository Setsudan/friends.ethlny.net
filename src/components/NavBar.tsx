'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { LogOut, LogIn, UserPlus, MenuIcon, InfoIcon, User } from 'lucide-react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export default function NeoBrutalistNavbar() {
    const { data: session } = useSession()

    const detectMobile = () => {
        if (window.innerWidth <= 640) {
            return true
        } else {
            return false
        }
    }

    return (
        <nav className="bg-yellow-300 border-b-4 border-black max-w-full">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="text-3xl font-black transform -skew-x-6 bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Friends Wall
                    </Link>
                    <div className="flex items-center space-x-4">
                        {session ? (
                            detectMobile() ? (
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform rotate-2 transition-transform hover:rotate-0">
                                            <MenuIcon className="mr-2 h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent>

                                        <Button asChild className="text-lg font-bold bg-white text-black px-3 py-1 border-2 border-black transform rotate-2">
                                            <Link href="/profile">
                                                <User className="mr-2 h-5 w-5" />
                                                {session.user?.email}</Link>
                                        </Button>
                                        <Button
                                            onClick={() => signOut()}
                                            variant="destructive"
                                            className="font-bold text-lg border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0"
                                        >
                                            <LogOut className="mr-2 h-5 w-5" /> Logout
                                        </Button>
                                    </SheetContent>
                                </Sheet>) : (
                                <>
                                    <Button asChild className="text-lg font-bold bg-white text-black px-3 py-1 border-2 border-black transform rotate-2 my-6">
                                        <Link href="/profile">
                                            <User className="mr-2 h-5 w-5" />
                                            {session.user?.email}</Link>
                                    </Button>
                                    <Button
                                        onClick={() => signOut()}
                                        variant="destructive"
                                        className="font-bold text-lg border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0"
                                    >
                                        <LogOut className="mr-2 h-5 w-5" /> Logout
                                    </Button>
                                </>
                            )
                        ) : (
                            <>
                                {
                                    detectMobile() ? (
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform rotate-2 transition-transform hover:rotate-0">
                                                    <MenuIcon className="mr-2 h-5 w-5" />
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Friends Wall</SheetTitle>
                                                </SheetHeader>
                                                <SheetDescription>
                                                    <div className="flex flex-col space-y-4">
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
                                                        <Drawer>
                                                            <DrawerTrigger asChild>
                                                                <Button variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform rotate-2 transition-transform hover:rotate-0">
                                                                    <InfoIcon className="mr-2 h-5 w-5" /> Qu&apos;est-ce que c&apos;est ?
                                                                </Button>
                                                            </DrawerTrigger>
                                                            <DrawerContent>
                                                                <DrawerHeader>
                                                                    <DrawerTitle>À propos</DrawerTitle>
                                                                </DrawerHeader>
                                                                <DrawerDescription className="flex flex-col space-y-4 px-2">
                                                                    <p className="text-lg mb-4">
                                                                        Hellooooo, cette mini application est un mur d&apos;amis comme le nom l&apos;indique. Le principe ? On met toutes nos photos de l&apos;année 2024 ici.
                                                                        On aura un petit endroit pour se remémorer les bons moments passés ensemble.
                                                                    </p>
                                                                    <p className="text-lg">
                                                                        Comment on fait ? C&apos;est simple, tu crées un compte, tu te connectes et c&apos;est bueno. Tu peux ajouter des photos avec ou sans descriptions.
                                                                        On peut aussi ajouter des vidéos mais je n&apos;ai pas encore fait en sorte qu&apos;on puisse les voir.
                                                                    </p>
                                                                </DrawerDescription>
                                                                <DrawerFooter>
                                                                    <DrawerClose asChild>
                                                                        <Button variant="destructive" className="font-bold text-lg border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0">
                                                                            Fermer
                                                                        </Button>
                                                                    </DrawerClose>
                                                                </DrawerFooter>
                                                            </DrawerContent>
                                                        </Drawer>
                                                    </div>
                                                </SheetDescription>
                                                <SheetFooter>
                                                    <SheetClose asChild>
                                                        <Button variant="destructive" className="font-bold text-lg border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0">
                                                            Fermer
                                                        </Button>
                                                    </SheetClose>
                                                </SheetFooter>
                                            </SheetContent>
                                        </Sheet>
                                    ) : (
                                        <>
                                            <Button asChild variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform rotate-2 transition-transform hover:rotate-0">
                                                <Link href="/login">
                                                    <LogIn className="mr-2 h-5 w-5" /> Login
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" className="font-bold text-lg bg-white border-2 border-black rounded-none transform -rotate-2 transition-transform hover:rotate-0">
                                                <Link href="/register">
                                                    <UserPlus className="mr-2 h-5 w-5" /> Register
                                                </Link>
                                            </Button>
                                        </>)
                                }
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

