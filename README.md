# AgroMarket

AgroMarket es una aplicación moderna de marketplace agrícola construida con Angular 20+ utilizando componentes standalone. La aplicación imita el diseño de listado de productos de Miravia con un diseño responsivo que incluye navegación en el header, barra lateral de filtros, grilla de productos y footer.

## Características

- 🌱 **Marketplace Agrícola**: Especializado en equipos y suministros agrícolas
- 🛍️ **Catálogo de Productos**: Navegar y ver productos agrícolas con información detallada
- 🔍 **Búsqueda y Filtros**: Buscar productos y filtrar por categoría, marca y rango de precio
- 👤 **Autenticación Simulada**: Sistema de login simple con almacenamiento de token en localStorage
- ➕ **Registro de Productos**: Agregar nuevos productos al marketplace (requiere login)
- 📱 **Diseño Responsivo**: Layout completamente responsivo para escritorio y móviles
- 🎨 **UI Moderna**: Diseño limpio y profesional solo con CSS
- 💰 **Moneda Colombiana**: Precios mostrados en Pesos Colombianos (COP)

## Stack Tecnológico

- **Angular 20+** con componentes standalone
- **TypeScript** para seguridad de tipos
- **CSS Puro** (sin SCSS o librerías de UI)
- **localStorage** para persistencia de datos
- **Sin backend requerido** - aplicación completamente del lado del cliente

## Estructura del Proyecto

\`\`\`
src/app/
├── core/
│   ├── guards/auth/          # Guards de rutas
│   ├── models/              # Modelos de datos
│   └── services/            # Servicios de lógica de negocio
├── layout/                  # Componentes de layout
│   ├── app-shell/
│   ├── header-bar/
│   └── footer-bar/
├── shared/                  # Componentes reutilizables
│   ├── search-bar/
│   ├── sidebar-filter/
│   ├── product-card/
│   └── confirm-dialog/
└── features/               # Páginas de funcionalidades
    ├── home/
    ├── login/
    └── register-product/
\`\`\`

## Comenzando

### Prerequisitos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v20 o superior)

### Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Iniciar el servidor de desarrollo:
   \`\`\`bash
   ng serve -o
   \`\`\`

La aplicación se abrirá automáticamente en su navegador en \`http://localhost:4200/\`.

## Rutas

- \`/\` - Página principal con catálogo de productos
- \`/login\` - Página de inicio de sesión
- \`/products/new\` - Página de registro de productos (requiere autenticación)

## Autenticación

### Credenciales de Login de Prueba

La aplicación incluye un sistema de autenticación simulado. Puede iniciar sesión usando:

- **Email**: \`admin@example.com\`
- **Contraseña**: \`password\`

Alternativamente, puede usar cualquier combinación de email y contraseña no vacíos.

### Características de Autenticación

- Token almacenado en localStorage bajo la clave \`agromarket_token\`
- Protección de rutas para la página de registro de productos
- Redirección automática al login para rutas protegidas
- Funcionalidad de logout con limpieza de token

## Almacenamiento de Datos

La aplicación usa un store en memoria con respaldo en localStorage:

- **Productos**: Almacenados bajo la clave \`agromarket_products\`
- **Token de Auth**: Almacenado bajo la clave \`agromarket_token\`
- **Datos Semilla**: La aplicación automáticamente carga 10 productos agrícolas de muestra en la primera carga

## Productos de Muestra

La aplicación viene pre-cargada con productos agrícolas de muestra incluyendo:

- Herramientas de jardín (azadas, carretillas)
- Semillas (variedades orgánicas)
- Equipos de invernadero
- Sistemas de riego
- Mobiliario de jardín
- Fertilizantes y equipos de monitoreo

Algunos productos incluyen precios con descuento para demostrar la funcionalidad de badge de descuento.

## Manejo de Imágenes Faltantes

La aplicación incluye manejo de imágenes rotas:

- **Producto "Semillas de Tomate Orgánico"** tiene una URL de imagen rota intencionalmente
- Cuando una imagen falla al cargar, se muestra un placeholder con el texto "Imagen no disponible"
- El placeholder tiene un estilo consistente con el diseño general

## Desarrollo

### Scripts Disponibles

- \`npm start\` - Iniciar servidor de desarrollo
- \`npm run build\` - Construir para producción
- \`npm test\` - Ejecutar pruebas unitarias
- \`npm run watch\` - Construir en modo watch

### Estilo de Código

- **Componentes**: Nombres de clase en PascalCase, nombres de archivo en kebab-case
- **Servicios**: PascalCase con sufijo \`.service.ts\`
- **Modelos**: Interfaces en PascalCase con sufijo \`.model.ts\`
- **Estilos**: CSS puro con convenciones de nomenclatura tipo BEM

### Agregar Nuevos Productos

Use el formulario de registro de productos (\`/products/new\`) para agregar nuevos productos. Campos requeridos:

- Nombre del producto
- Categoría (de lista predefinida)
- Marca
- Precio (en COP)
- URL de imagen
- Descripción

Campos opcionales:
- Porcentaje de descuento

## Soporte de Navegadores

- Chrome (última versión)
- Firefox (última versión)
- Safari (última versión)
- Edge (última versión)

## Mejoras Futuras

- Validación de formularios
- Búsqueda y filtrado avanzado
- Página de detalles de producto
- Funcionalidad de carrito de compras
- Perfiles de usuario
- Gestión de órdenes
- Integración con backend real

## Licencia

Este proyecto es para propósitos de demostración. Todos los derechos reservados.

---

Construido con ❤️ usando Angular 20+
