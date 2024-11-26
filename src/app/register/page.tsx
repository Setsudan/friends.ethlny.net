'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { pb } from '@/lib/pocketbase'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormField } from '@/components/auth/FormField'
import { AuthButton } from '@/components/auth/AuthButton'
import { useAuthForm } from '@/hooks/useAuthForm'

export default function RegisterPage() {
    const router = useRouter()
    const { formData, error, loading, setError, setLoading, handleChange } = useAuthForm({
        email: '',
        name: '',
        password: '',
        passwordConfirm: ''
    })

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
        <AuthLayout
            onSubmit={handleSubmit}
            title="Create an Account"
            error={error}
            titleColor="bg-blue-500"
            bgColor="bg-yellow-300"
            rotation="rotate-1"
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
                id="name"
                label="Name"
                type="text"
                value={formData.name}
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
                minLength={8}
            />
            <FormField
                id="passwordConfirm"
                label="Confirm Password"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                minLength={8}
            />
            <AuthButton bgColor="bg-lime-400" rotation="-rotate-1" loading={loading}>
                {loading ? 'Creating account...' : 'Register'}
            </AuthButton>

            <p className="text-center text-lg">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-blue-600 hover:text-blue-800 underline">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    )
}