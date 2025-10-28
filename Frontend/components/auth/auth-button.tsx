"use client"

import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function AuthButton() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <Button onClick={login} variant="default">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  const shortAddress = user?.address
    ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
    : "Unknown"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User className="mr-2 h-4 w-4" />
          <span className="font-mono text-sm">{shortAddress}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex-col items-start">
          <span className="text-xs text-muted-foreground mb-1">Wallet Address</span>
          <span className="font-mono text-xs break-all">{user?.address}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
