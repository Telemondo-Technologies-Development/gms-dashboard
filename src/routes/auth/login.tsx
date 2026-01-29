import { useState, type FormEvent } from 'react'
import { createFileRoute, type ErrorComponentProps } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiResponseEnvelopeSchema, loginResponseSchema, loginSchema, type LoginPayload } from '@/types/auth/loginSchemas'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Login error</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
    </div>
  ),

})

function RouteComponent() {
  const [formState, setFormState] = useState<LoginPayload>({
    username: '',
    password: '',
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [loginResponse, setLoginResponse] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
      const url = `${base}/auth/login`

      // Backend expects { username, password } (username can be an email or username string).
      const requestBody = { username: payload.username, password: payload.password }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Include credentials so HttpOnly session cookies are set by the browser.
          credentials: 'include',
          body: JSON.stringify(requestBody),
        })

        const rawText = await response.text().catch(() => '')

        if (!response.ok) {
          throw new Error(`Login failed (${response.status}). ${rawText || 'Check server logs for details.'}`)
        }

        const trimmed = rawText.trim()
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          const maybeJson: unknown = JSON.parse(trimmed)
          const envelope = apiResponseEnvelopeSchema.safeParse(maybeJson)
          if (envelope.success) {
            if (envelope.data.success === false) {
              throw new Error(envelope.data.message ?? 'Login failed.')
            }
            if (envelope.data.success === true) {
              const data = envelope.data.data
              if (typeof data === 'string' && data.trim()) {
                return data
              }
              if (
                typeof data === 'object' &&
                data !== null &&
                'token' in data &&
                typeof (data as { token?: unknown }).token === 'string'
              ) {
                return (data as { token: string }).token
              }
              throw new Error(envelope.data.message ?? 'Login succeeded, but no token was returned.')
            }
          }
        }
        const parsed = loginResponseSchema.safeParse(rawText)
        if (parsed.success && parsed.data.trim()) {
          return parsed.data.trim()
        }
        throw new Error('Unexpected response from the login service.')
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Unable to reach the server.')
        }
        throw new Error('Unable to reach the server. Check the API URL and that the backend is running.')
      }
    },
    onSuccess: async (token) => {
      if (typeof token === 'string' && token.trim()) {
        localStorage.setItem('auth_token', token)
        setLoginResponse(`Login success. Token: ${token}`)
      } else {

        setLoginResponse('Login success. (No token returned; session cookie set)')
      }

      window.setTimeout(() => {
        window.location.href = 'http://localhost:3000/dashboard'
      }, 800)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginResponse(null)
    const parsed = loginSchema.safeParse(formState)
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check your login details.')
      return
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth_username', parsed.data.username)
    }

    setFormError(null)
    loginMutation.mutate(parsed.data)
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left Container - Branding/Hero */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-r from-primary to-secondary border-r">
        <div className="flex flex-col items-center space-y-6 text-center p-10 ">
          <div className=" ">
            <Dumbbell className="h-20 w-20 text-background" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold italic tracking-tight text-background">Gym Management System</h1>
            <p className="text-muted text-xl">Staff & Admin Login Portal</p>
          </div>
          <div>
            <p className="text-sm text-background/80 max-w-lg">
              Manage your gym efficiently with our comprehensive system. Track members, schedule classes, and oversee staff all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right Container - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-lg sm:shadow-primary/20">
          <CardHeader className="space-y-2 text-center">
            {/* Show Icon on specific mobile view only where left panel is hidden */}
            <div className="lg:hidden mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold italic text-primary">Welcome Back</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Email or Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  className="bg-input border-input py-5"
                  autoComplete="username"
                  value={formState.username}
                  onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-input border-input py-5"
                  autoComplete="current-password"
                  value={formState.password}
                  onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                />
                <div className="flex justify-end">
                  <a 
                    href="#" 
                    className="text-xs text-muted-foreground hover:text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>  
        
              {(formError || loginMutation.error) && (
                <p className="text-sm text-destructive font-medium text-center" role="alert">
                  {formError ?? (loginMutation.error instanceof Error ? loginMutation.error.message : 'Login failed.')}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 font-semibold text-base transition-all"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {loginResponse && (
                <p className="text-sm text-muted-foreground break-words text-center bg-muted/50 p-2 rounded-md" role="status">
                  {loginResponse}
                </p>
              )}

              <div className="pt-4 text-center border-t mt-6">
                <p className="text-xs text-muted-foreground">Do not share your credentials with anyone.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
