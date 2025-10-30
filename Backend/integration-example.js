import { CeloAISDK } from './sdk/src/core/sdk.js';
import { MultiChainConfig } from './multi-chain-config.js';
import PostmanProtocol from './postman-protocol.js';

// Example integration showing how to use the SDK with the existing system
export class IntegrationExample {
  constructor() {
    this.sdk = new CeloAISDK({
      apiKey: process.env.GEMINI_API_KEY,
      privateKey: process.env.PRIVATE_KEY,
      network: 'ethereum',
      enableMultiChain: true,
      enableTesting: true,
      enableProxy: true,
      logLevel: 'info',
    });
    
    this.multiChainConfig = new MultiChainConfig();
    this.postmanProtocol = new PostmanProtocol({
      apiKey: process.env.POSTMAN_API_KEY,
    });
  }

  async initialize() {
    console.log('🚀 Initializing Celo AI SDK Integration...');
    
    try {
      // Initialize the SDK
      await this.sdk.initializeChains();
      console.log('✅ SDK chains initialized');
      
      // Check chain health
      const chainHealth = await this.sdk.getAllChainHealth();
      console.log('📊 Chain Health:', chainHealth);
      
      // Create AI agents
      await this.createAgents();
      
      // Set up testing
      await this.setupTesting();
      
      // Start proxy server if enabled
      if (this.sdk.getConfig().enableProxy) {
        await this.sdk.startProxyServer();
        console.log('🌐 Proxy server started');
      }
      
      console.log('✅ Integration initialized successfully');
      
    } catch (error) {
      console.error('❌ Integration initialization failed:', error);
      throw error;
    }
  }

  async createAgents() {
    console.log('🤖 Creating AI agents...');
    
    // Treasury Manager Agent
    const treasuryAgentId = await this.sdk.createAgent({
      type: 'treasury',
      name: 'Treasury Manager',
      description: 'Manages portfolio allocation and risk',
      capabilities: ['analyze_portfolio', 'rebalance', 'risk_assessment'],
      context: {
        maxRiskScore: 0.3,
        preferredTokens: ['ETH', 'USDC', 'DAI'],
      },
    });
    console.log('💰 Treasury Agent created:', treasuryAgentId);
    
    // DeFi Optimizer Agent
    const defiAgentId = await this.sdk.createAgent({
      type: 'defi',
      name: 'DeFi Optimizer',
      description: 'Optimizes DeFi strategies and yield farming',
      capabilities: ['find_yield', 'execute_swaps', 'liquidity_management'],
      context: {
        maxSlippage: 0.5,
        preferredDEX: 'uniswap',
        minAPY: 0.05,
      },
    });
    console.log('🔄 DeFi Agent created:', defiAgentId);
    
    // Security Agent
    const securityAgentId = await this.sdk.createAgent({
      type: 'security',
      name: 'Security Agent',
      description: 'Audits transactions and smart contracts',
      capabilities: ['audit_transaction', 'security_scan', 'risk_assessment'],
      context: {
        maxRiskScore: 0.1,
        enableSimulation: true,
      },
    });
    console.log('🔒 Security Agent created:', securityAgentId);
    
    this.agents = {
      treasury: treasuryAgentId,
      defi: defiAgentId,
      security: securityAgentId,
    };
  }

  async setupTesting() {
    console.log('🧪 Setting up API testing...');
    
    try {
      // Create test collection
      const collectionId = await this.sdk.createTestCollection(
        'Celo AI API Tests',
        'Comprehensive test suite for Celo AI API endpoints'
      );
      console.log('📋 Test collection created:', collectionId);
      
      // Add test cases
      await this.addTestCases(collectionId);
      
    } catch (error) {
      console.warn('⚠️ Testing setup failed:', error.message);
    }
  }

  async addTestCases(collectionId) {
    // Example test cases would be added here
    console.log('📝 Test cases would be added to collection:', collectionId);
  }

