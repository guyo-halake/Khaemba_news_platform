import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
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
            headers: request.headers,
          },
        })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: '', ...options, maxAge: -1 })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({ name, value: '', ...options, maxAge: -1 })
      },
    },
  })

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

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
