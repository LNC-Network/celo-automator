

import fetch from 'node-fetch';

export class EtherscanService {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.ETHERSCAN_API_KEY;
    this.network = config.network || 'alfajores';
    this.baseUrl = this.getBaseUrl();
  }

  getBaseUrl() {
    const networkMap = {
      'mainnet': 'https:
      'alfajores': 'https:
      'celo': 'https:
    };
    return networkMap[this.network] || networkMap['alfajores'];
  }

  async getBalance(address) {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`
      );
      const result = await response.json();
      if (result.status === '1') {
        return result.result;
      }
      throw new Error(result.message || 'Failed to get balance');
    } catch (error) {
      console.error('Etherscan balance error:', error);
      return null;
    }
  }

  async getTransactions(address, startBlock = 0, endBlock = 99999999, sort = 'desc') {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=${sort}&apikey=${this.apiKey}`
      );
      const result = await response.json();
      if (result.status === '1') {
        return result.result;
      }
      return [];
    } catch (error) {
      console.error('Etherscan transactions error:', error);
      return [];
    }
  }

  async getInternalTransactions(address) {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=account&action=txlistinternal&address=${address}&apikey=${this.apiKey}`
      );
      const result = await response.json();
      if (result.status === '1') {
        return result.result;
      }
      return [];
    } catch (error) {
      console.error('Etherscan internal transactions error:', error);
      return [];
    }
  }

  async getTokenTransfers(address, contractAddress = null) {
    try {
      let url = `${this.baseUrl}?module=account&action=tokentx&address=${address}`;
      if (contractAddress) {
        url += `&contractaddress=${contractAddress}`;
      }
      url += `&apikey=${this.apiKey}`;

      const response = await fetch(url);
      const result = await response.json();
      if (result.status === '1') {
        return result.result;
      }
      return [];
    } catch (error) {
      console.error('Etherscan token transfers error:', error);
      return [];
    }
  }

  async getTransactionStatus(txHash) {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${this.apiKey}`
      );
      const result = await response.json();
      if (result.status === '1') {
        return {
          status: result.result.status === '1' ? 'success' : 'failed',
          isError: result.result.isError === '1'
        };
      }
      return null;
    } catch (error) {
      console.error('Etherscan transaction status error:', error);
      return null;
    }
  }

  async getContractABI(contractAddress) {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${this.apiKey}`
      );
      const result = await response.json();
      if (result.status === '1') {
        return JSON.parse(result.result);
      }
      throw new Error(result.message || 'Failed to get ABI');
    } catch (error) {
      console.error('Etherscan ABI error:', error);
      return null;
    }
  }

  async getContractSourceCode(contractAddress) {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${this.apiKey}`
      );
      const result = await response.json();
      if (result.status === '1' && result.result.length > 0) {
        return result.result[0];
      }
      return null;
    } catch (error) {
      console.error('Etherscan source code error:', error);
      return null;
    }
  }

  async getGasTracker() {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=gastracker&action=gasoracle&apikey=${this.apiKey}`
      );
      const result = await response.json();
      if (result.status === '1') {
        return result.result;
      }
      return null;
    } catch (error) {
      console.error('Etherscan gas tracker error:', error);
      return null;
    }
  }

  async getBlockInfo(blockNumber) {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${this.apiKey}`
      );
      const result = await response.json();
      if (result.result) {
        return result.result;
      }
      return null;
    } catch (error) {
      console.error('Etherscan block info error:', error);
      return null;
    }
  }

  async getAccountAnalytics(address) {
    try {
      const [balance, transactions, internalTxs, tokenTransfers] = await Promise.all([
        this.getBalance(address),
        this.getTransactions(address),
        this.getInternalTransactions(address),
        this.getTokenTransfers(address)
      ]);

      return {
        address,
        balance,
        transactionCount: transactions.length,
        internalTransactionCount: internalTxs.length,
        tokenTransferCount: tokenTransfers.length,
        totalTransactions: transactions.length + internalTxs.length + tokenTransfers.length,
        recentTransactions: transactions.slice(0, 10),
        recentTokenTransfers: tokenTransfers.slice(0, 10)
      };
    } catch (error) {
      console.error('Etherscan analytics error:', error);
      return null;
    }
  }
}

