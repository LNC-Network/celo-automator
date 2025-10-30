export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCount: Map<string, number> = new Map();

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: unknown, context?: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorKey = context || 'unknown';
    
    const currentCount = this.errorCount.get(errorKey) || 0;
    this.errorCount.set(errorKey, currentCount + 1);
    
    console.error(`[${errorKey}] ${errorMessage}`);
    
  }

  getErrorCount(context?: string): number {
    if (context) {
      return this.errorCount.get(context) || 0;
    }
    
    return Array.from(this.errorCount.values()).reduce((sum, count) => sum + count, 0);
  }

  resetErrorCount(context?: string): void {
    if (context) {
      this.errorCount.delete(context);
    } else {
      this.errorCount.clear();
    }
  }
}
