import { EventEmitter } from 'events';

export class AgentOrchestrator extends EventEmitter {
  constructor(mcpServer, automationSystem) {
    super();
    this.mcpServer = mcpServer;
    this.automationSystem = automationSystem;
    this.plans = new Map();
    this.activePlans = new Map();
    this.planQueue = [];
    this.isRunning = false;
  }

  async createOrchestrationPlan(name, description, prompt) {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const plan = {
      id: planId,
      name,
      description,
      prompt,
      status: 'created',
      createdAt: new Date(),
      agents: [],
      tasks: [],
      result: null
    };

    this.plans.set(planId, plan);
    return plan;
  }

  async executePlan(planId) {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    plan.status = 'executing';
    plan.startedAt = new Date();
    this.activePlans.set(planId, plan);

    try {
      const result = await this.automationSystem.processNaturalLanguage(
        plan.prompt,
        { sessionId: planId, planMode: true }
      );

      plan.status = 'completed';
      plan.completedAt = new Date();
      plan.result = result;

      this.activePlans.delete(planId);
      return result;
    } catch (error) {
      plan.status = 'failed';
      plan.completedAt = new Date();
      plan.error = error.message;
      this.activePlans.delete(planId);
      throw error;
    }
  }

  getPlans() {
    return Array.from(this.plans.values());
  }

  getActivePlans() {
    return Array.from(this.activePlans.values());
  }

  async stop() {
    this.isRunning = false;
    this.activePlans.clear();
  }
}

export default AgentOrchestrator;

