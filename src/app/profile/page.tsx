"use client"

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Page() {
    const { data: session } = useSession()

    if (!session) {
        return (
            <div>
                <h1>Not signed in</h1>
                <Button asChild>
                    <Link href="/login">
                        Se connecter</Link>
                </Button>
            </div>
        )
    }

    return (
        <div>
            <h1>Profile</h1>
            <code>{JSON.stringify(session, null, 2)}</code>
        </div>
    )
}