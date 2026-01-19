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
    email: '',
    password: '',
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [loginResponse, setLoginResponse] = useState<string | null>(null)

  const loginIdField = import.meta.env.VITE_LOGIN_ID_FIELD === 'username' ? 'username' : 'email'

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
      const url = `${base}/auth/login`

      const requestBody =
        loginIdField === 'username'
          ? { username: payload.email, password: payload.password }
          : { email: payload.email, password: payload.password }

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

        // Backend sometimes returns an ApiResponse envelope instead of a plain token.
        const trimmed = rawText.trim()
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          const maybeJson: unknown = JSON.parse(trimmed)
          const envelope = apiResponseEnvelopeSchema.safeParse(maybeJson)
          if (envelope.success) {
            if (envelope.data.success === false) {
              throw new Error(envelope.data.message ?? 'Login failed.')
            }
            if (envelope.data.success === true) {
              // success === true: token might be in data (string) or data.token
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
          // a plain token string was returned
          return parsed.data.trim()
        }
        throw new Error('Unexpected response from the login service.')
      } catch (error) {
        if (error instanceof Error) {
          // This also covers typical browser CORS/network failures (often "Failed to fetch").
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
        // No token returned — likely HttpOnly session cookie set by backend
        setLoginResponse('Login success. (No token returned; session cookie set)')
      }

      // Give the user a moment to see the response, then redirect.
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
    setFormError(null)
    loginMutation.mutate(parsed.data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6">
      <Card className="w-full max-w-md shadow-lg shadow-primary mx-auto">
        <div className="text-center flex flex-row justify-center p-3 mx-auto  items-center bg-primary-foreground rounded-full shadow-sm shadow-secondary">
          <Dumbbell className="text-primary w-16 h-full flex justify-end items-center " />
        </div>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl italic text-primary">Welcome Back</CardTitle>
          <CardDescription>Gym Management System - Staff & Admin Login</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email or Username
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your username or email"
                className="bg-input border-input py-5"
                autoComplete="username"
                value={formState.email}
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
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
              <a href="#" className="text-xs text-destructive hover:underline flex p-0 text-right">
                Forgot password?
              </a>

            </div>

            {(formError || loginMutation.error) && (
              <p className="text-sm text-destructive" role="alert">
                {formError ?? (loginMutation.error instanceof Error ? loginMutation.error.message : 'Login failed.')}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary text-primary-foreground"
              disabled={loginMutation.isPending}
            >
              <Label>{loginMutation.isPending ? 'Signing In...' : 'Sign In'}</Label>
            </Button>

            {loginResponse && (
              <p className="text-xs text-muted-foreground break-words" role="status">
                {loginResponse}
              </p>
            )}

            <div className="pt-2 text-center">
              <p className="text-xs text-muted-foreground">Demo credentials - any username/password combination works</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
