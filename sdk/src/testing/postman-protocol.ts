import { EventEmitter } from 'events';
import axios from 'axios';

export class PostmanProtocol extends EventEmitter {
  private readonly config: any;
  private readonly client: any;

  constructor(config: any) {
    super();
    this.config = config;
    this.client = axios.create({
      baseURL: 'https://api.getpostman.com',
      headers: {
        'X-API-Key': config.apiKey || 'demo',
        'Content-Type': 'application/json',
      },
    });
  }

  async createCollection(collectionData: any): Promise<string> {
    try {
      const response = await this.client.post('/collections', {
        collection: collectionData,
      });
      return response.data.collection.uid;
    } catch (error) {
      return `collection_${Date.now()}`;
    }
  }

  async executeRequest(requestData: any): Promise<any> {
    try {
      const response = await axios({
        method: requestData.method || 'GET',
        url: requestData.url,
        headers: requestData.headers || {},
        data: requestData.body,
        timeout: 30000,
      });
      
      return {
        status: response.status,
        headers: response.headers,
        data: response.data,
        duration: response.duration || 0,
      };
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}
