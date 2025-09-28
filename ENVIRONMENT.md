# Environment Management

Este proyecto utiliza la gestión de environments de Angular para manejar diferentes configuraciones según el entorno de despliegue.

## Archivos de Environment

### `src/environments/environment.ts` (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://jsonplaceholder.typicode.com',
  appName: 'Task Manager - Development',
  version: '1.0.0-dev',
  logLevel: 'debug' as const
};
```

### `src/environments/environment.prod.ts` (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.taskmanager.com',
  appName: 'Task Manager',
  version: '1.0.0',
  logLevel: 'error' as const
};
```

### `src/environments/environment.staging.ts` (Staging)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://dev-api.taskmanager.com',
  appName: 'Task Manager - Staging',
  version: '1.0.0-staging',
  logLevel: 'info' as const
};
```

## Configuración en angular.json

El archivo `angular.json` está configurado con file replacements para cada environment:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  },
  "staging": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
}
```

## Comandos de Build

### Development (por defecto)
```bash
ng serve
ng build
```

### Production
```bash
ng serve --configuration=production
ng build --configuration=production
```

### Staging
```bash
ng serve --configuration=staging
ng build --configuration=staging
```

## EnvironmentService

Se ha creado un servicio `EnvironmentService` que proporciona acceso tipado a las variables de environment:

```typescript
import { EnvironmentService } from './core/services/environment.service';

constructor(private environmentService: EnvironmentService) {}

// Obtener URL de API
const apiUrl = this.environmentService.apiUrl;

// Construir URL completa
const fullUrl = this.environmentService.buildApiUrl('todos');

// Verificar si es producción
const isProduction = this.environmentService.isProduction;

// Log condicional basado en environment
this.environmentService.log('debug', 'Debug message');
```

## Interceptor HTTP

Se incluye un interceptor `ApiInterceptor` que:
- Agrega headers comunes a todas las requests
- Maneja logging basado en el nivel de environment
- Transforma errores HTTP para mejor UX

## Componente de Environment Info

El componente `EnvironmentInfoComponent` muestra información del environment actual (solo en desarrollo):
- Nombre y versión de la aplicación
- URL de la API
- Solo visible en entornos no productivos

## Variables de Environment Disponibles

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `production` | boolean | Indica si está en modo producción |
| `apiUrl` | string | URL base de la API |
| `appName` | string | Nombre de la aplicación |
| `version` | string | Versión de la aplicación |
| `logLevel` | 'debug' \| 'info' \| 'warn' \| 'error' | Nivel de logging |

## Uso en Servicios

El `TaskHttpService` utiliza automáticamente la URL de API del environment:

```typescript
constructor(
  private http: HttpClient,
  private environmentService: EnvironmentService
) { 
  this.baseUrl = this.environmentService.buildApiUrl('todos');
}
```

## Deployment

Para diferentes entornos de deployment:

1. **Development**: `ng build` (usa environment.ts)
2. **Staging**: `ng build --configuration=staging` (usa environment.staging.ts)
3. **Production**: `ng build --configuration=production` (usa environment.prod.ts)

Los archivos se reemplazan automáticamente durante el build process según la configuración especificada.
