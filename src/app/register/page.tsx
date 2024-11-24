'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { pb } from '@/lib/pocketbase'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface Error {
    message: string
    details: string
}

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        passwordConfirm: '',
    })
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        if (formData.password !== formData.passwordConfirm) {
            setError({
                message: 'Passwords do not match',
                details: 'Please make sure the passwords match'
            })
            setLoading(false)
            return
        }

        try {
            await pb.collection('users').create({
                email: formData.email,
                name: formData.name,
                username: formData.name.toLowerCase().replace(/\s+/g, ''),
                password: formData.password,
                passwordConfirm: formData.passwordConfirm,
            })
            router.push('/login?registered=true')
        } catch (err: unknown) {
            setError({
                message: 'Registration failed',
                details: err instanceof Error ? err.message : String(err)
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-yellow-300 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border-4 border-black p-8 transform rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-4xl font-black mb-6 text-center transform -skew-x-6 bg-blue-500 text-white py-2 px-4 inline-block">Create an Account</h2>

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
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border-2 border-black rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-lg font-bold">
                            Name
                        </Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border-2 border-black rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-lg font-bold">
                            Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="border-2 border-black rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="passwordConfirm" className="text-lg font-bold">
                            Confirm Password
                        </Label>
                        <Input
                            type="password"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="border-2 border-black rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full text-lg font-bold border-2 border-black rounded-none bg-lime-400 text-black hover:bg-lime-500 focus:ring-2 focus:ring-lime-500 focus:border-transparent transform -rotate-1 transition-transform hover:rotate-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </Button>

                    <p className="text-center text-lg">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-blue-600 hover:text-blue-800 underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

