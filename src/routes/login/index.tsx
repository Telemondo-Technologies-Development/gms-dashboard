import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,

})



function RouteComponent() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6">
      <Card className="w-full max-w-md shadow-lg mx-auto">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl italic ">Welcome Back</CardTitle>
          <CardDescription>Gym Management System - Staff & Admin Login</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium" > </label>
              <Input
                type="text"
                placeholder="Enter your username or email"
                className="bg-input border-input py-5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium"></Label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="bg-input border-input py-5"
              />
              <Button variant="link" className="text-xs text-destructive hover:underline flex p-0">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary text-primary-foreground"
            >
              <Label>Sign In</Label>
            </Button>

            <div className="pt-2 text-center">
              <p className="text-xs text-muted-foreground">Demo credentials - any email/password combination works</p>
              <p className="text-xs text-muted-foreground">Try: admin as user and password</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
