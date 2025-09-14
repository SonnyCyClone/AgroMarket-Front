# 🌐 AgroMarket API Documentation

Esta documentación describe las APIs utilizadas por el frontend de AgroMarket y cómo interactuar con ellas.

## 📋 Información General

- **Base URL**: `https://localhost:7127/api`
- **Autenticación**: Bearer Token (JWT)
- **Formato**: JSON
- **Versionado**: v1

## 🔐 Autenticación

### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nombre": "Juan Pérez",
    "rol": "CLIENTE",
    "telefono": "+573001234567"
  }
}
```

### Registro
```http
POST /api/register
Content-Type: application/json

{
  "email": "nuevo@example.com",
  "password": "password123",
  "nombre": "Nuevo Usuario",
  "telefono": "+573001234567",
  "tipoDocumento": 1,
  "numeroDocumento": "12345678",
  "rol": "CLIENTE"
}
```

## 👤 Usuarios

### Obtener Usuario Actual
```http
GET /api/user/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "nombre": "Juan Pérez",
  "telefono": "+573001234567",
  "tipoDocumento": {
    "id": 1,
    "nombre": "Cédula de Ciudadanía"
  },
  "numeroDocumento": "12345678",
  "rol": {
    "id": 1,
    "nombre": "CLIENTE"
  }
}
```

### Actualizar Usuario
```http
PUT /api/user/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "telefono": "+573001234567"
}
```

## 🛍️ Productos

### Listar Productos
```http
GET /api/productos
```

**Query Parameters:**
- `categoria` (optional): ID de categoría
- `search` (optional): Término de búsqueda
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Items por página (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Tomate Cherry",
      "descripcion": "Tomates cherry frescos y orgánicos",
      "precio": 5000,
      "stock": 100,
      "imagen": "https://azstaagromarket.blob.core.windows.net/images/tomate-cherry.jpg",
      "categoria": {
        "id": 1,
        "nombre": "Verduras"
      },
      "unidad": {
        "id": 1,
        "nombre": "Kilogramo",
        "abreviacion": "kg"
      },
      "agricultor": {
        "id": 2,
        "nombre": "María García",
        "email": "maria@example.com"
      },
      "fechaCreacion": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 95,
    "itemsPerPage": 20
  }
}
```

### Obtener Producto por ID
```http
GET /api/productos/{id}
```

**Response:**
```json
{
  "id": 1,
  "nombre": "Tomate Cherry",
  "descripcion": "Tomates cherry frescos y orgánicos",
  "precio": 5000,
  "stock": 100,
  "imagen": "https://azstaagromarket.blob.core.windows.net/images/tomate-cherry.jpg",
  "imagenes": [
    "https://azstaagromarket.blob.core.windows.net/images/tomate-cherry-1.jpg",
    "https://azstaagromarket.blob.core.windows.net/images/tomate-cherry-2.jpg"
  ],
  "categoria": {
    "id": 1,
    "nombre": "Verduras",
    "descripcion": "Verduras frescas y orgánicas"
  },
  "tipoProducto": {
    "id": 1,
    "nombre": "Orgánico"
  },
  "unidad": {
    "id": 1,
    "nombre": "Kilogramo",
    "abreviacion": "kg"
  },
  "agricultor": {
    "id": 2,
    "nombre": "María García",
    "email": "maria@example.com",
    "telefono": "+573001234567"
  },
  "fechaCreacion": "2024-01-15T10:30:00Z",
  "fechaActualizacion": "2024-01-20T14:45:00Z"
}
```

### Crear Producto (Solo Agricultores)
```http
POST /api/productos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Lechuga Crespa",
  "descripcion": "Lechuga crespa fresca, cultivada sin pesticidas",
  "precio": 3500,
  "stock": 50,
  "categoriaId": 1,
  "tipoProductoId": 1,
  "unidadId": 1,
  "imagen": "base64_image_string_or_url"
}
```

### Actualizar Producto
```http
PUT /api/productos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Lechuga Crespa Premium",
  "precio": 4000,
  "stock": 75
}
```

### Eliminar Producto
```http
DELETE /api/productos/{id}
Authorization: Bearer {token}
```

## 🛒 Carrito de Compras

