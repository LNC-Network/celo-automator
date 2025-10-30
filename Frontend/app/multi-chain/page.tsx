'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import MetricCard from '@/components/ui/MetricCard';
import GradientCard from '@/components/ui/GradientCard';
import StatusIndicator from '@/components/ui/StatusIndicator';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { 
  Network, 
  Zap, 
  Shield, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Clock,
  Globe,
  Settings,
  BarChart3,
  Layers
} from 'lucide-react';

interface ChainInfo {
  id: string;
  name: string;
  chainId: number;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer?: string;
  isTestnet: boolean;
  priority: number;
  gasPriceMultiplier: number;
  maxGasPrice: string;
  minGasPrice: string;
}

interface ChainHealth {
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastChecked: string;
  responseTime?: number;
  errorCount: number;
  successCount: number;
  isHealthy: boolean;
}

export default function MultiChainPage() {
  const [chains, setChains] = useState<ChainInfo[]>([]);
  const [chainHealth, setChainHealth] = useState<Record<string, ChainHealth>>({});
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadChains();
    loadChainHealth();
  }, []);

  const loadChains = async () => {
    try {
      const response = await fetch('/api/chains');
      const data = await response.json();
      setChains(data.chains || []);
    } catch (error) {
      console.error('Failed to load chains:', error);
    }
  };

  const loadChainHealth = async () => {
    try {
      const response = await fetch('/api/chains/health');
      const data = await response.json();
      setChainHealth(data.chains || {});
    } catch (error) {
      console.error('Failed to load chain health:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHealth = async () => {
    setIsRefreshing(true);
    await loadChainHealth();
    setIsRefreshing(false);
  };

  const getHealthStatus = (chainId: string) => {
    const health = chainHealth[chainId];
    if (!health) return 'unknown';
    return health.isHealthy ? 'healthy' : 'unhealthy';
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'unhealthy':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatGasPrice = (price: string) => {
    const num = parseInt(price);
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)} Gwei`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} Mwei`;
    } else {
      return `${num} Wei`;
    }
  };

  const selectedChainInfo = chains.find(chain => chain.id === selectedChain);
  const selectedChainHealth = chainHealth[selectedChain];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Multi-Chain Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage multiple blockchain networks
          </p>
        </div>
        <Button 
          onClick={refreshHealth} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Health
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chains">Chain Details</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Hero Section */}
          <GradientCard gradient="blue" className="text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Multi-Chain Dashboard</h2>
                <p className="text-blue-100">
                  Monitor and manage blockchain networks across multiple chains
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  <AnimatedCounter value={chains.length} />
                </div>
                <p className="text-blue-100 text-sm">Active Networks</p>
              </div>
            </div>
          </GradientCard>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Chains"
              value={chains.length}
              icon={<Network className="h-4 w-4" />}
              status="online"
              description="Supported networks"
              change={5.2}
              changeType="positive"
            />

            <MetricCard
              title="Healthy Chains"
              value={Object.values(chainHealth).filter(h => h.isHealthy).length}
              icon={<CheckCircle className="h-4 w-4" />}
              status="online"
              description="Currently operational"
              change={2.1}
              changeType="positive"
            />

            <MetricCard
              title="Average Response"
              value={(() => {
                const healthyChains = Object.values(chainHealth).filter(h => h.isHealthy && h.responseTime);
                if (healthyChains.length === 0) return 0;
                const avg = healthyChains.reduce((sum, h) => sum + (h.responseTime || 0), 0) / healthyChains.length;
                return Math.round(avg);
              })()}
              icon={<Activity className="h-4 w-4" />}
              status="online"
              description="Response time"
              suffix="ms"
              change={-8.3}
              changeType="positive"
            />

            <MetricCard
              title="Uptime"
              value={98.7}
              icon={<TrendingUp className="h-4 w-4" />}
              status="online"
              description="System availability"
              suffix="%"
              change={0.5}
              changeType="positive"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Chain Status Overview</span>
              </CardTitle>
              <CardDescription>
                Real-time status of all supported blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chains.map((chain) => {
                  const health = getHealthStatus(chain.id);
                  const healthData = chainHealth[chain.id];
                  
                  return (
                    <div 
                      key={chain.id} 
                      className={`group flex items-center justify-between p-4 border rounded-xl transition-all duration-200 hover:shadow-md ${
                        selectedChain === chain.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {chain.name.charAt(0).toUpperCase()}
                          </div>
                          <StatusIndicator 
                            status={health === 'healthy' ? 'online' : health === 'unhealthy' ? 'error' : 'warning'}
                            size="sm"
                            className="absolute -top-1 -right-1"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{chain.name}</div>
                          <div className="text-sm text-gray-500">
                            Chain ID: {chain.chainId} • {chain.isTestnet ? 'Testnet' : 'Mainnet'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          {healthData?.responseTime && (
                            <div className="text-sm font-medium text-gray-900">
                              {healthData.responseTime}ms
                            </div>
                          )}
                          <Badge 
                            variant={health === 'healthy' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {health}
                          </Badge>
                        </div>
                        {chain.blockExplorer && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            asChild
                          >
                            <a href={chain.blockExplorer} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chains" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Select Chain</CardTitle>
                  <CardDescription>
                    Choose a chain to view detailed information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedChain} onValueChange={setSelectedChain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chain" />
                    </SelectTrigger>
                    <SelectContent>
                      {chains.map((chain) => (
                        <SelectItem key={chain.id} value={chain.id}>
                          <div className="flex items-center space-x-2">
                            {getHealthIcon(getHealthStatus(chain.id))}
                            <span>{chain.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedChainInfo && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          {getHealthIcon(getHealthStatus(selectedChain))}
                          <span>{selectedChainInfo.name}</span>
                        </CardTitle>
                        <CardDescription>
                          Chain ID: {selectedChainInfo.chainId} • {selectedChainInfo.isTestnet ? 'Testnet' : 'Mainnet'}
                        </CardDescription>
                      </div>
                      <Badge variant={getHealthStatus(selectedChain) === 'healthy' ? 'default' : 'destructive'}>
                        {getHealthStatus(selectedChain)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Native Currency</Label>
                        <div className="text-sm text-muted-foreground">
                          {selectedChainInfo.nativeCurrency.name} ({selectedChainInfo.nativeCurrency.symbol})
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Priority</Label>
                        <div className="text-sm text-muted-foreground">
                          {selectedChainInfo.priority}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium">Gas Price Range</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Min: {formatGasPrice(selectedChainInfo.minGasPrice)}</span>
                          <span>Max: {formatGasPrice(selectedChainInfo.maxGasPrice)}</span>
                        </div>
                        <Progress 
                          value={selectedChainInfo.gasPriceMultiplier * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          Multiplier: {selectedChainInfo.gasPriceMultiplier}x
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium">RPC Endpoints</Label>
                      <div className="mt-2 space-y-1">
                        {selectedChainInfo.rpcUrls.map((url, index) => (
                          <div key={index} className="text-sm text-muted-foreground font-mono">
                            {url}
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedChainHealth && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium">Health Status</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Last Checked:</span>
                              <span>{new Date(selectedChainHealth.lastChecked).toLocaleString()}</span>
                            </div>
                            {selectedChainHealth.responseTime && (
                              <div className="flex justify-between text-sm">
                                <span>Response Time:</span>
                                <span>{selectedChainHealth.responseTime}ms</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span>Success Count:</span>
                              <span className="text-green-600">{selectedChainHealth.successCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Error Count:</span>
                              <span className="text-red-600">{selectedChainHealth.errorCount}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Real-time Monitoring</span>
                  </CardTitle>
                  <CardDescription>
                    Monitor chain performance and health metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(chainHealth).map(([chainId, health]) => {
                      const chain = chains.find(c => c.id === chainId);
                      if (!chain) return null;

                      const successRate = health.successCount + health.errorCount > 0 
                        ? Math.round((health.successCount / (health.successCount + health.errorCount)) * 100)
                        : 0;

                      return (
                        <div key={chainId} className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {chain.name.charAt(0).toUpperCase()}
                                </div>
                                <StatusIndicator 
                                  status={health.isHealthy ? 'online' : 'error'}
                                  size="sm"
                                  className="absolute -top-1 -right-1"
                                />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900">{chain.name}</span>
                                <div className="text-sm text-gray-500">
                                  Chain ID: {chain.chainId}
                                </div>
                              </div>
                            </div>
                            <Badge variant={health.isHealthy ? 'default' : 'destructive'}>
                              {health.isHealthy ? 'Healthy' : 'Unhealthy'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {health.responseTime ? `${health.responseTime}ms` : 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">Response Time</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {successRate}%
                              </div>
                              <div className="text-sm text-gray-500">Success Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {new Date(health.lastChecked).toLocaleTimeString()}
                              </div>
                              <div className="text-sm text-gray-500">Last Check</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {health.successCount}
                              </div>
                              <div className="text-sm text-gray-500">Total Requests</div>
                            </div>
                          </div>

                          {/* Progress Bar for Success Rate */}
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Success Rate</span>
                              <span>{successRate}%</span>
                            </div>
                            <Progress value={successRate} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      <AnimatedCounter 
                        value={Object.values(chainHealth).filter(h => h.isHealthy).length} 
                      />
                    </div>
                    <div className="text-sm text-gray-500">Healthy Chains</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Chains</span>
                      <span className="font-medium">{chains.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Unhealthy</span>
                      <span className="font-medium text-red-600">
                        {Object.values(chainHealth).filter(h => !h.isHealthy).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Response</span>
                      <span className="font-medium">
                        {(() => {
                          const healthyChains = Object.values(chainHealth).filter(h => h.isHealthy && h.responseTime);
                          if (healthyChains.length === 0) return 'N/A';
                          const avg = healthyChains.reduce((sum, h) => sum + (h.responseTime || 0), 0) / healthyChains.length;
                          return `${Math.round(avg)}ms`;
                        })()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chain Configuration</CardTitle>
              <CardDescription>
                Configure chain settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Chain configuration is managed by the backend system. 
                  Contact your administrator to modify chain settings.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Default Chain</Label>
                  <Select value={selectedChain} onValueChange={setSelectedChain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default chain" />
                    </SelectTrigger>
                    <SelectContent>
                      {chains.map((chain) => (
                        <SelectItem key={chain.id} value={chain.id}>
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Health Check Interval</Label>
                  <div className="text-sm text-muted-foreground">
                    Currently set to 30 seconds
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Auto-failover</Label>
                  <div className="text-sm text-muted-foreground">
                    Enabled - Automatically switches to healthy chains
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
