# 📋 Task Manager App

Una aplicación moderna de gestión de tareas desarrollada con Angular 19, que implementa un patrón de arquitectura limpia con componentes inteligentes y presentacionales, integración completa con API REST y una experiencia de usuario premium.

![Angular](https://img.shields.io/badge/Angular-19.2.17-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=for-the-badge&logo=bootstrap)
![RxJS](https://img.shields.io/badge/RxJS-7.8-yellow?style=for-the-badge&logo=reactivex)

## 🌟 Características Principales

### ✨ Funcionalidades
- **CRUD Completo de Tareas**: Crear, leer, actualizar y eliminar tareas
- **Toggle de Estado**: Marcar tareas como completadas/pendientes
- **Filtros Avanzados**: Filtrar por estado (todas, pendientes, completadas)
- **Búsqueda en Tiempo Real**: Buscar tareas por título o descripción
- **Confirmaciones Elegantes**: Diálogos de confirmación con SweetAlert2
- **Notificaciones Toast**: Feedback visual para todas las operaciones
- **Spinners Animados**: Indicadores de carga elegantes y profesionales
- **Responsive Design**: Funciona perfecto en móviles, tablets y desktop

### 🏗️ Arquitectura
- **Patrón Smart/Presentational**: Separación clara entre lógica y presentación
- **Arquitectura por Capas**:
  - **UI Layer**: Componentes Angular con templates y estilos
  - **Business Layer**: Lógica de negocio y orquestación
  - **HTTP Layer**: Comunicación con API REST
  - **Models & DTOs**: Tipado fuerte con TypeScript
- **Standalone Components**: Arquitectura moderna de Angular 19
- **Reactive Programming**: RxJS para manejo de estados asíncronos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 19.2.17** - Framework principal
- **TypeScript 5.6** - Lenguaje de programación tipado
- **RxJS 7.8** - Programación reactiva
- **Bootstrap 5.3** - Framework CSS y componentes UI
- **Bootstrap Icons** - Iconografía moderna
- **SweetAlert2** - Notificaciones y diálogos elegantes

### Herramientas de Desarrollo
- **Angular CLI 19.2.17** - Herramienta de línea de comandos
- **Vite** - Bundler rápido para desarrollo
- **ESBuild** - Compilador ultrarrápido
- **Hot Module Replacement (HMR)** - Recarga en caliente

### Arquitectura de API
- **RESTful API** - Endpoints estándar
- **DTOs (Data Transfer Objects)** - Mapeo de datos
- **Environment Management** - Configuración por ambientes
- **HTTP Interceptors** - Manejo centralizado de requests

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios principales
│   │   └── services/
│   │       └── notification.service.ts
│   ├── shared/                  # Componentes compartidos
│   ├── tasks/                   # Módulo de tareas
│   │   ├── business/           # Capa de negocio
│   │   │   └── task-business.service.ts
│   │   ├── components/         # Componentes UI
│   │   │   ├── smart/         # Componentes inteligentes
│   │   │   │   ├── task-list-container.component.ts
│   │   │   │   ├── task-create-container.component.ts
│   │   │   │   └── task-edit-container.component.ts
│   │   │   └── presentational/ # Componentes presentacionales
│   │   │       ├── task-list.component.ts
│   │   │       ├── task-card.component.ts
│   │   │       ├── task-form.component.ts
│   │   │       └── task-filter.component.ts
│   │   ├── dtos/              # Data Transfer Objects
│   │   ├── models/            # Modelos TypeScript
│   │   └── services/          # Servicios HTTP
│   │       └── task-http.service.ts
│   ├── environments/          # Configuración por ambiente
│   └── assets/               # Recursos estáticos
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** 18 o superior
- **npm** 9 o superior
- **Angular CLI** 19 o superior

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jlopezinfodoc/task-manager-app.git
cd task-manager-app
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno

#### Desarrollo
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001' // URL de tu API local
};
```

#### Producción
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://localhost:7001' // URL de tu API de producción
};
```

### 4. Ejecutar en Desarrollo
```bash
ng serve
```
La aplicación estará disponible en `http://localhost:4200`

## 🏗️ Scripts Disponibles

### Desarrollo
```bash
# Servidor de desarrollo con HMR
ng serve

# Servidor en puerto específico
ng serve --port 4200

# Servidor con configuración específica
ng serve --configuration development
```

### Build y Compilación
```bash
# Build de desarrollo
ng build

# Build de producción
ng build --configuration production

# Build con análisis de bundle
ng build --stats-json
```

### Testing
```bash
# Tests unitarios
ng test

# Tests con coverage
ng test --code-coverage

# Tests e2e
ng e2e
```

### Linting y Formato
```bash
# Ejecutar linter
ng lint

# Formatear código
npm run format
```

## 📦 Despliegue

### 1. Build de Producción
```bash
ng build --configuration production
```

### 2. Despliegue en Nginx
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/task-manager-app/dist/task-manager-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Despliegue en Azure Static Web Apps
```bash
# Instalar Azure CLI
npm install -g @azure/static-web-apps-cli

# Desplegar
swa deploy --app-location "." --output-location "dist/task-manager-app"
```

### 4. Despliegue en Netlify
```bash
# Build y despliegue
npm run build
# Subir carpeta dist/task-manager-app a Netlify
```

## 🔧 Configuración de API

### Endpoints Esperados
```
GET    /api/tasks           # Obtener todas las tareas
GET    /api/tasks/{id}      # Obtener tarea específica
POST   /api/tasks           # Crear nueva tarea
PUT    /api/tasks/{id}      # Actualizar tarea
DELETE /api/tasks/{id}      # Eliminar tarea
PUT    /api/tasks/{id}/complete # Marcar como completada
```

### Formato de DTOs
```typescript
// Request - Crear Tarea
interface CreateTaskRequestDTO {
  title: string;
  description?: string;
}

// Request - Actualizar Tarea
interface UpdateTaskRequestDTO {
  title: string;
  description?: string;
  isCompleted: boolean;
}

// Response - Tarea
interface TaskResponseDTO {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Características de UX/UI

### Diseño Visual
- **Material Design Inspired**: Diseño moderno y limpio
- **Color Palette**: Colores Bootstrap con personalizaciones
- **Typography**: Fuentes optimizadas para legibilidad
- **Spacing**: Sistema de espaciado consistente
- **Shadows & Gradients**: Efectos visuales sutiles

### Experiencia de Usuario
- **Loading States**: Spinners elegantes con delays de 300ms
- **Error Handling**: Mensajes de error claros y útiles
- **Success Feedback**: Notificaciones toast no intrusivas
- **Confirmation Dialogs**: Confirmaciones elegantes con SweetAlert2
- **Responsive Breakpoints**: Optimizado para todos los dispositivos

### Animaciones y Transiciones
- **Spinner Animations**: Múltiples spinners con delays secuenciales
- **Card Hover Effects**: Efectos sutiles en tarjetas de tareas
- **Button States**: Estados visuales para botones interactivos
- **Form Validation**: Feedback visual inmediato

## 🔒 Características de Seguridad

- **TypeScript Strict Mode**: Tipado fuerte para prevenir errores
- **Input Validation**: Validación client-side con Angular Forms
- **XSS Protection**: Sanitización automática de Angular
- **CSRF Protection**: Tokens incluidos en requests HTTP
- **Environment Variables**: Configuración segura por ambiente

## 📊 Performance y Optimización

### Técnicas Implementadas
- **Lazy Loading**: Carga bajo demanda de módulos
- **OnPush Change Detection**: Optimización de detección de cambios
- **TrackBy Functions**: Optimización de ngFor loops
- **Bundle Splitting**: Separación inteligente de código
- **Tree Shaking**: Eliminación de código no utilizado

### Métricas de Performance
- **Bundle Size**: ~593KB (initial) con lazy chunks optimizados
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Lighthouse Score**: 90+ en todas las métricas

## 🤝 Contribución

### Setup para Desarrollo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commits con mensajes descriptivos
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **ESLint**: Reglas de linting configuradas
- **Prettier**: Formateo automático de código
- **Conventional Commits**: Formato estándar de commits
- **TypeScript Strict**: Tipado estricto habilitado

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autor

**José López** - *Desarrollo Full-Stack* - [@jlopezinfodoc](https://github.com/jlopezinfodoc)

## 🙏 Agradecimientos

- Angular Team por el excelente framework
- Bootstrap Team por los componentes UI
- SweetAlert2 por las notificaciones elegantes  
- RxJS Team por la programación reactiva

---

⭐ **¡Dale una estrella al proyecto si te ha sido útil!** ⭐
