import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({ name, value, ...options })
        response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: '', ...options, maxAge: -1 })
        response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
        response.cookies.set({ name, value: '', ...options, maxAge: -1 })
      },
    },
  })

  // Determine if mock mode is active based on environment or cookie
  const isEnvDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const demoModeCookie = request.cookies.get('demo_mode')?.value
  const mockActive = isEnvDemo || !url || url.includes('placeholder-project') || demoModeCookie === 'true' || demoModeCookie === undefined

  const path = request.nextUrl.pathname

  if (mockActive) {
    const isMockLoggedIn = request.cookies.get('mock_logged_in')?.value === 'true'
    const mockUserRole = request.cookies.get('mock_user_role')?.value || 'contributor'

    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
      if (!isMockLoggedIn) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Role-based route blocks for mock mode
      if (mockUserRole !== 'admin') {
        if (path.startsWith('/admin/users') || path.startsWith('/admin/ads') || path.startsWith('/admin/settings')) {
          return NextResponse.redirect(new URL('/admin?error=forbidden', request.url))
        }
      }

      if (mockUserRole === 'contributor') {
        if (path.startsWith('/admin/videos') || path.startsWith('/admin/comments')) {
          return NextResponse.redirect(new URL('/admin?error=forbidden', request.url))
        }
      }
    }

    if (path.startsWith('/admin/login') && isMockLoggedIn) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
  }

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protected Admin Routes Check
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Fetch user's role from the public users table
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'editor', 'contributor'].includes(profile.role)) {
      // Not an authorized member
      // Sign them out and redirect
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }

    // Role-based route blocks
    // Editor and Contributor cannot manage ads or users
    if (profile.role !== 'admin') {
      if (path.startsWith('/admin/users') || path.startsWith('/admin/ads') || path.startsWith('/admin/settings')) {
        return NextResponse.redirect(new URL('/admin?error=forbidden', request.url))
      }
    }

    // Contributor cannot access videos admin page
    if (profile.role === 'contributor') {
      if (path.startsWith('/admin/videos') || path.startsWith('/admin/comments')) {
        return NextResponse.redirect(new URL('/admin?error=forbidden', request.url))
      }
    }
  }

  // Redirect authenticated user away from login page
  if (path.startsWith('/admin/login') && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}
