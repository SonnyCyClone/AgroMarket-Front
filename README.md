# AgroMarket 🌱

AgroMarket es una plataforma moderna de marketplace agrícola construida con Angular 20+ utilizando componentes standalone. La aplicación conecta productores agrícolas con compradores a través de un sistema completo de ecommerce especializado en productos agrícolas.

## ✨ Características Principales

### 🛍️ **Marketplace Completo**
- 🌾 **Catálogo de Productos**: Navegación y visualización de productos agrícolas con información detallada
- 🔍 **Búsqueda Avanzada**: Motor de búsqueda inteligente por términos específicos
- 📊 **Filtros Dinámicos**: Filtrado por categoría, tipo de producto, rango de precio y más
- 🛒 **Carrito de Compras**: Sistema completo de carrito con persistencia y gestión de cantidades
- 💳 **Proceso de Checkout**: Flujo de compra con opciones de envío, pago y confirmación

### 👥 **Sistema de Usuarios Multi-Rol**
- � **Autenticación Robusta**: Login seguro con JWT y Azure APIM
- 🚜 **Rol Agricultor**: Gestión completa de productos propios, registro y edición
- 🛒 **Rol Comprador**: Navegación, compra y gestión de órdenes
- 👤 **Perfiles de Usuario**: Gestión de información personal y configuraciones

### 🌐 **Integración con Azure APIM**
- ☁️ **API Centralizada**: Todos los endpoints gestionados a través de Azure API Management
- 🔑 **Autenticación Automática**: Headers de suscripción inyectados automáticamente
- 🛡️ **Seguridad**: Interceptores para manejo seguro de FormData y autenticación
- 📈 **Escalabilidad**: Arquitectura preparada para producción en la nube

### 🎯 **Funcionalidades por Rol**

#### Para Agricultores:
- ➕ **Registro de Productos**: Crear nuevos productos con imágenes y especificaciones
- ✏️ **Gestión de Productos**: Editar, activar/desactivar productos propios
- � **Dashboard Personal**: Ver únicamente productos creados por el agricultor autenticado
- 📊 **Inventario**: Control de cantidades disponibles y precios

#### Para Compradores:
- 🛍️ **Explorar Catálogo**: Navegar todos los productos disponibles
- 🔍 **Búsqueda Personalizada**: Encontrar productos específicos
- 🛒 **Gestión de Carrito**: Agregar, modificar y eliminar productos del carrito
- 💫 **Animaciones Interactivas**: Efectos visuales fly-to-cart para mejor UX

### 📱 **Experiencia de Usuario**
- 🎨 **Diseño Moderno**: UI limpia inspirada en plataformas como Miravia
- � **Totalmente Responsivo**: Adaptado para escritorio, tablet y móviles
- 🌟 **Animaciones Fluidas**: Transiciones y efectos visuales atractivos
- 💰 **Moneda Local**: Precios en Pesos Colombianos (COP) con formato local

## 🛠️ Stack Tecnológico

### Frontend
- **Angular 20+** con arquitectura standalone components
- **TypeScript 5+** para desarrollo type-safe
- **Angular Material** para componentes UI consistentes
- **CSS3** con variables CSS y flexbox/grid
- **RxJS** para programación reactiva

### Backend Integration  
- **Azure API Management** para gestión centralizada de APIs
- **REST APIs** con arquitectura RESTful
- **JWT Authentication** para autenticación segura
- **HTTP Interceptors** para manejo automático de headers

### Herramientas de Desarrollo
- **Angular CLI** para scaffolding y build
- **TypeScript Compiler** para transpilación
- **Webpack** (vía Angular CLI) para bundling
- **Jasmine + Karma** para testing unitario

## 📁 Estructura del Proyecto

