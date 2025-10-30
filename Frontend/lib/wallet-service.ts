

import { ethers } from "ethers"

export interface WalletProvider {
  address: string
  balance: string
  chainId: number
  network: string
}

export function getProvider() {
  if (typeof window === "undefined") return null
  if (!window.ethereum) {
    throw new Error("No Ethereum provider found. Please install a Web3 wallet.")
  }
  return new ethers.BrowserProvider(window.ethereum)
}

export async function getSigner() {
  const provider = getProvider()
  if (!provider) throw new Error("Provider not available")
  return await provider.getSigner()
}

export async function connectWallet(): Promise<WalletProvider> {
  try {
    if (typeof window === "undefined") throw new Error("Client-side only")

    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    })

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found")
    }

    const address = accounts[0]
    const provider = getProvider()
    if (!provider) throw new Error("Provider not available")

    const balance = await provider.getBalance(address)
    const balanceInCELO = ethers.formatEther(balance)

    const network = await provider.getNetwork()

    return {
      address,
      balance: balanceInCELO,
      chainId: Number(network.chainId),
      network: network.name || "unknown",
    }
  } catch (error) {
    console.error("[Wallet Service] Connect error:", error)
    throw new Error(
      error instanceof Error ? error.message : "Failed to connect wallet"
    )
  }
}

export async function switchToCeloMainnet() {
  try {
    if (typeof window === "undefined") throw new Error("Client-side only")

    await window.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xa4ec" }],
    })
  } catch (error: any) {

    if (error.code === 4902) {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xa4ec",
            chainName: "Celo Mainnet",
            rpcUrls: ["https://forno.celo.org"],
            nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
            blockExplorerUrls: ["https://celoscan.io"],
          },
        ],
      })
    } else {
      throw error
    }
  }
}

export async function switchToCeloTestnet() {
  try {
    if (typeof window === "undefined") throw new Error("Client-side only")

    await window.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaef3" }],
    })
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xaef3",
            chainName: "Celo Alfajores Testnet",
            rpcUrls: ["https://forno.celo.org"],
            nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
            blockExplorerUrls: ["https://celoscan.io"],
          },
        ],
      })
    } else {
      throw error
    }
  }
}

export async function getWalletBalance(address: string): Promise<string> {
  try {
    const provider = getProvider()
    if (!provider) throw new Error("Provider not available")

    const balance = await provider.getBalance(address)
    return ethers.formatEther(balance)
  } catch (error) {
    console.error("[Wallet Service] Balance fetch error:", error)
    throw error
  }
}

export function disconnectWallet() {

  if (typeof window !== "undefined") {
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletBalance")
  }
}

export function watchAccountChanges(callback: (accounts: string[]) => void) {
  if (typeof window === "undefined") return

  window.ethereum?.on("accountsChanged", callback)

  return () => {
    window.ethereum?.removeListener("accountsChanged", callback)
  }
}

export function watchChainChanges(callback: (chainId: string) => void) {
  if (typeof window === "undefined") return

  window.ethereum?.on("chainChanged", callback)

  return () => {
    window.ethereum?.removeListener("chainChanged", callback)
  }
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void
    }
  }
}
