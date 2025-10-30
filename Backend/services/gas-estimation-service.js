
import fetch from 'node-fetch';

export class GasEstimationService {
  constructor(config = {}) {
    this.etherscanApiKey = config.etherscanApiKey || process.env.ETHERSCAN_API_KEY;
    this.network = config.network || 'alfajores';
    this.rpcUrl = config.rpcUrl || process.env.RPC_URL;
    this.etherscanUrl = this.getEtherscanUrl();
  }

  getEtherscanUrl() {
    const map = {
      mainnet: 'https://api.celoscan.io/api',
      celo: 'https://api.celoscan.io/api',
      alfajores: 'https://api-alfajores.celoscan.io/api',
    };
    return map[this.network] || map.alfajores;
  }

  async rpc(method, params = []) {
    const res = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message || 'RPC error');
    return json.result;
  }

  async estimateGas(to, value = '0', data = '0x', from) {
    try {
      const hexValue = this.toHexWei(value);
      const result = await this.rpc('eth_estimateGas', [{ to, value: hexValue, data: data || '0x', from }]);
      return BigInt(result).toString();
    } catch (e) {
      return null;
    }
  }

  async getGasPrice() {
    try {
      const result = await this.rpc('eth_gasPrice');
      const gasPrice = BigInt(result);
      const gwei = Number(gasPrice) / 1e9;
      return {
        standard: gwei.toFixed(2),
        fast: (gwei * 1.25).toFixed(2),
        instant: (gwei * 1.5).toFixed(2)
      };
    } catch (e) {
      return null;
    }
  }

  async getGasTracker() {
    try {
      if (!this.etherscanApiKey) return null;
      const res = await fetch(`${this.etherscanUrl}?module=gastracker&action=gasoracle&apikey=${this.etherscanApiKey}`);
      const json = await res.json();
      if (json.status === '1' && json.result) {
        return {
          standard: json.result.SafeGasPrice,
          fast: json.result.ProposeGasPrice || json.result.StandardGasPrice,
          instant: json.result.FastGasPrice,
          baseFee: json.result.suggestBaseFee
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async estimateTransactionCost(to, value = '0', data = '0x') {
    const [gasLimit, gasPrice] = await Promise.all([
      this.estimateGas(to, value, data),
      this.getGasPrice(),
    ]);
    if (!gasLimit || !gasPrice) return this.getDefaultEstimate();
    const gas = BigInt(gasLimit);
    const priceWei = BigInt(Math.floor(Number(gasPrice.standard) * 1e9));
    return {
      gasLimit: gasLimit,
      gasPrice: gasPrice.standard,
      gasPriceWei: priceWei.toString(),
      estimatedCost: (gas * priceWei / BigInt(1e18)).toString(),
      estimatedCostGwei: (gas * priceWei / BigInt(1e9)).toString(),
      breakdown: {
        safe: { gasPrice: gasPrice.standard },
        fast: { gasPrice: gasPrice.fast },
        instant: { gasPrice: gasPrice.instant }
      }
    };
  }

  getDefaultEstimate() {
    const gasLimit = 21000;
    const gasPriceGwei = 0.5;
    const estimatedCostWei = gasLimit * gasPriceGwei * 1e9;
    const estimatedCostEth = estimatedCostWei / 1e18;
    return {
      gasLimit: String(gasLimit),
      gasPrice: String(gasPriceGwei),
      gasPriceWei: String(gasPriceGwei * 1e9),
      estimatedCost: estimatedCostEth.toFixed(6),
      estimatedCostGwei: String(estimatedCostWei / 1e9),
      breakdown: {}
    };
  }

  async getComprehensiveGasData(to, value = '0', data = '0x') {
    const [transaction, tracker] = await Promise.all([
      this.estimateTransactionCost(to, value, data),
      this.getGasTracker()
    ]);
    return {
      transaction,
      tracker: tracker || {
        standard: transaction.gasPrice,
        fast: String(Math.floor(Number(transaction.gasPrice) * 1.25)),
        instant: String(Math.floor(Number(transaction.gasPrice) * 1.5))
      },
      timestamp: new Date().toISOString()
    };
  }

  toHexWei(value) {
    if (!value || value === '0') return '0x0';
    try {
      const num = BigInt(value);
      return `0x${num.toString(16)}`;
    } catch (_) {
      try {
        const parsed = BigInt(parseInt(String(value), 10));
        return `0x${parsed.toString(16)}`;
      } catch {
        return '0x0';
      }
    }
  }
}
