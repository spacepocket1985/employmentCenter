import fs from 'fs/promises';
import path from 'path';

class RouteMapsService {
  private readonly configPath: string;
  private cachedMaps: string[] | null = null;
  private lastLoadTime: number = 0;
  private readonly cacheTTL: number = 5000; // 5 секунд кеш

  constructor() {
    this.configPath = path.join(process.cwd(), 'src', 'config', 'routeMaps.json');
  }

  async getAvailableMaps(): Promise<string[]> {
    // Проверяем кеш
    const now = Date.now();
    if (this.cachedMaps && (now - this.lastLoadTime) < this.cacheTTL) {
      return this.cachedMaps;
    }

    try {
      const fileContent = await fs.readFile(this.configPath, 'utf-8');
      const data = JSON.parse(fileContent) as { maps: string[] };
      
      this.cachedMaps = data.maps || [];
      this.lastLoadTime = now;
      
      return this.cachedMaps;
    } catch (error) {
      console.error('Failed to load route maps config:', error);
      return [];
    }
  }

  async reloadMaps(): Promise<string[]> {
    // Принудительная перезагрузка (сбрасываем кеш)
    this.cachedMaps = null;
    return this.getAvailableMaps();
  }
}

export const routeMapsService = new RouteMapsService();