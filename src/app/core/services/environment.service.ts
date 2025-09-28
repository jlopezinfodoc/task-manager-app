import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly env: AppEnvironment = environment;

  constructor() {
    this.logEnvironmentInfo();
  }

  /**
   * Obtiene la URL base de la API
   */
  get apiUrl(): string {
    return this.env.apiUrl;
  }

  /**
   * Obtiene el nombre de la aplicación
   */
  get appName(): string {
    return this.env.appName;
  }

  /**
   * Obtiene la versión de la aplicación
   */
  get version(): string {
    return this.env.version;
  }

  /**
   * Verifica si estamos en modo producción
   */
  get isProduction(): boolean {
    return this.env.production;
  }

  /**
   * Obtiene el nivel de log configurado
   */
  get logLevel(): string {
    return this.env.logLevel;
  }

  /**
   * Obtiene toda la configuración del environment
   */
  get environment(): AppEnvironment {
    return { ...this.env };
  }

  /**
   * Construye una URL completa de la API
   */
  buildApiUrl(endpoint: string): string {
    // Remover barra inicial si existe
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

    // Asegurar que la URL base no termine con barra
    const baseUrl = this.env.apiUrl.endsWith('/')
      ? this.env.apiUrl.slice(0, -1)
      : this.env.apiUrl;

    return `${baseUrl}/${cleanEndpoint}`;
  }

  /**
   * Verifica si el logging está habilitado para un nivel específico
   */
  shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.env.logLevel);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
  }

  /**
   * Log condicional basado en el nivel de environment
   */
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
    if (this.shouldLog(level)) {
      switch (level) {
        case 'debug':
          console.debug(`[${this.env.appName}] ${message}`, ...args);
          break;
        case 'info':
          console.info(`[${this.env.appName}] ${message}`, ...args);
          break;
        case 'warn':
          console.warn(`[${this.env.appName}] ${message}`, ...args);
          break;
        case 'error':
          console.error(`[${this.env.appName}] ${message}`, ...args);
          break;
      }
    }
  }

  /**
   * Log información del environment al inicializar
   */
  private logEnvironmentInfo(): void {
    this.log('info', 'Environment loaded', {
      production: this.env.production,
      apiUrl: this.env.apiUrl,
      version: this.env.version,
      logLevel: this.env.logLevel
    });
  }
}
