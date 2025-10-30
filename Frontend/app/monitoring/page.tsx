'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Server, 
  Database,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';

interface SystemMetrics {
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  platform: string;
  arch: string;
  nodeVersion: string;
  pid: number;
  timestamp: string;
}

interface ApplicationMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    rate: number;
  };
  errors: {
    total: number;
    rate: number;
    lastError?: string;
  };
  activeConnections: number;
  timestamp: string;
}

interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  latency: number;
  timestamp: string;
}

interface Alert {
  id: string;
  name: string;
  severity: 'warning' | 'critical' | 'info';
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  message: string;
}

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  pid: number;
}

export default function MonitoringPage() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [appMetrics, setAppMetrics] = useState<ApplicationMetrics | null>(null);
  const [perfMetrics, setPerfMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(loadMetrics, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadMetrics = async () => {
    try {
      const [systemRes, appRes, perfRes, alertsRes, logsRes] = await Promise.all([
        fetch('/api/monitoring/system'),
        fetch('/api/monitoring/application'),
        fetch('/api/monitoring/performance'),
        fetch('/api/monitoring/alerts'),
        fetch('/api/monitoring/logs')
      ]);

      const [systemData, appData, perfData, alertsData, logsData] = await Promise.all([
        systemRes.json(),
        appRes.json(),
        perfRes.json(),
        alertsRes.json(),
        logsRes.json()
      ]);

      setSystemMetrics(systemData);
      setAppMetrics(appData);
      setPerfMetrics(perfData);
      setAlerts(alertsData.alerts || []);
      setLogs(logsData.logs || []);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshMetrics = () => {
    setIsRefreshing(true);
    loadMetrics();
  };

  const getHealthStatus = () => {
    if (!systemMetrics || !appMetrics) return 'unknown';
    
    const criticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical');
    if (criticalAlerts.length > 0) return 'critical';
    
    if (systemMetrics.memory.percentage > 90 || systemMetrics.cpu.usage > 90) return 'critical';
    
    const warningAlerts = alerts.filter(a => !a.resolved && a.severity === 'warning');
    if (warningAlerts.length > 0) return 'warning';
    
    return 'healthy';
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warn':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      case 'debug':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and health metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? 'text-green-500' : 'text-gray-400'}`} />
            Auto Refresh
          </Button>
          <Button 
            onClick={refreshMetrics} 
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status Banner */}
      <Alert className={getHealthColor(healthStatus)}>
        <div className="flex items-center space-x-2">
          {getHealthIcon(healthStatus)}
          <AlertDescription>
            <strong>System Status:</strong> {healthStatus.toUpperCase()}
            {alerts.filter(a => !a.resolved).length > 0 && (
              <span className="ml-2">
                • {alerts.filter(a => !a.resolved).length} active alerts
              </span>
            )}
          </AlertDescription>
        </div>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                {getHealthIcon(healthStatus)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{healthStatus}</div>
                <p className="text-xs text-muted-foreground">
                  Overall system status
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemMetrics ? formatUptime(systemMetrics.uptime) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  System uptime
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemMetrics ? `${systemMetrics.memory.percentage.toFixed(1)}%` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {systemMetrics ? formatBytes(systemMetrics.memory.used) : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemMetrics ? `${systemMetrics.cpu.usage.toFixed(1)}%` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {systemMetrics ? `${systemMetrics.cpu.cores} cores` : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>
                  Current memory consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                {systemMetrics ? (
                  <div className="space-y-4">
                    <Progress value={systemMetrics.memory.percentage} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Used: {formatBytes(systemMetrics.memory.used)}</span>
                      <span>Total: {formatBytes(systemMetrics.memory.total)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading memory data...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Metrics</CardTitle>
                <CardDescription>
                  Application request statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appMetrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Requests:</span>
                        <div className="font-medium">{appMetrics.requests.total}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <div className="font-medium">
                          {appMetrics.requests.total > 0 
                            ? `${Math.round((appMetrics.requests.successful / appMetrics.requests.total) * 100)}%`
                            : 'N/A'
                          }
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Failed:</span>
                        <div className="font-medium text-red-600">{appMetrics.requests.failed}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rate:</span>
                        <div className="font-medium">{appMetrics.requests.rate}/min</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading request data...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Detailed system metrics and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {systemMetrics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Platform</Label>
                      <div className="text-sm text-muted-foreground">
                        {systemMetrics.platform} ({systemMetrics.arch})
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Node.js Version</Label>
                      <div className="text-sm text-muted-foreground">
                        {systemMetrics.nodeVersion}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Process ID</Label>
                      <div className="text-sm text-muted-foreground">
                        {systemMetrics.pid}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">CPU Cores</Label>
                      <div className="text-sm text-muted-foreground">
                        {systemMetrics.cpu.cores} cores
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Memory Total</Label>
                      <div className="text-sm text-muted-foreground">
                        {formatBytes(systemMetrics.memory.total)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Updated</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(systemMetrics.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Loading system metrics...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Metrics</CardTitle>
              <CardDescription>
                Application performance and usage metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appMetrics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {appMetrics.requests.successful}
                      </div>
                      <div className="text-sm text-muted-foreground">Successful Requests</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {appMetrics.requests.failed}
                      </div>
                      <div className="text-sm text-muted-foreground">Failed Requests</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {appMetrics.activeConnections}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Connections</div>
                    </div>
                  </div>
                  
                  {perfMetrics && (
                    <div className="space-y-4">
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium">Performance Metrics</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Response Time:</span>
                            <div className="font-medium">{perfMetrics.responseTime}ms</div>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Throughput:</span>
                            <div className="font-medium">{perfMetrics.throughput} req/s</div>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Latency:</span>
                            <div className="font-medium">{perfMetrics.latency}ms</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Loading application metrics...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>
                    Active and resolved system alerts
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {alerts.filter(a => !a.resolved).length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
                    <p>System is running smoothly with no active alerts</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {alert.severity === 'critical' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : alert.severity === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="font-medium">{alert.name}</span>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {alert.resolved ? 'Resolved' : 'Active'} since{' '}
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        {alert.resolved && alert.resolvedAt && (
                          <span>
                            Resolved at {new Date(alert.resolvedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                Recent system logs and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {logs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Logs</h3>
                      <p>No recent log entries found</p>
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <Badge className={getLogLevelColor(log.level)}>
                              {log.level.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              PID: {log.pid}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-mono">{log.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
