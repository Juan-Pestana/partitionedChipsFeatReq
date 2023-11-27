import NextAuth from 'next-auth'

import GitHub from 'next-auth/providers/github'

import type { NextAuthConfig } from 'next-auth'

const cookiePrefix = process.env.NODE_ENV === 'production' ? '__Secure-' : ''
const hostPrefix = process.env.NODE_ENV === 'production' ? '__Host-' : ''

export const config = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === '/middleware-example') return !!auth
      return true
    },
  },
  cookies: {
    sessionToken: {
      // name: `__Secure-next-auth.session-token`,
      name:
        process.env.NODE_ENV === 'production'
          ? `${cookiePrefix}next-auth.session-token`
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        partitioned: true,
        secure: true,
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === 'production'
          ? `${cookiePrefix}next-auth.callback-url`
          : 'next-auth.callback-url',
      options: {
        sameSite: 'none',
        path: '/',
        partitioned: true,
        secure: true,
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `${hostPrefix}next-auth.csrf-token`
          : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        partitioned: true,
        secure: true,
      },
    },
    pkceCodeVerifier: {
      name:
        process.env.NODE_ENV === 'production'
          ? `${cookiePrefix}next-auth.pkce.code_verifier`
          : 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        partitioned: true,
        secure: true,
      },
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
