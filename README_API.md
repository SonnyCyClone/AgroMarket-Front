# AgroMarket - Plataforma de Productos Agrícolas

AgroMarket es una aplicación web desarrollada en Angular 17+ que simula una plataforma de comercio electrónico especializada en productos agrícolas. La aplicación cuenta con un catálogo de productos, sistema de autenticación básico y registro de nuevos productos con integración API real.

## Características

- **Interfaz completamente en español** con formato de moneda colombiana (COP)
- **Componentes standalone** de Angular 17+ sin NgModules
- **Diseño responsive** con CSS puro (sin SCSS)
- **Autenticación mock** para demostración
- **Integración API real** para registro de productos
- **Gestión de imágenes** con placeholder automático para imágenes rotas

## Configuración de la API

### Variables de Entorno

La aplicación utiliza una URL base configurable para las llamadas a la API:

1. **Configuración por defecto**: Edita `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://tu-api-base-url.com',
};
```

2. **Override dinámico**: Usar localStorage en el navegador
```javascript
localStorage.setItem('agromarket_apiBaseUrl', 'https://otra-api-url.com');
```

El localStorage tiene prioridad sobre la configuración del environment.

### Endpoints de la API

La aplicación consume los siguientes endpoints:

- `GET /api/Categoria` - Lista de categorías
- `GET /api/Uniodades` - Lista de unidades de medida (nota: spelling original del endpoint)
- `GET /api/TipoProducto/Categoria/{categoriaId}` - Tipos de producto por categoría
- `POST /api/Producto` - Crear nuevo producto (form-data)

## Rutas de la Aplicación

- `/` - **Página principal**: Catálogo de productos con filtros y grid responsive
- `/login` - **Inicio de sesión**: Autenticación mock
- `/products/new` - **Registro de productos**: Formulario con integración API (requiere login)

## Autenticación

### Credenciales de Prueba

La aplicación acepta cualquier combinación de email/contraseña no vacía, o específicamente:
- **Email**: admin@example.com
- **Contraseña**: password

### Comportamiento post-login

Al iniciar sesión exitosamente:
1. Se almacena un token en `localStorage['agromarket_token']`
2. Se redirige a la página principal
3. Aparece el botón **"Registrar producto"** en el header
4. Se habilita el acceso a `/products/new`

## Datos de Prueba

La aplicación incluye productos de muestra que representan el mercado agrícola:

- **Azada Profesional para Jardín** (con descuento)
- **Semillas de Tomate Orgánico** (imagen rota para demostrar placeholder)
- **Kit Invernadero 10x12** (con descuento)
- **Sistema de Riego Profesional**
- **Silla Ergonómica de Jardín** (con descuento)
- Y otros productos relacionados con agricultura

### Gestión de Imágenes

Cuando una imagen de producto no se puede cargar (como las "Semillas de Tomate Orgánico"), se muestra automáticamente un placeholder con el texto **"Imagen no disponible"**.

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)

### Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve -o

# Construir para producción
npm run build
```

La aplicación estará disponible en `http://localhost:4200`.

## Estructura del Proyecto

```
src/app/
├── core/
│   ├── models/           # Interfaces TypeScript para API
│   ├── services/
│   │   ├── auth/         # Servicio de autenticación
│   │   ├── product/      # Servicios de productos (mock + API)
│   │   └── http/         # Wrapper de HttpClient
│   └── guards/           # Guards de rutas
├── features/
│   ├── home/             # Página principal
│   ├── login/            # Página de login
│   └── register-product/ # Registro de productos
├── layout/
│   ├── app-shell/        # Layout principal
│   ├── header-bar/       # Header con navegación
│   └── footer-bar/       # Footer
└── shared/
    ├── product-card/     # Tarjeta de producto
    ├── sidebar-filter/   # Filtros laterales
    ├── search-bar/       # Barra de búsqueda
    └── confirm-dialog/   # Modal de confirmación
```

## Funcionalidades Técnicas

### Registro de Productos

El formulario de registro utiliza:
- **Reactive Forms** con validación
- **Carga dinámica** de categorías y unidades desde API
- **Cascada de tipos de producto** basada en categoría seleccionada
- **Validación en tiempo real** con mensajes en español
- **Envío como FormData** según especificación de la API

### Formato de Moneda

Todos los precios se muestran en pesos colombianos (COP) con el formato:
- **$ 1.234.567** (usando separador de miles)
- Internamente se almacenan como números para cálculos

### Responsive Design

- **Grid de productos**: auto-fit minmax(220px, 1fr)
- **Filtros laterales**: se apilan en pantallas pequeñas
- **Header sticky**: se mantiene fijo al hacer scroll
- **Formularios**: adaptan su layout en móviles

## Tecnologías Utilizadas

- **Angular 17+** con standalone components
- **TypeScript** para tipado estático
- **RxJS** para manejo de observables
- **CSS puro** sin preprocesadores
- **HttpClient** para integración API
- **Reactive Forms** para formularios complejos

---

**AgroMarket** - Tu socio confiable para suministros agrícolas 🌱
