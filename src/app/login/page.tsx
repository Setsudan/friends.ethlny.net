'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormField } from '@/components/auth/FormField'
import { AuthButton } from '@/components/auth/AuthButton'
import { useAuthForm } from '@/hooks/useAuthForm'

export default function LoginPage() {
    const router = useRouter()
    const { formData, error, setError, handleChange } = useAuthForm({
        email: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
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
        <AuthLayout
            onSubmit={handleSubmit}
            title="Login"
            error={error}
            titleColor="bg-purple-500"
            bgColor="bg-orange-300"
            rotation="-rotate-1"
        >
            <FormField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <FormField
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <AuthButton bgColor="bg-green-400" rotation="rotate-1">
                Login
            </AuthButton>
        </AuthLayout>
    )
}