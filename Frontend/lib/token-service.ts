

import { ethers } from "ethers"
import { getProvider } from "./wallet-service"

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)",
]

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  balance: string
  price?: number | null
  value?: number
}

export const COMMON_TOKENS = {
  CELO: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
  cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  cEUR: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
  cREAL: "0x00Be915B9dCf56a3CBE739D9B9c202ca692409EC",
}

export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string
): Promise<string> {
  try {
    const provider = getProvider()
    if (!provider) throw new Error("Provider not available")

    if (!ethers.isAddress(tokenAddress)) {
      console.warn('[Token Service] Invalid token address:', tokenAddress)
      return "0"
    }
    if (!ethers.isAddress(walletAddress)) {
      console.warn('[Token Service] Invalid wallet address:', walletAddress)
      return "0"
    }

    const code = await provider.getCode(tokenAddress)
    if (code === "0x") {
      console.warn('[Token Service] No contract found at address:', tokenAddress)
      return "0"
    }

    const contract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    )

    const [balance, decimals] = await Promise.all([
      contract.balanceOf(walletAddress).catch((err: any) => {
        console.warn('[Token Service] balanceOf failed for', tokenAddress, ':', err.message)
        return ethers.parseUnits("0", 18)
      }),
      contract.decimals().catch((err: any) => {
        console.warn('[Token Service] decimals failed for', tokenAddress, ':', err.message)
        return 18
      }),
    ])

    return ethers.formatUnits(balance, decimals)
  } catch (error) {
    console.error("[Token Service] Balance fetch error:", error)
    return "0"
  }
}

export async function getTokenMetadata(
  tokenAddress: string
): Promise<Omit<Token, "balance" | "price" | "value">> {
  try {
    const provider = getProvider()
    if (!provider) throw new Error("Provider not available")

    if (!ethers.isAddress(tokenAddress)) {
      throw new Error(`Invalid token address: ${tokenAddress}`)
    }

    const code = await provider.getCode(tokenAddress)
    if (code === "0x") {
      throw new Error(`No contract found at address: ${tokenAddress}`)
    }

    const contract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    )

    const [symbol, name, decimals] = await Promise.all([
      contract.symbol().catch((err: any) => {
        console.warn('[Token Service] symbol failed for', tokenAddress, ':', err.message)
        return "UNKNOWN"
      }),
      contract.name().catch((err: any) => {
        console.warn('[Token Service] name failed for', tokenAddress, ':', err.message)
        return "Unknown Token"
      }),
      contract.decimals().catch((err: any) => {
        console.warn('[Token Service] decimals failed for', tokenAddress, ':', err.message)
        return 18
      }),
    ])

    return {
      address: tokenAddress,
      symbol,
      name,
      decimals,
    }
  } catch (error) {
    console.error("[Token Service] Metadata fetch error:", error)
    throw error
  }
}

export async function getTokenPrice(tokenSymbol: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenSymbol.toLowerCase()}&vs_currencies=usd`
    )
    const data = await response.json()
    return data[tokenSymbol.toLowerCase()]?.usd || null
  } catch (error) {
    console.error("[Token Service] Price fetch error:", error)
    return null
  }
}

export async function getMultipleTokenBalances(
  tokenAddresses: string[],
  walletAddress: string
): Promise<Token[]> {
  try {
    const provider = getProvider()
    if (!provider) throw new Error("Provider not available")

    const validAddresses = tokenAddresses.filter(addr => ethers.isAddress(addr))
    if (validAddresses.length === 0) {
      console.warn('[Token Service] No valid token addresses provided')
      return []
    }

    const balancePromises = validAddresses.map(async (tokenAddress) => {
      try {
        return await getTokenBalance(tokenAddress, walletAddress)
      } catch (error) {
        console.warn('[Token Service] Failed to get balance for', tokenAddress, ':', error)
        return "0"
      }
    })

    const metadataPromises = validAddresses.map(async (tokenAddress) => {
      try {
        return await getTokenMetadata(tokenAddress)
      } catch (error) {
        console.warn('[Token Service] Failed to get metadata for', tokenAddress, ':', error)
        return null
      }
    })

    const [balances, metadatas] = await Promise.all([
      Promise.all(balancePromises),
      Promise.all(metadataPromises),
    ])

    const tokens: Token[] = []
    for (let i = 0; i < metadatas.length; i++) {
      const metadata = metadatas[i]
      if (!metadata) continue

      try {
        const price = await getTokenPrice(metadata.symbol)
        const balance = balances[i]
        const value = price ? parseFloat(balance) * price : undefined

        tokens.push({
          ...metadata,
          balance,
          price,
          value,
        })
      } catch (error) {
        console.warn('[Token Service] Failed to process token', metadata.symbol, ':', error)
      }
    }

    return tokens
  } catch (error) {
    console.error("[Token Service] Multiple balances fetch error:", error)
    return []
  }
}

export async function getCeloBalance(walletAddress: string): Promise<string> {
  try {
    const provider = getProvider()
    if (!provider) throw new Error("Provider not available")

    const balance = await provider.getBalance(walletAddress)
    return ethers.formatEther(balance)
  } catch (error) {
    console.error("[Token Service] CELO balance fetch error:", error)
    return "0"
  }
}

export async function getCeloCommonTokens(
  walletAddress: string
): Promise<Token[]> {
  try {
    const tokenAddresses = Object.values(COMMON_TOKENS)
    const tokens = await getMultipleTokenBalances(tokenAddresses, walletAddress)

    const celoBalance = await getCeloBalance(walletAddress)
    const celoPrice = await getTokenPrice("celo")

    const celoToken: Token = {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "CELO",
      name: "Celo Native Token",
      decimals: 18,
      balance: celoBalance,
      price: celoPrice || undefined,
      value: celoPrice ? parseFloat(celoBalance) * celoPrice : undefined,
    }

    return [celoToken, ...tokens].filter((token) => parseFloat(token.balance) > 0)
  } catch (error) {
    console.error("[Token Service] Common tokens fetch error:", error)
    return []
  }
}

export async function getTokenInfo(
  tokenAddress: string,
  walletAddress: string
): Promise<Token | null> {
  try {
    const [metadata, balance] = await Promise.all([
      getTokenMetadata(tokenAddress),
      getTokenBalance(tokenAddress, walletAddress),
    ])

    const price = await getTokenPrice(metadata.symbol)
    const value = price ? parseFloat(balance) * price : undefined

    return {
      ...metadata,
      balance,
      price,
      value,
    }
  } catch (error) {
    console.error("[Token Service] Token info fetch error:", error)
    return null
  }
}

export async function transferToken(
  tokenAddress: string,
  toAddress: string,
  amount: string
): Promise<string> {
  try {
    const provider = getProvider()
    if (!provider) throw new Error("Provider not available")

    const signer = await provider.getSigner()

    if (tokenAddress === "0x0000000000000000000000000000000000000000") {
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      })
      return tx.hash
    }

    const contract = new ethers.Contract(
      tokenAddress,
      [
        ...ERC20_ABI,
        "function transfer(address to, uint256 amount) returns (bool)",
      ],
      signer
    )

    const decimals = await contract.decimals()
    const tx = await contract.transfer(
      toAddress,
      ethers.parseUnits(amount, decimals)
    )

    return tx.hash
  } catch (error) {
    console.error("[Token Service] Transfer error:", error)
    throw error
  }
}
