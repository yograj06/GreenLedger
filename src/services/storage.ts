// Storage service with versioning for localStorage persistence

export interface StorageData {
  version: string;
  timestamp: number;
  data: any;
}

class StorageService {
  private readonly VERSION = '1.0.0';
  private readonly STORAGE_KEY = 'greenledger_odisha';

  save(data: any): void {
    const storageData: StorageData = {
      version: this.VERSION,
      timestamp: Date.now(),
      data
    };
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  load(): any | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const storageData: StorageData = JSON.parse(stored);
      
      // Version compatibility check
      if (storageData.version !== this.VERSION) {
        console.warn('Storage version mismatch, resetting data');
        this.clear();
        return null;
      }

      return storageData.data;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  getStorageInfo(): { version: string; timestamp: number } | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const storageData: StorageData = JSON.parse(stored);
      return {
        version: storageData.version,
        timestamp: storageData.timestamp
      };
    } catch (error) {
      return null;
    }
  }
}

export default new StorageService();