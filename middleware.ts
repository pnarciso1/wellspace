import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // All routes that require authentication should be in the (authenticated) group
  const isAuthenticatedRoute = req.nextUrl.pathname.startsWith('/(authenticated)') ||
    ['/dashboard', '/medical-records', '/health-profile', '/health-tracks', '/ai-chat', '/community'].some(path => 
      req.nextUrl.pathname.startsWith(path)
    )
  
  if (isAuthenticatedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}

