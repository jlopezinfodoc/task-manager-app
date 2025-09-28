# Integración Frontend-Backend - Task Management

## Resumen de Cambios Realizados

### 1. DTOs Actualizados

**Request DTOs (`task-request.dto.ts`)**:
- `CreateTaskRequestDTO`: Solo `title` (requerido) y `description` (opcional)
- `UpdateTaskRequestDTO`: `title`, `description` e `isCompleted`
- `CompleteTaskRequestDTO`: Vacío (solo usa el ID en la URL)
- `TaskFilterRequestDTO`: Nuevo DTO para filtros con paginación

**Response DTOs (`task-response.dto.ts`)**:
- `ApiResponse<T>`: Wrapper genérico para todas las respuestas del API
- `TaskResponseDTO`: Actualizado con `isCompleted`, `createdDate`, `completedDate`
- `CreateTaskResponseDTO`: Para respuestas de creación
- Tipos específicos: `TaskApiResponse`, `TaskListApiResponse`, etc.

### 2. TaskHttpService Actualizado

**Endpoints según documentación**:
- `GET /api/tasks` - Con filtros opcionales (isCompleted, title, fechas, paginación)
- `GET /api/tasks/{id}` - Obtener tarea específica
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/{id}` - Actualizar tarea completa
- `PATCH /api/tasks/{id}/complete` - Marcar como completada
- `DELETE /api/tasks/{id}` - Eliminar tarea

**Manejo de respuestas ApiResponse<T>**:
- Todas las respuestas usan el wrapper `ApiResponse<T>`
- Manejo de errores integrado con `success` flag
- Logging automático con EnvironmentService

### 3. TaskBusinessService Mejorado

**Adaptación a nueva API**:
- Manejo de `ApiResponse<T>` wrapper
- Verificación de `success` flag
- Mapeo correcto de propiedades (`isCompleted`, `createdDate`)
- Método `completeTask` en lugar de `toggleTaskCompletion`

### 4. Nuevo Componente TaskFilterComponent

**Filtros disponibles**:
- Estado: Todas, Pendientes, Completadas
- Título: Búsqueda por texto
- Fechas: Desde y Hasta
- Paginación: Página y tamaño de página

**Características**:
- Auto-aplicación de filtros
- Conversión automática de fechas a ISO 8601
- Limpieza de filtros vacíos
- Interfaz Bootstrap responsive

### 5. Environments Actualizados

**URLs configuradas**:
- Development: `http://localhost:5001`
- Production: `https://localhost:7001`
- Staging: `https://localhost:7001`

## Cómo Usar la Integración

### 1. Iniciar el Backend

Asegúrate de que el backend esté corriendo en:
- HTTP: `http://localhost:5001`
- HTTPS: `https://localhost:7001`

### 2. Iniciar el Frontend

```bash
cd task-manager-app
ng serve --port 4200
```

### 3. Funcionalidades Disponibles

**Lista de Tareas**:
- Ver todas las tareas
- Filtrar por estado (completadas/pendientes)
- Buscar por título
- Filtrar por rango de fechas
- Marcar como completada (solo si no está completada)

**Crear Tarea**:
- Título obligatorio (máx. 200 caracteres)
- Descripción opcional (máx. 1000 caracteres)

**Editar Tarea**:
- Modificar título y descripción
- Cambiar estado de completado

**Eliminar Tarea**:
- Eliminación permanente

### 4. Arquitectura de la Integración

```
UI Components (Smart/Presentational)
        ↓
Business Layer (TaskBusinessService)
        ↓
HTTP Layer (TaskHttpService)
        ↓
API Endpoints (/api/tasks)
```

**Flujo de datos**:
1. UI llama a Business Layer
2. Business Layer llama a HTTP Service
3. HTTP Service hace petición al API
4. Respuesta se desenvuelve de ApiResponse<T>
5. DTO se mapea a modelo de UI
6. UI se actualiza

### 5. Manejo de Errores

**Niveles de error**:
- API Level: Códigos HTTP (400, 404, 409, 500)
- Business Level: Validación de success flag
- UI Level: Mensajes de error user-friendly

**Tipos de error según API**:
- 400: Datos inválidos
- 404: Tarea no encontrada
- 409: Tarea ya completada
- 500: Error interno del servidor

### 6. Configuración de Environment

**Para desarrollo**:
```bash
ng serve
# Usa environment.ts con http://localhost:5001
```

**Para producción**:
```bash
ng build --configuration=production
# Usa environment.prod.ts con https://localhost:7001
```

**Para staging**:
```bash
ng build --configuration=staging
# Usa environment.staging.ts con https://localhost:7001
```

## Testing de la Integración

### 1. Endpoints de Prueba

**Verificar funcionamiento**:
```
GET http://localhost:5001/api/test/success
```

**Probar manejo de errores**:
```
GET http://localhost:5001/api/test/exception/notfound
GET http://localhost:5001/api/test/exception/validation
```

### 2. Flujo Completo de Testing

1. **Crear tarea**: POST /api/tasks
2. **Listar tareas**: GET /api/tasks
3. **Filtrar tareas**: GET /api/tasks?isCompleted=false
4. **Obtener tarea**: GET /api/tasks/{id}
5. **Actualizar tarea**: PUT /api/tasks/{id}
6. **Completar tarea**: PATCH /api/tasks/{id}/complete
7. **Eliminar tarea**: DELETE /api/tasks/{id}

### 3. Verificar Filtros

**Por estado**:
```
GET /api/tasks?isCompleted=true
GET /api/tasks?isCompleted=false
```

**Por título**:
```
GET /api/tasks?title=estudiar
```

**Por fechas**:
```
GET /api/tasks?createdFrom=2025-09-01T00:00:00Z&createdTo=2025-09-30T23:59:59Z
```

**Con paginación**:
```
GET /api/tasks?pageNumber=1&pageSize=5
```

## Notas Importantes

1. **Fechas**: Todas las fechas se manejan en formato ISO 8601 UTC
2. **Completar tareas**: Solo se puede marcar como completada, no se puede "descompletar"
3. **Filtros**: Los filtros de la UI se combinan con los filtros del API
4. **Paginación**: Implementada en el API, lista para usar en el frontend
5. **CORS**: Asegúrate de que el backend permita requests desde localhost:4200

## Próximos Pasos

1. **Implementar paginación en UI**: Componente de paginación
2. **Notificaciones**: Toast messages para operaciones exitosas/error
3. **Loading states**: Mejores indicadores de carga
4. **Offline support**: Cache local con Service Workers
5. **Testing**: Unit tests y E2E tests
