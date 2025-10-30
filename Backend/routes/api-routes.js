import express from 'express';
import { MultiChainConfig } from '../multi-chain-config.js';
import { ProxyServer } from '../proxy-server.js';
import { ContractFactory } from '../contract-factory.js';
import { MonitoringSystem } from '../monitoring-system.js';
import PostmanProtocol from '../postman-protocol.js';

const router = express.Router();

// Initialize services
const multiChainConfig = new MultiChainConfig();
const contractFactory = new ContractFactory(multiChainConfig);
const monitoringSystem = new MonitoringSystem();
const postmanProtocol = new PostmanProtocol({
  apiKey: process.env.POSTMAN_API_KEY,
});

// Chain routes
router.get('/chains', async (req, res) => {
  try {
    const chains = multiChainConfig.getAllChains();
    res.json({ chains });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chains/health', async (req, res) => {
  try {
    const health = await multiChainConfig.checkAllChainsHealth();
    res.json({ chains: health });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chains/:chainId/health', async (req, res) => {
  try {
    const { chainId } = req.params;
    const health = await multiChainConfig.checkChainHealth(chainId);
    res.json({ chainId, health });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chains/select', async (req, res) => {
  try {
    const { operation, preferences } = req.body;
    const bestChain = multiChainConfig.getBestChainForOperation(operation, preferences);
    res.json({ 
      selectedChain: bestChain,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contract routes
router.post('/contracts/deploy', async (req, res) => {
  try {
    const { contractConfig, chainId = 'ethereum' } = req.body;
    const deployment = await contractFactory.deployContract(contractConfig, chainId);
    res.json(deployment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/contracts', async (req, res) => {
  try {
    const { chainId } = req.query;
    const contracts = await contractFactory.getDeployedContracts(chainId);
    res.json({ contracts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/contracts/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { abi, chainId = 'ethereum' } = req.query;
    
    if (!abi) {
      return res.status(400).json({ error: 'ABI is required' });
    }
    
    const contract = await contractFactory.getContract(address, JSON.parse(abi), chainId);
    res.json({ contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Monitoring routes
router.get('/monitoring/system', async (req, res) => {
  try {
    const metrics = monitoringSystem.metrics.system;
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/monitoring/application', async (req, res) => {
  try {
    const metrics = monitoringSystem.metrics.application;
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/monitoring/performance', async (req, res) => {
  try {
    const metrics = monitoringSystem.metrics.performance;
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/monitoring/alerts', async (req, res) => {
  try {
    const alerts = monitoringSystem.alerts;
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/monitoring/logs', async (req, res) => {
  try {
    const logs = monitoringSystem.logs.slice(-100); // Last 100 logs
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/monitoring/health', async (req, res) => {
  try {
    const health = monitoringSystem.getHealthStatus();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Testing routes
router.get('/testing/collections', async (req, res) => {
  try {
    const collections = await postmanProtocol.getCollections();
    res.json({ collections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/testing/collections', async (req, res) => {
  try {
    const { name, description } = req.body;
    const collectionId = await postmanProtocol.createCollection({
      info: {
        name,
        description: description || '',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: [],
    });
    res.json({ collectionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/testing/collections/:collectionId', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await postmanProtocol.getCollection(collectionId);
    res.json({ collection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/testing/collections/:collectionId/tests', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const test = req.body;
    
    // Add test to collection (mock implementation)
    res.json({ success: true, testId: test.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/testing/collections/:collectionId/tests/:testId', async (req, res) => {
  try {
    const { collectionId, testId } = req.params;
    
    // Remove test from collection (mock implementation)
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/testing/collections/:collectionId/run', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const results = await postmanProtocol.runCollectionTests(collectionId);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/testing/collections/:collectionId/tests/:testId/run', async (req, res) => {
  try {
    const { collectionId, testId } = req.params;
    
    // Run single test (mock implementation)
    const result = {
      id: testId,
      testName: `Test ${testId}`,
      success: Math.random() > 0.2, // 80% success rate
      status: Math.random() > 0.2 ? 'passed' : 'failed',
      duration: Math.floor(Math.random() * 1000) + 100,
      request: {
        method: 'GET',
        url: 'https://api.example.com/test',
        headers: {},
      },
      response: {
        status: 200,
        headers: {},
        body: { success: true },
        duration: Math.floor(Math.random() * 500) + 50,
      },
      timestamp: new Date().toISOString(),
    };
    
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction routes
router.post('/transactions/send', async (req, res) => {
  try {
    const { transaction, chainId = 'ethereum' } = req.body;
    
    // Create chain client
    const client = await multiChainConfig.createChainClient(chainId);
    
    // Send transaction (mock implementation)
    const result = {
      success: true,
      txHash: '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join(''),
      timestamp: new Date().toISOString(),
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transactions/:txHash/status', async (req, res) => {
  try {
    const { txHash } = req.params;
    
    // Get transaction status (mock implementation)
    const status = {
      success: true,
      status: 'success',
      blockNumber: '12345678',
      gasUsed: '21000',
      confirmations: '12+',
    };
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Token balance routes
router.get('/tokens/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { tokenAddress = '0x0000000000000000000000000000000000000000', chainId = 'ethereum' } = req.query;
    
    // Create chain client
    const client = await multiChainConfig.createChainClient(chainId);
    
    // Get token balance (mock implementation)
    const balance = {
      success: true,
      balance: (Math.random() * 100).toFixed(6),
      raw: Math.floor(Math.random() * 1000000000000000000).toString(),
      decimals: 18,
      symbol: 'ETH',
      address: tokenAddress,
    };
    
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agent routes
router.get('/agents', async (req, res) => {
  try {
    // Get agents (mock implementation)
    const agents = [
      {
        id: 'agent_1',
        type: 'treasury',
        name: 'Treasury Manager',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'agent_2',
        type: 'defi',
        name: 'DeFi Optimizer',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ];
    
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/agents', async (req, res) => {
  try {
    const { type, name, description, capabilities } = req.body;
    
    // Create agent (mock implementation)
    const agent = {
      id: `agent_${Date.now()}`,
      type,
      name,
      description,
      capabilities,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    res.json({ agent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/agents/:agentId/process', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { input, options = {} } = req.body;
    
    // Process with agent (mock implementation)
    const response = {
      success: true,
      response: `AI Agent response for: ${input}`,
      reasoning: 'AI reasoning process',
      confidence: 0.85,
      functionCalls: [],
      executionTime: Math.floor(Math.random() * 1000) + 100,
      agentId,
      timestamp: new Date().toISOString(),
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
router.get('/health', async (req, res) => {
  try {
    const health = {
      healthy: true,
      status: 'operational',
      timestamp: new Date().toISOString(),
      services: {
        chains: true,
        contracts: true,
        monitoring: true,
        testing: true,
        agents: true,
      },
      uptime: process.uptime(),
      version: '1.0.0',
    };
    
    res.json(health);
  } catch (error) {
    res.status(500).json({ 
      healthy: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
