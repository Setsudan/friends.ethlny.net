import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pb } from "@/lib/pocketbase";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const authData = await pb
                        .collection('users')
                        .authWithPassword(credentials?.email || '', credentials?.password || '');

                    return {
                        id: authData.record.id,
                        email: authData.record.email,
                        name: authData.record.name,
                    };
                } catch (error) {
                    console.error('Error authenticating user:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
});

export { handler as GET, handler as POST };