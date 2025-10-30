"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun, Zap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { AuthButton } from "@/components/auth/auth-button"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [network, setNetwork] = useState("mainnet")
  const { isAuthenticated } = useAuth()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleNetworkChange = async (value: string) => {
    setNetwork(value)

  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tools", label: "Tools" },
    { href: "/tools/reactbits", label: "React Bits" },
    { href: "/templates", label: "Templates" },
    { href: "/analytics", label: "Analytics" },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl transition-smooth">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-10 h-10 bg-linear-to-br from-primary via-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-smooth"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={24} className="stroke-[2.5]" />
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-lg text-foreground transition-smooth">
                  Celo Automator
                </span>
              </div>
            </Link>

            {}
            <div className="hidden md:flex items-center gap-1 bg-muted/40 glass rounded-full px-2 py-1.5 border border-border/40">
              {navLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:bg-background/50"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {}
            <div className="flex items-center gap-3">
              {}
              <Select value={network} onValueChange={handleNetworkChange}>
                <SelectTrigger className="hidden md:flex w-[140px]">
                  <SelectValue placeholder="Network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                </SelectContent>
              </Select>

              {}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {}
              <AuthButton />

              {}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="md:hidden py-4 border-t border-border"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex flex-col gap-2">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  )
}
