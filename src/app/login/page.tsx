'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface Error {
    message: string
    details: string
}

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<Error | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError({
                    message: 'Login failed',
                    details: result.error
                })
            } else {
                router.push('/')
                router.refresh()
            }
        } catch (error) {
            setError({
                message: 'An error occurred',
                details: error instanceof Error ? error.message : String(error)
            })
        }
    }

    return (
        <div className="min-h-screen bg-orange-300 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border-4 border-black p-8 transform -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-4xl font-black mb-6 text-center transform skew-x-6 bg-purple-500 text-white py-2 px-4 inline-block">Login</h2>

                {error && (
                    <Alert variant="destructive" className="mb-6 border-2 border-black">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{error.message}</AlertTitle>
                        <AlertDescription>{error.details}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg font-bold">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-2 border-black rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-lg font-bold">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-2 border-black rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-lg font-bold border-2 border-black rounded-none bg-green-400 text-black hover:bg-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transform rotate-1 transition-transform hover:rotate-0"
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    )
}