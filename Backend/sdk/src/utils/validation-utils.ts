export class ValidationUtils {
  validateAddress(address: string): void {
    if (!address || typeof address !== 'string') {
      throw new Error('Address must be a non-empty string');
    }
    
    if (!address.startsWith('0x')) {
      throw new Error('Address must start with 0x');
    }
    
    if (address.length !== 42) {
      throw new Error('Address must be 42 characters long');
    }
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error('Address must be a valid hexadecimal string');
    }
  }

  validateTransactionRequest(request: any): void {
    if (!request || typeof request !== 'object') {
      throw new Error('Transaction request must be an object');
    }
    
    if (!request.to) {
      throw new Error('Transaction request must have a "to" field');
    }
    
    this.validateAddress(request.to);
    
    if (request.value && typeof request.value !== 'string') {
      throw new Error('Transaction value must be a string');
    }
    
    if (request.gasLimit && typeof request.gasLimit !== 'string') {
      throw new Error('Gas limit must be a string');
    }
    
    if (request.gasPrice && typeof request.gasPrice !== 'string') {
      throw new Error('Gas price must be a string');
    }
  }

  validateAgentConfig(config: any): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Agent config must be an object');
    }
    
    if (!config.type || typeof config.type !== 'string') {
      throw new Error('Agent config must have a valid type');
    }
    
    if (!config.name || typeof config.name !== 'string') {
      throw new Error('Agent config must have a valid name');
    }
    
    if (!config.description || typeof config.description !== 'string') {
      throw new Error('Agent config must have a valid description');
    }
    
    if (!Array.isArray(config.capabilities)) {
      throw new Error('Agent config must have capabilities array');
    }
  }

  validateContractConfig(config: any): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Contract config must be an object');
    }
    
    if (!config.name || typeof config.name !== 'string') {
      throw new Error('Contract config must have a valid name');
    }
    
    if (!config.version || typeof config.version !== 'string') {
      throw new Error('Contract config must have a valid version');
    }
    
    if (!config.source || typeof config.source !== 'string') {
      throw new Error('Contract config must have a valid source');
    }
    
    if (!Array.isArray(config.abi)) {
      throw new Error('Contract config must have a valid ABI array');
    }
    
    if (!config.bytecode || typeof config.bytecode !== 'string') {
      throw new Error('Contract config must have valid bytecode');
    }
  }

  validatePrivateKey(privateKey: string): void {
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('Private key must be a non-empty string');
    }
    
    if (!privateKey.startsWith('0x')) {
      throw new Error('Private key must start with 0x');
    }
    
    if (privateKey.length !== 66) {
      throw new Error('Private key must be 66 characters long');
    }
    
    if (!/^0x[a-fA-F0-9]{64}$/.test(privateKey)) {
      throw new Error('Private key must be a valid hexadecimal string');
    }
  }

  validateChainId(chainId: string | number): void {
    const id = typeof chainId === 'string' ? parseInt(chainId, 10) : chainId;
    
    if (isNaN(id) || id <= 0) {
      throw new Error('Chain ID must be a positive number');
    }
  }

  validateAmount(amount: string): void {
    if (!amount || typeof amount !== 'string') {
      throw new Error('Amount must be a non-empty string');
    }
    
    if (!/^\d+(\.\d+)?$/.test(amount)) {
      throw new Error('Amount must be a valid number string');
    }
    
    if (parseFloat(amount) < 0) {
      throw new Error('Amount must be non-negative');
    }
  }

  validateGasPrice(gasPrice: string): void {
    if (!gasPrice || typeof gasPrice !== 'string') {
      throw new Error('Gas price must be a non-empty string');
    }
    
    if (!/^\d+$/.test(gasPrice)) {
      throw new Error('Gas price must be a valid number string');
    }
    
    if (parseInt(gasPrice, 10) <= 0) {
      throw new Error('Gas price must be positive');
    }
  }

  validateUrl(url: string): void {
    if (!url || typeof url !== 'string') {
      throw new Error('URL must be a non-empty string');
    }
    
    try {
      new URL(url);
    } catch {
      throw new Error('URL must be a valid URL');
    }
  }

  validateApiKey(apiKey: string): void {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('API key must be a non-empty string');
    }
    
    if (apiKey.length < 10) {
      throw new Error('API key must be at least 10 characters long');
    }
  }
}