\`\`\`
src/app/
├── core/                    # Funcionalidades centrales
│   ├── guards/             # Protección de rutas (auth, roles)
│   ├── models/             # Interfaces TypeScript y tipos
│   ├── services/           # Servicios de lógica de negocio
│   │   ├── auth/          # Autenticación y autorización
│   │   ├── cart/          # Gestión del carrito de compras
│   │   ├── product/       # Operaciones de productos
│   │   ├── user/          # Gestión de usuarios
│   │   └── http/          # Servicios HTTP y API clients
│   ├── interceptors/      # HTTP interceptors (APIM, Auth)
│   └── mappers/           # Transformadores de datos API ↔ UI
├── features/               # Módulos funcionales
│   ├── home/              # Página principal con catálogo
│   ├── login/             # Autenticación de usuarios
│   ├── cart/              # Carrito de compras
│   ├── checkout/          # Proceso de compra completo
│   │   ├── shipping/      # Información de envío
│   │   ├── payment/       # Métodos de pago
│   │   ├── summary/       # Resumen de orden
│   │   ├── success/       # Confirmación exitosa
│   │   └── failure/       # Manejo de errores
│   ├── account/           # Gestión de perfil usuario
│   ├── product-edit/      # Edición de productos
│   ├── products-manage/   # Dashboard de productos del agricultor
│   ├── register-product/  # Registro de nuevos productos
│   ├── register-user/     # Registro de nuevos usuarios
│   └── support/           # Soporte y FAQ
├── layout/                # Componentes de estructura
│   ├── app-shell/         # Shell principal de la aplicación
│   ├── header-bar/        # Barra de navegación superior
│   └── footer-bar/        # Pie de página
├── shared/                # Componentes reutilizables
│   ├── product-card/      # Tarjeta de producto
│   ├── product-preview/   # Modal de vista previa
│   ├── floating-cart/     # Botón flotante de carrito (FAB)
│   ├── fly-to-cart-overlay/ # Animaciones de compra
│   ├── search-bar/        # Barra de búsqueda
│   ├── sidebar-filter/    # Panel de filtros laterales
│   ├── confirm-dialog/    # Diálogos de confirmación
│   ├── edit-product-modal/ # Modal de edición rápida
│   └── image-upload/      # Componente de subida de imágenes
└── environments/          # Configuraciones por entorno
    ├── environment.ts     # Desarrollo
    └── environment.prod.ts # Producción
\`\`\`

## 🚀 Comenzando

### 📋 Prerequisitos

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)  
- **Angular CLI** (v20 o superior)
- **Acceso a Azure APIM** (para funcionalidad completa)

### 🔧 Instalación

1. **Clonar el repositorio**
   \`\`\`bash
   git clone https://github.com/SonnyCyClone/AgroMarket-Front.git
   cd AgroMarket-Front
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar entornos**
   - Verificar configuración en \`src/environments/environment.ts\`
   - Asegurar que \`apiBaseUrl\` apunte al Azure APIM correcto
   - Validar que \`apimKey\` tenga la clave de suscripción correcta

4. **Iniciar servidor de desarrollo**
   \`\`\`bash
   ng serve -o
   \`\`\`

La aplicación se abrirá automáticamente en \`http://localhost:4200/\`.

### 🔑 Configuración de Azure APIM

La aplicación está configurada para conectarse a Azure API Management:

\`\`\`typescript
// src/environments/environment.ts
export const environment = {
  apiBaseUrl: 'https://az-apim-use-agromarket.azure-api.net',
  apimKey: 'tu-clave-de-suscripcion-apim',
  // ... otros endpoints
};
\`\`\`

**Nota**: Los headers de autenticación APIM se inyectan automáticamente a través del interceptor configurado.

## 🛣️ Rutas de la Aplicación

### 🏠 **Públicas**
- \`/\` - Página principal con catálogo completo de productos
- \`/login\` - Inicio de sesión
- \`/register\` - Registro de nuevos usuarios

### 🔐 **Autenticadas** 
- \`/cart\` - Carrito de compras
- \`/profile\` - Perfil del usuario
- \`/account/forgot-password\` - Recuperación de contraseña

### 🚜 **Exclusivas para Agricultores**
- \`/products/manage\` - Dashboard de productos del agricultor
- \`/products/new\` - Registro de nuevos productos
- \`/products/edit/:id\` - Edición de productos existentes

### 🛍️ **Proceso de Compra**
- \`/checkout/shipping\` - Información de envío
- \`/checkout/payment\` - Métodos de pago  
- \`/checkout/summary\` - Resumen de la orden
- \`/checkout/success\` - Confirmación de compra exitosa
- \`/checkout/failure\` - Manejo de errores de compra

### ℹ️ **Soporte**
- \`/support\` - Centro de ayuda y contacto
- \`/faq\` - Preguntas frecuentes

## 🔐 Sistema de Autenticación

### 🎭 **Roles de Usuario**

#### 🚜 **Agricultor (AGRICULTOR)**
- Gestionar productos propios (crear, editar, activar/desactivar)
- Dashboard personalizado con productos del usuario
- Acceso completo al sistema de ventas

#### 🛒 **Comprador (COMPRADOR)**  
- Navegar catálogo completo de productos
- Sistema de carrito y proceso de compra
- Gestión de perfil y órdenes

### 🔑 **Características de Autenticación**

- **JWT Tokens**: Autenticación basada en JSON Web Tokens
- **Azure APIM**: Integración completa con Azure API Management
- **Persistencia Segura**: Tokens almacenados en localStorage
- **Auto-renovación**: Manejo automático de expiración de tokens
- **Guards de Ruta**: Protección automática de rutas por roles
- **Interceptores**: Inyección automática de headers de autenticación

### 🧪 **Testing y Desarrollo**

Para pruebas, crear usuarios a través de \`/register\` o usar credenciales existentes:

\`\`\`bash
# Ejemplo de flujo de desarrollo
1. Registrar nuevo usuario en /register
2. Seleccionar rol (AGRICULTOR o COMPRADOR)
3. Login automático después del registro
4. Navegación basada en rol asignado
\`\`\`

### 🔄 **Flujo de Autenticación**

1. **Login** → Envío de credenciales a Azure APIM
2. **Token JWT** → Recepción y almacenamiento seguro
3. **User ID** → Extracción y persistencia del ID de usuario
4. **Redirección** → Navegación basada en el rol del usuario
5. **Interceptors** → Headers automáticos en todas las peticiones

## 💾 Gestión de Datos

### 🔄 **Persistencia y Almacenamiento**
- **Carrito**: Estado persistente en localStorage con clave \`agromarket_cart\`
- **Autenticación**: JWT token bajo \`agromarket_token\`
- **Usuario**: ID de usuario en \`am_user_id\`
- **Configuración**: Preferencias de usuario en \`user_preferences\`

### 🌐 **API Integration**
- **Azure APIM**: Conexión completa con backend en la nube
- **Interceptores**: Manejo automático de headers y errores
- **Caché Inteligente**: Optimización de peticiones repetitivas
- **Offline Support**: Funcionamiento básico sin conexión

### 🖼️ **Gestión de Imágenes**

#### **Manejo Robusto de Imágenes**
- **Detección de Errores**: Detección automática de imágenes rotas
- **Placeholders**: Imágenes de respaldo consistentes con el diseño
- **Optimización**: Carga lazy de imágenes para mejor performance
- **Formatos**: Soporte para JPG, PNG, WebP y SVG

#### **Upload de Imágenes**
- **Validación**: Verificación de formato y tamaño
- **Preview**: Vista previa antes de subir
- **Compresión**: Optimización automática de calidad
- **Base64**: Conversión automática para almacenamiento

### 📊 **Datos de Desarrollo**
- **Mock Data**: Productos de muestra para desarrollo
- **Seed Data**: Datos iniciales automáticos
- **Testing**: Fixtures para pruebas unitarias

## 🎯 Funcionalidades Avanzadas

### 🛒 **Sistema de Carrito**
- **Persistencia**: Carrito preservado entre sesiones
- **Gestión de Cantidades**: Incrementar/decrementar productos
- **Validación**: Control de stock disponible
- **Cálculos**: Subtotales, impuestos y totales automáticos
- **Animaciones**: Efectos visuales fly-to-cart

### 🔍 **Motor de Búsqueda**
- **Búsqueda en Tiempo Real**: Resultados instantáneos mientras escribes
- **Filtros Avanzados**: Por categoría, precio, disponibilidad
- **Ordenamiento**: Por nombre, precio, fecha de creación
- **Resultados Inteligentes**: Búsqueda tolerante a errores

### 👤 **Gestión de Productos por Agricultor**
- **Dashboard Personal**: Ver solo productos propios del usuario autenticado
- **CRUD Completo**: Crear, leer, actualizar y desactivar productos
- **Filtrado Automático**: Solo productos del agricultor logueado
- **Validación de Propiedad**: Verificación de permisos por usuario

### 🎨 **Experiencia de Usuario**
- **Responsive Design**: Adaptado a todos los dispositivos
- **Animaciones Fluidas**: Transiciones suaves y atractivas
- **Loading States**: Indicadores visuales de carga
- **Error Handling**: Manejo elegante de errores con mensajes claros

## 👨‍💻 Desarrollo

### 📜 **Scripts Disponibles**

\`\`\`bash
npm start              # Servidor de desarrollo (puerto 4200)
npm run build          # Build de producción optimizado
npm run build:prod     # Build con optimizaciones avanzadas
npm test               # Pruebas unitarias con Karma
npm run test:watch     # Pruebas en modo watch
npm run e2e            # Pruebas end-to-end
npm run lint           # Linter de código TypeScript
npm run lint:fix       # Auto-corrección de linting
\`\`\`

### 🎨 **Convenciones de Código**

#### **Arquitectura**
- **Standalone Components**: Solo componentes standalone, no NgModules
- **Signals**: Estado reactivo con Angular Signals
- **Dependency Injection**: Función \`inject()\` sobre constructor injection
- **Reactive Forms**: FormControl y FormBuilder sobre template-driven

#### **Nomenclatura**
- **Componentes**: \`PascalCase\` para clases, \`kebab-case\` para archivos
- **Servicios**: \`PascalCase\` con sufijo \`.service.ts\`
- **Interfaces**: \`PascalCase\` con sufijo \`.model.ts\` o \`.interface.ts\`
- **Funciones**: \`camelCase\` descriptivo

#### **Organización**
- **Por Feature**: Agrupación por funcionalidad, no por tipo de archivo
- **Core/Shared**: Separación clara entre funcionalidades centrales y compartidas
- **Lazy Loading**: Carga diferida de módulos de features

### 🧪 **Testing**

#### **Estrategia de Testing**
- **Unit Tests**: Componentes, servicios y utilidades
- **Integration Tests**: Flujos completos de usuario
- **E2E Tests**: Casos de uso críticos end-to-end

#### **Herramientas**
- **Jasmine**: Framework de testing
- **Karma**: Test runner
- **Angular Testing Utilities**: TestBed, ComponentFixture
- **Cypress**: E2E testing (configuración futura)

### 🚀 **Deployment**

#### **Build de Producción**
\`\`\`bash
npm run build:prod     # Build optimizado para producción
\`\`\`

#### **Configuraciones de Entorno**
- **Development**: \`environment.ts\` - Configuración local
- **Production**: \`environment.prod.ts\` - Azure APIM producción
- **Staging**: \`environment.staging.ts\` - Entorno de pruebas

#### **Azure Integration**
- **APIM**: Configuración completa de Azure API Management
- **Authentication**: JWT con Azure Active Directory
- **Monitoring**: Application Insights para métricas
- **CDN**: Distribución global de assets estáticos

## 🌐 Soporte de Navegadores

| Navegador | Versión Mínima | Estado |
|-----------|---------------|---------|
| Chrome | 90+ | ✅ Totalmente compatible |
| Firefox | 88+ | ✅ Totalmente compatible |
| Safari | 14+ | ✅ Totalmente compatible |
| Edge | 90+ | ✅ Totalmente compatible |
| iOS Safari | 14+ | ✅ Responsive |
| Android Chrome | 90+ | ✅ Responsive |

## 🔮 Roadmap y Mejoras Futuras

### 🎯 **Próximas Funcionalidades**
- [ ] **Sistema de Notificaciones**: Push notifications para nuevos productos
- [ ] **Chat en Tiempo Real**: Comunicación directa agricultor-comprador  
- [ ] **Geolocalización**: Productos por ubicación geográfica
- [ ] **Sistema de Reviews**: Calificaciones y comentarios de productos
- [ ] **Dashboard Analytics**: Métricas de ventas para agricultores

### 🛠️ **Mejoras Técnicas**
- [ ] **Progressive Web App**: Instalación y offline support
- [ ] **Server-Side Rendering**: SSR con Angular Universal
- [ ] **Micro-frontends**: Arquitectura escalable por equipos
- [ ] **GraphQL**: Migración de REST a GraphQL
- [ ] **Real-time Updates**: WebSockets para actualizaciones en tiempo real

### 🎨 **UX/UI Enhancements**
- [ ] **Dark Mode**: Tema oscuro alternativo
- [ ] **Accesibilidad**: WCAG 2.1 AA compliance
- [ ] **Internacionalización**: Soporte multi-idioma (i18n)
- [ ] **Animaciones Avanzadas**: Micro-interacciones y transiciones

## 📞 Soporte y Contribución

### 🐛 **Reportar Issues**
- Usar GitHub Issues para bugs y feature requests
- Incluir pasos para reproducir el problema
- Especificar navegador y versión del sistema

### 🤝 **Contribuir**
1. Fork del repositorio
2. Crear feature branch (\`git checkout -b feature/nueva-funcionalidad\`)
3. Commit cambios (\`git commit -m 'Añadir nueva funcionalidad'\`)
4. Push al branch (\`git push origin feature/nueva-funcionalidad\`)
5. Crear Pull Request

### 📋 **Guidelines**
- Seguir convenciones de código establecidas
- Incluir tests para nuevas funcionalidades
- Documentar cambios en el README
- Usar commits semánticos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 🙏 Agradecimientos

- **Angular Team** por el excelente framework
- **Microsoft Azure** por los servicios en la nube
- **Comunidad Open Source** por las librerías utilizadas

---

**🌱 Construido con ❤️ por el equipo AgroMarket usando Angular 20+ y Azure Cloud**

**📧 Contacto**: [soporte@agromarket.com](mailto:soporte@agromarket.com) | **🌐 Web**: [www.agromarket.com](https://www.agromarket.com)
