import { createFileRoute, type ErrorComponentProps } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/lib/auth/useLogin";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">
            Login error
          </CardTitle>
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
});

function RouteComponent() {
  const {
    formState,
    setFormState,
    formError,
    loginResponse,
    mutationError,
    isPending,
    handleSubmit,
  } = useLogin();

  return (
    <div className="flex h-screen w-full">
      {/* Left Container - Branding/Hero */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-r from-[#000080] to-[#00bfff] border-r">
        <div className="flex flex-col items-center space-y-6 text-center p-10 ">
          <div className=" ">
            <Dumbbell className="h-20 w-20 text-background" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold italic tracking-tight text-background">
              Gym Management System
            </h1>
            <p className="text-muted text-xl">Staff & Admin Login Portal</p>
          </div>
          <div>
            <p className="text-sm text-background/80 max-w-lg">
              Manage your gym efficiently with our comprehensive system. Track
              members, schedule classes, and oversee staff all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right Container - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-surface px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-lg sm:shadow-primary/20">
          <CardHeader className="space-y-2 text-center">
            {/* Show Icon on specific mobile view only where left panel is hidden */}
            <div className="lg:hidden mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold italic text-primary">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your account
            </CardDescription>
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
                  className=" border-input py-5"
                  autoComplete="username"
                  value={formState.username}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
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
                  className="border-input py-5"
                  autoComplete="current-password"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
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

              {(formError || mutationError) && (
                <p
                  className="text-sm text-destructive font-medium text-center"
                  role="alert"
                >
                  {formError ??
                    (mutationError
                      ? mutationError.message
                      : "Login failed.")}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 font-semibold text-base transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {loginResponse && (
                <p
                  className="text-sm text-muted-foreground wrap-break-word text-center bg-muted/50 p-2 rounded-md"
                  role="status"
                >
                  {loginResponse}
                </p>
              )}

              <div className="pt-4 text-center border-t mt-6">
                <p className="text-xs text-muted-foreground">
                  Do not share your credentials with anyone.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
