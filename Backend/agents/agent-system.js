import { EventEmitter } from 'events';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIAgentSystem extends EventEmitter {
  constructor(automationSystem, geminiApiKey) {
    super();
    this.automationSystem = automationSystem;
    this.gemini = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.gemini.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096,
      }
    });
    
    this.agents = new Map();
    this.agentTypes = new Map();
    this.initializeAgentTypes();
  }

  initializeAgentTypes() {
    this.agentTypes.set('treasury', {
      name: 'Treasury Manager',
      description: 'Manages portfolio allocation and risk',
      capabilities: ['analyze_portfolio', 'rebalance', 'risk_assessment']
    });
    
    this.agentTypes.set('defi', {
      name: 'DeFi Optimizer',
      description: 'Optimizes DeFi strategies and yield farming',
      capabilities: ['find_yield', 'execute_swaps', 'liquidity_management']
    });
    
    this.agentTypes.set('nft', {
      name: 'NFT Manager',
      description: 'Handles NFT operations and collection management',
      capabilities: ['mint_nft', 'analyze_collection', 'market_analysis']
    });
    
    this.agentTypes.set('governance', {
      name: 'Governance Agent',
      description: 'Manages DAO governance and voting',
      capabilities: ['analyze_proposals', 'vote', 'create_proposals']
    });
    
    this.agentTypes.set('security', {
      name: 'Security Agent',
      description: 'Audits transactions and smart contracts',
      capabilities: ['audit_transaction', 'security_scan', 'risk_assessment']
    });
    
    this.agentTypes.set('analytics', {
      name: 'Analytics Agent',
      description: 'Provides data analysis and reporting',
      capabilities: ['generate_reports', 'predict_trends', 'performance_analysis']
    });
  }

  async createAgent(agentType, context = {}) {
    const typeConfig = this.agentTypes.get(agentType);
    if (!typeConfig) {
      throw new Error(`Unknown agent type: ${agentType}`);
    }

    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const agent = {
      id: agentId,
      type: agentType,
      name: typeConfig.name,
      description: typeConfig.description,
      capabilities: typeConfig.capabilities,
      context: {
        sessionId: context.sessionId || agentId,
        userId: context.userId,
        walletAddress: context.walletAddress,
        network: context.network || 'alfajores',
        preferences: context.preferences || {},
        history: []
      },
      status: 'active',
      createdAt: new Date(),
      performance: {
        successRate: 0,
        totalExecutions: 0,
        averageExecutionTime: 0
      }
    };

    this.agents.set(agentId, agent);
    this.emit('agentCreated', { agentId, agent });
    return agentId;
  }

  async processWithAgent(agentId, input, options = {}) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    const startTime = Date.now();
    agent.context.history.push({
      type: 'user_input',
      content: input,
      timestamp: new Date()
    });

    try {
      const prompt = this.buildAgentPrompt(agent, input, options);
      const response = await this.model.generateContent([{ text: prompt }]);
      const responseText = response.response.text();
      
      const parsedResponse = this.parseAgentResponse(responseText);
      
      agent.context.history.push({
        type: 'agent_response',
        content: parsedResponse.response,
        timestamp: new Date(),
        metadata: {
          functionCalls: parsedResponse.functionCalls,
          confidence: parsedResponse.confidence
        }
      });

      const executionTime = Date.now() - startTime;
      this.updateAgentPerformance(agent, true, executionTime);

      this.emit('agentResponse', { agentId, response: parsedResponse.response });
      
      return {
        success: true,
        response: parsedResponse.response,
        functionCalls: parsedResponse.functionCalls || [],
        confidence: parsedResponse.confidence || 0.8,
        executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.updateAgentPerformance(agent, false, executionTime);
      
      agent.context.history.push({
        type: 'error',
        content: error.message,
        timestamp: new Date()
      });

      throw error;
    }
  }

  buildAgentPrompt(agent, input, options) {
    const capabilitiesList = agent.capabilities
      .map(cap => `- ${cap}`)
      .join('\n');

    const historyContext = agent.context.history.slice(-5)
      .map(h => `${h.type}: ${h.content}`)
      .join('\n');

    return `You are ${agent.name}, an AI agent specialized in ${agent.description}.

CAPABILITIES:
${capabilitiesList}

CONTEXT:
- Session ID: ${agent.context.sessionId}
- Network: ${agent.context.network}
- Wallet: ${agent.context.walletAddress || 'Not specified'}
- User ID: ${agent.context.userId || 'Not specified'}

RECENT HISTORY:
${historyContext || 'No previous interactions'}

USER INPUT: ${input}

INSTRUCTIONS:
1. Respond as ${agent.name} with expertise in ${agent.description}
2. Use your capabilities: ${agent.capabilities.join(', ')}
3. Provide helpful and accurate responses
4. If you need to perform actions, specify them clearly
5. Always consider the current context and user's needs

RESPONSE FORMAT:
Respond with a JSON object containing:
{
  "response": "Your response to the user",
  "reasoning": "Your reasoning process",
  "confidence": 0.95,
  "functionCalls": [
    {
      "name": "capability_name",
      "parameters": { "param1": "value1" }
    }
  ]
}

If no function calls are needed, set "functionCalls" to an empty array.`;
  }

  parseAgentResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        response: response,
        reasoning: 'AI-generated response',
        confidence: 0.7,
        functionCalls: []
      };
    } catch (error) {
      return {
        response: response,
        reasoning: 'AI-generated response (parsing failed)',
        confidence: 0.5,
        functionCalls: []
      };
    }
  }

  updateAgentPerformance(agent, success, executionTime) {
    agent.performance.totalExecutions++;
    agent.performance.averageExecutionTime = 
      (agent.performance.averageExecutionTime * (agent.performance.totalExecutions - 1) + executionTime) / 
      agent.performance.totalExecutions;
    
    if (success) {
      const currentSuccessRate = agent.performance.successRate;
      const totalExecutions = agent.performance.totalExecutions;
      agent.performance.successRate = 
        (currentSuccessRate * (totalExecutions - 1) + 1) / totalExecutions;
    } else {
      const currentSuccessRate = agent.performance.successRate;
      const totalExecutions = agent.performance.totalExecutions;
      agent.performance.successRate = 
        (currentSuccessRate * (totalExecutions - 1) + 0) / totalExecutions;
    }
  }

  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  getAllAgents() {
    return Array.from(this.agents.values());
  }

  getAgentTypes() {
    return Array.from(this.agentTypes.values());
  }

  deleteAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.agents.delete(agentId);
      this.emit('agentDeleted', { agentId, agent });
      return true;
    }
    return false;
  }

  getAgentHistory(agentId) {
    const agent = this.agents.get(agentId);
    return agent ? agent.context.history : [];
  }

  clearAgentHistory(agentId) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.context.history = [];
      return true;
    }
    return false;
  }
}

export default AIAgentSystem;
