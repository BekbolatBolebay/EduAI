import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. If no user and trying to access protected routes, redirect to login
  if (!user && (
    request.nextUrl.pathname.startsWith('/home') || 
    request.nextUrl.pathname.startsWith('/teacher') || 
    request.nextUrl.pathname.startsWith('/mentor') ||
    request.nextUrl.pathname.startsWith('/tests')
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If user exists, check role for /teacher route
  if (user && request.nextUrl.pathname.startsWith('/teacher')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  // 3. If user exists and is a teacher, prevent access to student home (optional, but good for UX)
  if (user && request.nextUrl.pathname === '/home') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'teacher') {
      return NextResponse.redirect(new URL('/teacher', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/home/:path*', '/teacher/:path*', '/mentor/:path*', '/tests/:path*', '/login', '/register'],
}