### Obtener Carrito
```http
GET /api/carrito
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "producto": {
        "id": 1,
        "nombre": "Tomate Cherry",
        "precio": 5000,
        "imagen": "https://azstaagromarket.blob.core.windows.net/images/tomate-cherry.jpg"
      },
      "cantidad": 2,
      "precioUnitario": 5000,
      "subtotal": 10000
    }
  ],
  "total": 10000,
  "totalItems": 2
}
```

### Agregar al Carrito
```http
POST /api/carrito/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "productoId": 1,
  "cantidad": 2
}
```

### Actualizar Cantidad
```http
PUT /api/carrito/items/{itemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "cantidad": 3
}
```

### Eliminar del Carrito
```http
DELETE /api/carrito/items/{itemId}
Authorization: Bearer {token}
```

### Limpiar Carrito
```http
DELETE /api/carrito
Authorization: Bearer {token}
```

## 📦 Órdenes de Compra

### Crear Orden
```http
POST /api/ordenes
Authorization: Bearer {token}
Content-Type: application/json

{
  "direccionEntrega": "Calle 123 #45-67, Bogotá",
  "metodoPago": "TARJETA_CREDITO",
  "observaciones": "Entregar en horario de oficina"
}
```

**Response:**
```json
{
  "id": 1,
  "numero": "ORD-2024-001",
  "estado": "PENDIENTE",
  "total": 10000,
  "direccionEntrega": "Calle 123 #45-67, Bogotá",
  "metodoPago": "TARJETA_CREDITO",
  "items": [
    {
      "id": 1,
      "producto": {
        "id": 1,
        "nombre": "Tomate Cherry"
      },
      "cantidad": 2,
      "precioUnitario": 5000,
      "subtotal": 10000
    }
  ],
  "fechaCreacion": "2024-01-20T15:30:00Z"
}
```

### Listar Órdenes
```http
GET /api/ordenes
Authorization: Bearer {token}
```

**Query Parameters:**
- `estado` (optional): PENDIENTE, CONFIRMADA, ENVIADA, ENTREGADA, CANCELADA
- `desde` (optional): Fecha desde (YYYY-MM-DD)
- `hasta` (optional): Fecha hasta (YYYY-MM-DD)

### Obtener Orden por ID
```http
GET /api/ordenes/{id}
Authorization: Bearer {token}
```

### Actualizar Estado de Orden (Solo Agricultores/Admin)
```http
PUT /api/ordenes/{id}/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "CONFIRMADA",
  "observaciones": "Orden confirmada, será enviada mañana"
}
```

## 📊 Categorías

### Listar Categorías
```http
GET /api/categorias
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Verduras",
    "descripcion": "Verduras frescas y orgánicas",
    "imagen": "https://azstaagromarket.blob.core.windows.net/images/verduras.jpg"
  },
  {
    "id": 2,
    "nombre": "Frutas",
    "descripcion": "Frutas frescas de temporada",
    "imagen": "https://azstaagromarket.blob.core.windows.net/images/frutas.jpg"
  }
]
```

### Crear Categoría (Solo Admin)
```http
POST /api/categorias
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Cereales",
  "descripcion": "Cereales y granos",
  "imagen": "base64_image_string_or_url"
}
```

## 🏷️ Tipos de Producto

### Listar Tipos de Producto
```http
GET /api/tipos-producto
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Orgánico",
    "descripcion": "Productos cultivados sin pesticidas"
  },
  {
    "id": 2,
    "nombre": "Convencional",
    "descripcion": "Productos de cultivo convencional"
  }
]
```

## ⚖️ Unidades de Medida

### Listar Unidades
```http
GET /api/unidades
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Kilogramo",
    "abreviacion": "kg"
  },
  {
    "id": 2,
    "nombre": "Libra",
    "abreviacion": "lb"
  },
  {
    "id": 3,
    "nombre": "Unidad",
    "abreviacion": "und"
  }
]
```

## 📄 Tipos de Documento

### Listar Tipos de Documento
```http
GET /api/tipos-documento
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Cédula de Ciudadanía",
    "codigo": "CC"
  },
  {
    "id": 2,
    "nombre": "Cédula de Extranjería",
    "codigo": "CE"
  },
  {
    "id": 3,
    "nombre": "Pasaporte",
    "codigo": "PP"
  }
]
```

