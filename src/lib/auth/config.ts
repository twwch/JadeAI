import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { config } from '@/lib/config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: config.auth.enabled
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : [
        Credentials({
          name: 'Fingerprint',
          credentials: {
            fingerprint: { label: 'Fingerprint', type: 'text' },
          },
          async authorize(credentials) {
            const fingerprint = credentials?.fingerprint as string;
            if (!fingerprint) return null;
            return {
              id: `fp_${fingerprint}`,
              name: 'Anonymous User',
            };
          },
        }),
      ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
});
