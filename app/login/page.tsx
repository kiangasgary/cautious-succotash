import { AuthForm } from "@/components/auth/auth-form"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground mt-2">Sign in to save and manage your video summaries</p>
        </div>

        <AuthForm />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleSignInButton />
      </div>
    </main>
  )
}
