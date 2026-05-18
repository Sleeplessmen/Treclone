import { NextRequest, NextResponse } from 'next/server'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth-utils'

const protectedRoutes = ['/workspaces', '/(dashboard)']
const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/']

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    )
    const isPublicRoute = publicRoutes.some((route) =>
        pathname === route || pathname.startsWith(route)
    )

    const token = request.cookies.get('accessToken')?.value

    // If protected route, verify token
    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        try {
            jwt.verify(token, JWT_SECRET)
        } catch (error) {
            // Log verification failure for security monitoring
            if (error instanceof jwt.JsonWebTokenError) {
                console.warn('[Middleware] Token verification failed:', error.message, {
                    path: pathname,
                    timestamp: new Date().toISOString(),
                })
            } else {
                console.error('[Middleware] Unexpected error during token verification:', error)
            }
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    // If logged in and trying to access auth pages, redirect to workspaces
    if (isPublicRoute && pathname.startsWith('/auth') && token) {
        try {
            jwt.verify(token, JWT_SECRET)
            return NextResponse.redirect(new URL('/workspaces', request.url))
        } catch (error) {
            // Token invalid, allow access to auth pages
            if (error instanceof jwt.JsonWebTokenError) {
                console.debug('[Middleware] Invalid token on auth page, allowing access:', error.message)
            }
            // Don't rethrow - this is expected behavior
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}