## 👥 Roles

### Listar Roles
```http
GET /api/roles
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "ADMINISTRADOR",
    "descripcion": "Administrador del sistema"
  },
  {
    "id": 2,
    "nombre": "AGRICULTOR",
    "descripcion": "Vendedor de productos agrícolas"
  },
  {
    "id": 3,
    "nombre": "CLIENTE",
    "descripcion": "Comprador de productos"
  }
]
```

## 📁 Gestión de Archivos

### Subir Imagen
```http
POST /api/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": [binary_file_data],
  "type": "product" // o "user", "category"
}
```

**Response:**
```json
{
  "url": "https://azstaagromarket.blob.core.windows.net/images/producto-123.jpg",
  "filename": "producto-123.jpg",
  "size": 245760,
  "type": "image/jpeg"
}
```

## ❌ Códigos de Error

### Errores de Autenticación (401)
```json
{
  "error": "UNAUTHORIZED",
  "message": "Token inválido o expirado",
  "code": 401
}
```

### Errores de Autorización (403)
```json
{
  "error": "FORBIDDEN",
  "message": "No tienes permisos para realizar esta acción",
  "code": 403
}
```

### Errores de Validación (400)
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Datos de entrada inválidos",
  "code": 400,
  "details": [
    {
      "field": "email",
      "message": "El email es requerido"
    },
    {
      "field": "precio",
      "message": "El precio debe ser mayor a 0"
    }
  ]
}
```

### Recurso No Encontrado (404)
```json
{
  "error": "NOT_FOUND",
  "message": "Producto no encontrado",
  "code": 404
}
```

### Error del Servidor (500)
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Error interno del servidor",
  "code": 500
}
```

## 📊 Paginación

Todas las listas que soportan paginación usan el siguiente formato:

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 20, max: 100)
- `sortBy`: Campo para ordenar (ej: 'nombre', 'precio', 'fechaCreacion')
- `sortOrder`: Orden de clasificación ('asc' o 'desc')

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 95,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🔍 Búsqueda y Filtros

### Búsqueda de Productos
```http
GET /api/productos/search
```

**Query Parameters:**
- `q`: Término de búsqueda
- `categoria`: ID de categoría
- `tipoProducto`: ID de tipo de producto
- `precioMin`: Precio mínimo
- `precioMax`: Precio máximo
- `agricultor`: ID del agricultor
- `disponible`: true/false (solo productos con stock)

**Ejemplo:**
```http
GET /api/productos/search?q=tomate&categoria=1&precioMin=1000&precioMax=10000&disponible=true
```

## 🔄 WebSocket Events (Future)

### Notificaciones en Tiempo Real
```javascript
// Conexión WebSocket
const ws = new WebSocket('wss://localhost:7127/ws');

// Eventos del servidor
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'ORDER_STATUS_CHANGED':
      // Actualizar estado de orden
      break;
    case 'NEW_PRODUCT':
      // Nuevo producto disponible
      break;
    case 'STOCK_UPDATED':
      // Stock actualizado
      break;
  }
};
```

## 🧪 Testing APIs

### Base URL de Testing
```
https://agromarket-api-test.azurewebsites.net/api
```

### Datos de Prueba

**Usuario Administrador:**
- Email: `admin@agromarket.com`
- Password: `Admin123!`

**Usuario Agricultor:**
- Email: `agricultor@agromarket.com`
- Password: `Agricultor123!`

**Usuario Cliente:**
- Email: `cliente@agromarket.com`
- Password: `Cliente123!`

## 📚 Postman Collection

Se incluye una colección de Postman en `src/assets/postman/` con todos los endpoints configurados y ejemplos de uso.

Para importar:
1. Abrir Postman
2. Importar archivo `IngSoftware.postman_collection.json`
3. Configurar variables de entorno:
   - `baseUrl`: URL base de la API
   - `token`: Token de autenticación

---

**📝 Esta documentación se actualiza constantemente. Para la versión más reciente, consulta el código fuente o la documentación interactiva en `/api/docs`.**