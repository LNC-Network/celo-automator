'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Stop, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Settings,
  FileText,
  Zap
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  body?: string;
  expectedStatus: number;
  expectedResponse?: string;
  timeout: number;
}

interface TestResult {
  id: string;
  testName: string;
  success: boolean;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: unknown;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
    duration: number;
  };
  timestamp: string;
}

interface TestCollection {
  id: string;
  name: string;
  description: string;
  tests: TestCase[];
  createdAt: string;
  updatedAt: string;
}

export default function TestingPage() {
  const [collections, setCollections] = useState<TestCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [newTest, setNewTest] = useState<Partial<TestCase>>({
    method: 'GET',
    url: '',
    headers: {},
    expectedStatus: 200,
    timeout: 30000
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const response = await fetch('/api/testing/collections');
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  const createCollection = async () => {
    const name = prompt('Enter collection name:');
    if (!name) return;

    try {
      const response = await fetch('/api/testing/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: 'New test collection',
          tests: []
        })
      });

      if (response.ok) {
        await loadCollections();
      }
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const addTest = async () => {
    if (!selectedCollection || !newTest.name || !newTest.url) return;

    const test: TestCase = {
      id: `test_${Date.now()}`,
      name: newTest.name!,
      method: newTest.method!,
      url: newTest.url!,
      headers: newTest.headers || {},
      body: newTest.body,
      expectedStatus: newTest.expectedStatus!,
      expectedResponse: newTest.expectedResponse,
      timeout: newTest.timeout!
    };

    try {
      const response = await fetch(`/api/testing/collections/${selectedCollection}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      });

      if (response.ok) {
        await loadCollections();
        setNewTest({
          method: 'GET',
          url: '',
          headers: {},
          expectedStatus: 200,
          timeout: 30000
        });
      }
    } catch (error) {
      console.error('Failed to add test:', error);
    }
  };

  const runTests = async () => {
    if (!selectedCollection) return;

    setIsRunning(true);
    setTestResults([]);

    try {
      const response = await fetch(`/api/testing/collections/${selectedCollection}/run`, {
        method: 'POST'
      });

      const data = await response.json();
      setTestResults(data.results || []);
    } catch (error) {
      console.error('Failed to run tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runSingleTest = async (testId: string) => {
    if (!selectedCollection) return;

    setCurrentTest(testId);
    setIsRunning(true);

    try {
      const response = await fetch(`/api/testing/collections/${selectedCollection}/tests/${testId}/run`, {
        method: 'POST'
      });

      const data = await response.json();
      
      // Update test results
      setTestResults(prev => {
        const filtered = prev.filter(r => r.id !== testId);
        return [...filtered, data.result];
      });
    } catch (error) {
      console.error('Failed to run test:', error);
    } finally {
      setCurrentTest('');
      setIsRunning(false);
    }
  };

  const deleteTest = async (testId: string) => {
    if (!selectedCollection) return;

    try {
      const response = await fetch(`/api/testing/collections/${selectedCollection}/tests/${testId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadCollections();
      }
    } catch (error) {
      console.error('Failed to delete test:', error);
    }
  };

  const exportResults = () => {
    const data = {
      collection: collections.find(c => c.id === selectedCollection),
      results: testResults,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const selectedCollectionData = collections.find(c => c.id === selectedCollection);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Testing</h1>
          <p className="text-muted-foreground">
            Create and run API tests with Postman integration
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={createCollection} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
          <Button onClick={exportResults} variant="outline" disabled={testResults.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      <Tabs defaultValue="collections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card key={collection.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <Badge variant="outline">
                      {collection.tests.length} tests
                    </Badge>
                  </div>
                  <CardDescription>{collection.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(collection.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Updated: {new Date(collection.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedCollection(collection.id)}
                        className="flex-1"
                      >
                        Select
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => runTests()}
                        disabled={isRunning}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          {selectedCollectionData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Test</CardTitle>
                    <CardDescription>
                      Create a new test case for this collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="testName">Test Name</Label>
                      <Input
                        id="testName"
                        value={newTest.name || ''}
                        onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                        placeholder="Enter test name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="method">Method</Label>
                        <Select 
                          value={newTest.method} 
                          onValueChange={(value: any) => setNewTest({ ...newTest, method: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="expectedStatus">Expected Status</Label>
                        <Input
                          id="expectedStatus"
                          type="number"
                          value={newTest.expectedStatus || 200}
                          onChange={(e) => setNewTest({ ...newTest, expectedStatus: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        value={newTest.url || ''}
                        onChange={(e) => setNewTest({ ...newTest, url: e.target.value })}
                        placeholder="https://api.example.com/endpoint"
                      />
                    </div>

                    <div>
                      <Label htmlFor="headers">Headers (JSON)</Label>
                      <Textarea
                        id="headers"
                        value={JSON.stringify(newTest.headers, null, 2)}
                        onChange={(e) => {
                          try {
                            setNewTest({ ...newTest, headers: JSON.parse(e.target.value) });
                          } catch {
                            // Invalid JSON, ignore
                          }
                        }}
                        placeholder='{"Content-Type": "application/json"}'
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="body">Request Body (JSON)</Label>
                      <Textarea
                        id="body"
                        value={newTest.body || ''}
                        onChange={(e) => setNewTest({ ...newTest, body: e.target.value })}
                        placeholder='{"key": "value"}'
                        rows={3}
                      />
                    </div>

                    <Button onClick={addTest} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Test
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Test Cases</h3>
                  <Button 
                    onClick={runTests} 
                    disabled={isRunning || selectedCollectionData.tests.length === 0}
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run All
                  </Button>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {selectedCollectionData.tests.map((test) => (
                      <Card key={test.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{test.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {test.method} {test.url}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {test.expectedStatus}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => runSingleTest(test.id)}
                              disabled={isRunning && currentTest === test.id}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteTest(test.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Collection Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a collection from the Collections tab to manage tests
                  </p>
                  <Button onClick={() => setSelectedCollection('')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Collection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>
                    View and analyze test execution results
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {testResults.length} tests
                  </Badge>
                  <Badge variant={testResults.every(r => r.success) ? 'default' : 'destructive'}>
                    {testResults.filter(r => r.success).length} passed
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Test Results</h3>
                  <p className="text-muted-foreground">
                    Run some tests to see results here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <Card key={result.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <span className="font-medium">{result.testName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {result.duration}ms
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Request:</span>
                          <div className="font-mono">
                            {result.request.method} {result.request.url}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Response:</span>
                          <div className="font-mono">
                            {result.response.status} {result.response.duration}ms
                          </div>
                        </div>
                      </div>

                      {result.error && (
                        <Alert className="mt-4">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            {result.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="mt-4 text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testing Configuration</CardTitle>
              <CardDescription>
                Configure testing settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Default Timeout</Label>
                <div className="text-sm text-muted-foreground">
                  Currently set to 30 seconds
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Postman Integration</Label>
                <div className="text-sm text-muted-foreground">
                  Connected to Postman API
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Auto-save Results</Label>
                <div className="text-sm text-muted-foreground">
                  Enabled - Results are automatically saved
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
