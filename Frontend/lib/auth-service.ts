

import { ethers } from "ethers"

export interface AuthUser {
  address: string
  signature: string
  nonce: string
  timestamp: number
}

export interface AuthSession {
  token: string
  user: AuthUser
  expiresAt: number
}

const STORAGE_KEYS = {
  AUTH_TOKEN: 'celo_auth_token',
  AUTH_USER: 'celo_auth_user',
  AUTH_NONCE: 'celo_auth_nonce'
}

function generateNonce(): string {
  return ethers.hexlify(ethers.randomBytes(32))
}

function getAuthMessage(address: string, nonce: string): string {
  return `Sign this message to authenticate with Celo Automator.

Wallet: ${address}
Nonce: ${nonce}
Timestamp: ${Date.now()}

This request will not trigger a blockchain transaction or cost any gas fees.

Only sign this message if you trust this application.`
}

function createToken(user: AuthUser): string {
  const payload = {
    address: user.address,
    timestamp: user.timestamp,
    exp: user.timestamp + (7 * 24 * 60 * 60 * 1000)
  }
  return btoa(JSON.stringify(payload))
}

function verifyToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) {
      return null
    }
    return {
      address: payload.address,
      signature: '',
      nonce: '',
      timestamp: payload.timestamp
    }
  } catch (error) {
    return null
  }
}

async function getSigner(): Promise<ethers.Signer> {
  if (typeof window === "undefined") {
    throw new Error("Client-side only")
  }

  if (!window.ethereum) {
    throw new Error("No Ethereum provider found. Please install MetaMask.")
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  return await provider.getSigner()
}

async function requestSignature(address: string, nonce: string): Promise<string> {
  const signer = await getSigner()
  const message = getAuthMessage(address, nonce)
  return await signer.signMessage(message)
}

export async function authenticateWithMetaMask(): Promise<AuthSession> {
  try {

    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    })

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found")
    }

    const address = accounts[0]

    let nonce = localStorage.getItem(STORAGE_KEYS.AUTH_NONCE)
    if (!nonce) {
      nonce = generateNonce()
      localStorage.setItem(STORAGE_KEYS.AUTH_NONCE, nonce)
    }

    const signature = await requestSignature(address, nonce)

    const user: AuthUser = {
      address,
      signature,
      nonce,
      timestamp: Date.now()
    }

    const token = createToken(user)

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))

    localStorage.removeItem(STORAGE_KEYS.AUTH_NONCE)

    const session: AuthSession = {
      token,
      user,
      expiresAt: user.timestamp + (7 * 24 * 60 * 60 * 1000)
    }

    return session
  } catch (error) {
    console.error("[Auth Service] Authentication error:", error)
    throw new Error(
      error instanceof Error ? error.message : "Failed to authenticate"
    )
  }
}

export function getCurrentSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER)

    if (!token || !userStr) {
      return null
    }

    const user = JSON.parse(userStr) as AuthUser
    const verifiedUser = verifyToken(token)

    if (!verifiedUser) {
      return null
    }

    return {
      token,
      user,
      expiresAt: user.timestamp + (7 * 24 * 60 * 60 * 1000)
    }
  } catch (error) {
    console.error("[Auth Service] Session verification error:", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  const session = getCurrentSession()
  return session !== null && session.expiresAt > Date.now()
}

export function getCurrentUser(): AuthUser | null {
  const session = getCurrentSession()
  return session?.user || null
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
}

export function logout(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
  localStorage.removeItem(STORAGE_KEYS.AUTH_NONCE)
}

export async function reAuthenticate(): Promise<AuthSession> {
  logout()
  return await authenticateWithMetaMask()
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}
