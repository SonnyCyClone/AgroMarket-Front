# AgroMarket - Plataforma de Productos Agrícolas

AgroMarket es una aplicación web desarrollada en Angular 17+ que permite la gestión y venta de productos agrícolas. La aplicación cuenta con autenticación, catálogo de productos y formularios de registro.

## Características Principales

### Tecnologías
- **Angular 17+** con componentes standalone
- **CSS puro** (sin SCSS)
- **Enrutamiento** habilitado
- **Formularios reactivos** para validación
- **TypeScript** para tipado estático
- **Interfaz en español** completamente

### Funcionalidades
- 🔐 **Autenticación completa** con registro y login
- 🛍️ **Catálogo de productos** con diseño responsive
- 📝 **Registro de productos** integrado con API real
- 🔍 **Búsqueda y filtros** (placeholders funcionales)
- 💰 **Formato de moneda** en pesos colombianos (COP)
- 🖼️ **Manejo de imágenes** con placeholder cuando fallan
- ♿ **Accesibilidad** con labels y ARIA apropiados

## Configuración de API

### Variables de Entorno

La aplicación utiliza las siguientes configuraciones para conectarse a la API:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://tu-api-url.com', // Configurar aquí tu URL base
};
```

### Override de URL en Runtime

Puedes cambiar la URL base de la API sin recompilar usando localStorage:

```javascript
// En el navegador (DevTools Console)
localStorage.setItem('agromarket_apiBaseUrl', 'https://nueva-api.com');
// Recarga la página para aplicar los cambios
```

### Endpoints de API Utilizados

La aplicación se integra con los siguientes endpoints:

#### Autenticación (Modo Mock)
- `POST /api/auth/login` - Iniciar sesión (mock)
- `POST /api/auth/register` - Crear cuenta (mock, legacy)
- `POST /api/auth/logout` - Cerrar sesión (mock)

#### Usuarios
- `POST /api/Usuario` - Crear nuevo usuario (API real)
- `GET /api/TipoDocumento` - Obtener tipos de documento (dropdown seleccionable)

#### Productos
- `GET /api/Categoria` - Listar categorías
- `GET /api/TipoProducto/Categoria/{id}` - Tipos por categoría
- `GET /api/Uniodades` - Unidades de medida
- `POST /api/Producto` - Crear producto (form-data)

## Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [tu-repositorio]
cd AgroMarket-Front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar la URL de API**
Edita `src/environments/environment.ts` y establece tu `apiBaseUrl`.

4. **Ejecutar la aplicación**
```bash
ng serve -o
```

La aplicación se abrirá automáticamente en `http://localhost:4200`

## Funcionalidades de Autenticación

### Sistema Híbrido: Login Mock + Registro Real

La aplicación utiliza un sistema híbrido donde:
- **Login**: Funciona en modo mock/demo para desarrollo
- **Registro de usuarios**: Se conecta a la API real

### Modo Demo para Login
Para pruebas rápidas del login, la aplicación incluye autenticación mock:

**Credenciales de prueba:**
- Email: `admin@example.com`
- Contraseña: `password`
- O cualquier valor no vacío en ambos campos

### Registro Real de Usuarios
Cuando esté conectada a la API real:
1. **Crear cuenta**: Usar el formulario de registro que llama a `/api/CrearUsuario`
2. **Tipos de documento**: Se muestran como referencia visual (GET `/api/TipoDocumento`)
3. **Validaciones**: Formulario reactivo con validaciones básicas
4. **Confirmación**: Dialog de éxito/error tras el registro

## Rutas de la Aplicación

- `/` - Página principal (catálogo de productos)
- `/login` - Formulario de inicio de sesión (mock)
- `/register` - Formulario de registro de usuarios (API real)
- `/products/new` - Registro de productos (requiere autenticación mock)

## Datos de Ejemplo

La aplicación incluye productos de ejemplo que demuestran:

- ✅ **Formato de precios** en COP ($ 12.345)
- ✅ **Productos con descuento** (badges de porcentaje)
- ✅ **Imagen con error** ("Semillas de Tomate Orgánico" con URL rota)
- ✅ **Placeholder de imagen** ("Imagen no disponible")

## Estructura del Proyecto

```
src/app/
├── core/
│   ├── guards/auth/          # Guard de autenticación
│   ├── models/               # Interfaces TypeScript
│   └── services/             # Servicios (HTTP, Auth, Product)
├── features/
│   ├── home/                 # Página principal
│   ├── login/                # Página de login
│   ├── register/             # Página de registro
│   └── register-product/     # Registro de productos
├── layout/
│   ├── app-shell/            # Layout principal
│   ├── header-bar/           # Barra superior con dropdown
│   └── footer-bar/           # Pie de página
└── shared/
    ├── confirm-dialog/       # Modal de confirmación
    ├── product-card/         # Tarjeta de producto
    ├── search-bar/           # Barra de búsqueda
    └── sidebar-filter/       # Filtros laterales
```

## Desarrollo y Builds

### Comandos Disponibles

```bash
# Desarrollo con recarga automática
ng serve

# Build de producción
ng build

# Tests unitarios
ng test

# Linting de código
ng lint
```

### Responsive Design

La aplicación es completamente responsive:
- **Desktop**: Layout de 2 columnas (filtros + grid)
- **Tablet**: Grid adaptativo
- **Mobile**: Filtros colapsados, navegación simplificada

## Accesibilidad

- ✅ **Labels asociados** con atributo `for`
- ✅ **IDs únicos** en todos los elementos de formulario
- ✅ **ARIA labels** en botones e interacciones
- ✅ **Navegación por teclado** funcional
- ✅ **Mensajes de error** descriptivos
- ✅ **Contraste de colores** apropiado

## Características del Formulario de Registro

### Campos del Formulario `/register`
- **Correo electrónico**: Campo de email (sin validación)
- **Nombre**: Campo de texto libre
- **Apellido**: Campo de texto libre
- **Teléfono**: Campo de texto libre
- **Dirección**: Campo de texto libre
- **Documento**: Campo de texto libre
- **Contraseña**: Campo de texto libre
- **Tipo de Documento**: Dropdown opcional (no se envía en POST)

### Tipos de Documento (Dropdown Seleccionable)
- Se obtienen de `GET /api/TipoDocumento`
- Se muestran como: "SIGLA - Descripción"
- Dropdown seleccionable pero opcional
- El valor seleccionado NO se incluye en el POST a `/api/Usuario`
- Estado de carga: "Cargando tipos de documento..."

### Flujo de Registro
1. Usuario llena el formulario (todos los campos opcionales)
2. Botón "Crear Cuenta" siempre habilitado
3. Se envía POST a `/api/Usuario` solo con: Email, Nombre, Apellido, Telefono, Direccion, Documento, Password
4. Éxito: Dialog "¡Cuenta Creada!" → Navega a `/login`
5. Error: Dialog con detalles del error

## Contribución

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

---

**AgroMarket** - Tu socio de confianza para suministros y equipos agrícolas 🌱
