"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { 
  authenticateWithMetaMask, 
  getCurrentSession, 
  logout as logoutService,
  type AuthSession,
  type AuthUser
} from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wallet } from "lucide-react"

interface AuthContextType {
  session: AuthSession | null
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
  refreshSession: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = () => {
    try {
      const currentSession = getCurrentSession()
      setSession(currentSession)
    } catch (error) {
      console.error("[AuthProvider] Session check error:", error)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    try {
      setIsLoading(true)
      const newSession = await authenticateWithMetaMask()
      setSession(newSession)
    } catch (error) {
      console.error("[AuthProvider] Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    logoutService()
    setSession(null)
  }

  const refreshSession = () => {
    checkSession()
  }

  const value: AuthContextType = {
    session,
    user: session?.user || null,
    isAuthenticated: !!session && session.expiresAt > Date.now(),
    isLoading,
    login,
    logout,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading authentication...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : !session || session.expiresAt <= Date.now() ? (
        <LoginScreen onLogin={login} isLoading={isLoading} />
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

interface LoginScreenProps {
  onLogin: () => Promise<void>
  isLoading: boolean
}

function LoginScreen({ onLogin, isLoading }: LoginScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      await onLogin()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome to Celo Automator</CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={isConnecting || isLoading}
            className="w-full"
            size="lg"
          >
            {isConnecting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect with MetaMask
              </>
            )}
          </Button>

          <div className="text-xs text-center text-muted-foreground space-y-2">
            <p>
              By connecting, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className="font-semibold">
              🔒 Secure: Signing a message does not trigger any transaction or cost gas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