  async demonstrateMultiChain() {
    console.log('🌐 Demonstrating multi-chain capabilities...');
    
    try {
      // Get supported chains
      const chains = await this.sdk.getSupportedChains();
      console.log('📋 Supported chains:', chains.map(c => c.name));
      
      // Send transaction on different chains
      const txRequest = {
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbb',
        value: '1000000000000000000', // 1 ETH
        gasLimit: '21000',
      };
      
      // Ethereum
      const ethTx = await this.sdk.sendTransaction(txRequest, 'ethereum');
      console.log('🔗 Ethereum transaction:', ethTx.txHash);
      
      // Polygon
      const polygonTx = await this.sdk.sendTransaction(txRequest, 'polygon');
      console.log('🔗 Polygon transaction:', polygonTx.txHash);
      
    } catch (error) {
      console.error('❌ Multi-chain demo failed:', error);
    }
  }

  async demonstrateAgents() {
    console.log('🤖 Demonstrating AI agents...');
    
    try {
      // Treasury analysis
      const treasuryResponse = await this.sdk.processWithAgent(
        this.agents.treasury,
        'Analyze my portfolio and suggest rebalancing strategies'
      );
      console.log('💰 Treasury analysis:', treasuryResponse.response);
      
      // DeFi optimization
      const defiResponse = await this.sdk.processWithAgent(
        this.agents.defi,
        'Find the best yield farming opportunities on Ethereum'
      );
      console.log('🔄 DeFi optimization:', defiResponse.response);
      
      // Security audit
      const securityResponse = await this.sdk.processWithAgent(
        this.agents.security,
        'Audit this transaction for security risks'
      );
      console.log('🔒 Security audit:', securityResponse.response);
      
    } catch (error) {
      console.error('❌ Agent demo failed:', error);
    }
  }

  async demonstrateContractDeployment() {
    console.log('📝 Demonstrating contract deployment...');
    
    try {
      // Deploy a simple contract
      const contractConfig = {
        name: 'ExampleToken',
        version: '1.0.0',
        source: `
          pragma solidity ^0.8.0;
          contract ExampleToken {
              mapping(address => uint256) public balances;
              
              function transfer(address to, uint256 amount) public {
                  balances[msg.sender] -= amount;
                  balances[to] += amount;
              }
          }
        `,
        abi: [
          {
            inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
            name: 'transfer',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        bytecode: '0x608060405234801561001057600080fd5b50...', // Mock bytecode
        constructorArgs: [],
        gasLimit: '2000000',
      };
      
      const deployment = await this.sdk.deployContract(contractConfig, 'ethereum');
      console.log('📝 Contract deployed:', deployment.contractAddress);
      
    } catch (error) {
      console.error('❌ Contract deployment failed:', error);
    }
  }

  async runTests() {
    console.log('🧪 Running API tests...');
    
    try {
      const testResults = await this.sdk.runTests();
      console.log('📊 Test results:', testResults.length, 'tests completed');
      
      const passed = testResults.filter(r => r.success).length;
      const failed = testResults.filter(r => !r.success).length;
      
      console.log(`✅ Passed: ${passed}`);
      console.log(`❌ Failed: ${failed}`);
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
    }
  }

  async healthCheck() {
    console.log('🏥 Performing health check...');
    
    try {
      const health = await this.sdk.healthCheck();
      console.log('💚 SDK Health:', health.healthy ? 'Healthy' : 'Unhealthy');
      console.log('🔧 Services:', health.services);
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up...');
    
    try {
      await this.sdk.destroy();
      console.log('✅ Cleanup completed');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  // Event handlers
  setupEventHandlers() {
    this.sdk.on('transactionSent', (data) => {
      console.log('📤 Transaction sent:', data.txHash);
    });
    
    this.sdk.on('agentResponse', (data) => {
      console.log('🤖 Agent response:', data.response);
    });
    
    this.sdk.on('contractDeployed', (data) => {
      console.log('📝 Contract deployed:', data.contractAddress);
    });
    
    this.sdk.on('testCompleted', (data) => {
      console.log('✅ Test completed:', data.testName);
    });
  }
}

// Example usage
async function main() {
  const integration = new IntegrationExample();
  
  try {
    // Set up event handlers
    integration.setupEventHandlers();
    
    // Initialize
    await integration.initialize();
    
    // Demonstrate features
    await integration.demonstrateMultiChain();
    await integration.demonstrateAgents();
    await integration.demonstrateContractDeployment();
    await integration.runTests();
    await integration.healthCheck();
    
    // Cleanup
    await integration.cleanup();
    
  } catch (error) {
    console.error('💥 Integration failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default IntegrationExample;
