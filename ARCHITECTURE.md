# 🏗️ Estructura del Proyecto AgroMarket

Esta documentación describe la organización y arquitectura del proyecto AgroMarket Frontend.

## 📁 Estructura General

```
AgroMarket-Front/
├── 📁 .github/                     # GitHub workflows y templates
│   ├── workflows/                  # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/            # Templates para issues
│   └── PULL_REQUEST_TEMPLATE.md   # Template para PRs
├── 📁 src/                        # Código fuente principal
│   ├── 📁 app/                    # Aplicación Angular
│   ├── 📁 assets/                 # Recursos estáticos
│   ├── 📁 environments/           # Configuraciones de entorno
│   ├── 📄 index.html              # HTML principal
│   ├── 📄 main.ts                 # Bootstrap de la aplicación
│   └── 📄 styles.css              # Estilos globales
├── 📁 public/                     # Archivos públicos estáticos
├── 📄 angular.json                # Configuración de Angular CLI
├── 📄 package.json                # Dependencias y scripts
├── 📄 tsconfig.json               # Configuración TypeScript
├── 📄 README.md                   # Documentación principal
└── 📄 CONTRIBUTING.md             # Guía de contribución
```

## 🎯 Arquitectura de la Aplicación

### 📂 src/app/ - Estructura Principal

```
src/app/
├── 📁 core/                       # Funcionalidades centrales
│   ├── 📁 guards/                 # Route guards
│   ├── 📁 models/                 # Interfaces y tipos
│   ├── 📁 services/               # Servicios de negocio
│   └── 📁 interceptors/           # HTTP interceptors
├── 📁 features/                   # Módulos de funcionalidades
│   ├── 📁 home/                   # Página principal
│   ├── 📁 login/                  # Autenticación
│   ├── 📁 cart/                   # Carrito de compras
│   ├── 📁 checkout/               # Proceso de compra
│   ├── 📁 account/                # Gestión de cuenta
│   ├── 📁 product-edit/           # Edición de productos
│   ├── 📁 products-manage/        # Gestión de productos
│   ├── 📁 register-product/       # Registro de productos
│   └── 📁 register-user/          # Registro de usuarios
├── 📁 layout/                     # Componentes de layout
│   ├── 📁 app-shell/              # Shell principal
│   ├── 📁 header-bar/             # Barra de navegación
│   └── 📁 footer-bar/             # Pie de página
├── 📁 shared/                     # Componentes reutilizables
│   ├── 📁 product-card/           # Tarjeta de producto
│   ├── 📁 product-preview/        # Modal de vista previa
│   ├── 📁 floating-cart/          # FAB del carrito
│   ├── 📁 fly-to-cart-overlay/    # Animaciones
│   ├── 📁 search-bar/             # Barra de búsqueda
│   ├── 📁 sidebar-filter/         # Filtros laterales
│   ├── 📁 confirm-dialog/         # Diálogos de confirmación
│   ├── 📁 edit-product-modal/     # Modal de edición
│   └── 📁 image-upload/           # Subida de imágenes
├── 📄 app.config.ts               # Configuración de la app
├── 📄 app.html                    # Template principal
├── 📄 app.routes.ts               # Configuración de rutas
└── 📄 app.ts                      # Componente raíz
```

## 🧩 Detalles por Módulo

### 🏠 Core Module
> **Propósito**: Funcionalidades centrales y servicios singleton

```
core/
├── guards/
│   └── auth/
│       ├── auth.guard.ts          # Guard de autenticación
│       └── role.guard.ts          # Guard basado en roles
├── models/
│   ├── auth.model.ts              # Interfaces de autenticación
│   ├── cart.model.ts              # Interfaces del carrito
│   ├── categoria.model.ts         # Interfaces de categorías
│   ├── product.model.ts           # Interfaces de productos
│   ├── crear-usuario.model.ts     # Interfaces de registro
│   ├── rol.model.ts               # Interfaces de roles
│   ├── tipo-documento.model.ts    # Tipos de documento
│   ├── tipo-producto.model.ts     # Tipos de producto
│   └── unidad.model.ts            # Unidades de medida
└── services/
    ├── auth/
    │   ├── auth.service.ts        # Gestión de autenticación
    │   └── auth.interceptor.ts    # Interceptor JWT
    ├── cart/
    │   └── cart.service.ts        # Gestión del carrito
    ├── http/
    │   └── http.service.ts        # Cliente HTTP base
    ├── product/
    │   └── product.service.ts     # Gestión de productos
    ├── user/
    │   └── user.service.ts        # Gestión de usuarios
    └── animation/
        └── fly-to-cart.service.ts # Animaciones
```

### 🎨 Features Module
> **Propósito**: Páginas y funcionalidades específicas

#### 🏠 Home Page
```
features/home/
├── home.page.ts                   # Componente principal
├── home.page.html                 # Template
├── home.page.css                  # Estilos
└── home.page.spec.ts              # Tests unitarios
```

**Responsabilidades:**
- Mostrar catálogo de productos
- Integrar barra de búsqueda
- Mostrar filtros laterales
- Paginación de productos
- Integración con carrito flotante

#### 🛒 Cart Page
```
features/cart/
├── cart.page.ts                   # Gestión del carrito
├── cart.page.html                 # Template del carrito
├── cart.page.css                  # Estilos del carrito
└── cart.page.spec.ts              # Tests
```

**Responsabilidades:**
- Mostrar items del carrito
- Calcular totales y impuestos
- Permitir modificar cantidades
- Navegación al checkout

#### 🔐 Authentication
```
features/login/
├── login.page.ts                  # Componente de login
├── login.page.html                # Formulario de login
├── login.page.css                 # Estilos
└── login.page.spec.ts             # Tests

features/register-user/
├── register-user.page.ts          # Registro de usuarios
├── register-user.page.html        # Formulario de registro
├── register-user.page.css         # Estilos
└── register-user.page.spec.ts     # Tests
```

### 🔧 Layout Module
> **Propósito**: Componentes de estructura de la aplicación

#### 🏗️ App Shell
```
layout/app-shell/
├── app-shell.component.ts         # Shell principal
├── app-shell.component.html       # Layout base
├── app-shell.component.css        # Estilos de layout
└── app-shell.component.spec.ts    # Tests
```

**Responsabilidades:**
- Estructura base de la aplicación
- Incluir header, footer y router-outlet
- Overlay de animaciones

#### 📱 Header Bar
```
layout/header-bar/
├── header-bar.component.ts        # Barra de navegación
├── header-bar.component.html      # Template del header
├── header-bar.component.css       # Estilos del header
└── header-bar.component.spec.ts   # Tests
```

**Responsabilidades:**
- Logo y navegación principal
- Barra de búsqueda
- Menú de usuario con dropdown
- Botón de carrito
- Menú de administración

### 🔄 Shared Module
> **Propósito**: Componentes reutilizables en toda la aplicación

#### 🃏 Product Card
```
shared/product-card/
├── product-card.component.ts      # Tarjeta de producto
├── product-card.component.html    # Template de tarjeta
├── product-card.component.css     # Estilos de tarjeta
└── product-card.component.spec.ts # Tests
```

**Features:**
- Compatible con API nueva y legacy
- Manejo robusto de imágenes
- Eventos para compra y edición
- Animaciones fly-to-cart integradas
- Botones contextuales según rol

#### 🔍 Product Preview
```
shared/product-preview/
├── product-preview.component.ts   # Modal de vista previa
├── product-preview.component.html # Template del modal
├── product-preview.component.css  # Estilos del modal
└── product-preview.component.spec.ts # Tests
```

**Features:**
- Modal estilo marketplace
- Galería de imágenes
- Información detallada
- Controles de cantidad
- Botones buy now / add to cart
- Información de envío

#### 🛒 Floating Cart
```
shared/floating-cart/
├── floating-cart.component.ts     # FAB del carrito
├── floating-cart.component.html   # Template del FAB
├── floating-cart.component.css    # Estilos del FAB
└── floating-cart.component.spec.ts # Tests
```

**Features:**
- Botón flotante (FAB)
- Contador reactivo de items
- Tooltip con total
- Animaciones de feedback
- Navegación al carrito

## 🗂️ Convenciones de Archivos

### 📏 Naming Conventions

#### Components
```
component-name.component.ts         # Clase del componente
component-name.component.html       # Template
component-name.component.css        # Estilos
component-name.component.spec.ts    # Tests unitarios
```

#### Services
```
service-name.service.ts             # Implementación del servicio
service-name.service.spec.ts        # Tests del servicio
```

#### Models
```
model-name.model.ts                 # Interfaces y tipos
model-name.interface.ts             # Solo interfaces
model-name.type.ts                  # Solo tipos
```

#### Pages
```
page-name.page.ts                   # Componente de página
page-name.page.html                 # Template de página
page-name.page.css                  # Estilos de página
page-name.page.spec.ts              # Tests de página
```

### 📂 Organización por Feature

Cada feature sigue esta estructura:
```
feature-name/
├── components/                     # Componentes específicos
├── services/                       # Servicios específicos
├── models/                         # Interfaces específicas
├── guards/                         # Guards específicos
└── feature-name.page.ts            # Página principal
```

## 🎯 Patrones de Arquitectura

### 🔄 Reactive Programming
- **Signals**: Para estado reactivo local
- **Observables**: Para streams de datos async
- **Computed**: Para valores derivados
- **RxJS**: Para operaciones complejas

### 🏛️ Dependency Injection
```typescript
// Service injection moderno
private authService = inject(AuthService);
private router = inject(Router);

// Constructor injection (legacy, evitar)
constructor(
  private authService: AuthService,
  private router: Router
) {}
```

### 🎭 Component Communication

#### Parent → Child
```typescript
// Input signals (preferido)
product = input.required<Product>();
canEdit = input(false);

// Input properties (legacy)
@Input() product!: Product;
@Input() canEdit = false;
```

#### Child → Parent
```typescript
// Output events (preferido)
productClick = output<Product>();
editProduct = output<Product>();

// Output properties (legacy)
@Output() productClick = new EventEmitter<Product>();
```

#### Service Communication
```typescript
// Signals para estado compartido
@Injectable()
class StateService {
  private _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();
  
  updateProducts(products: Product[]) {
    this._products.set(products);
  }
}
```

### 🔐 State Management

#### Local State (Component)
```typescript
// Signals para estado local
isLoading = signal(false);
selectedProduct = signal<Product | null>(null);

// Computed para valores derivados
totalPrice = computed(() => {
  return this.cartItems()
    .reduce((sum, item) => sum + item.price, 0);
});
```

#### Global State (Service)
```typescript
// Servicios con signals para estado global
@Injectable({
  providedIn: 'root'
})
class CartService {
  private _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly totalItems = computed(() => this._items().length);
}
```

## 🧪 Testing Structure

### 📋 Testing Organization
```
src/
├── app/
│   ├── **/*.spec.ts               # Unit tests
│   └── **/*.component.spec.ts     # Component tests
├── test/
│   ├── mocks/                     # Mock objects
│   ├── fixtures/                  # Test data
│   └── helpers/                   # Test utilities
└── e2e/
    ├── specs/                     # E2E test specs
    ├── pages/                     # Page objects
    └── fixtures/                  # E2E test data
```

### 🎯 Testing Patterns

#### Component Testing
```typescript
describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductCardComponent]
    });
    
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
  });

  it('should display product information', () => {
    const mockProduct = createMockProduct();
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent)
      .toContain(mockProduct.name);
  });
});
```

#### Service Testing
```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch products', () => {
    const mockProducts = [createMockProduct()];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('/api/products');
    req.flush(mockProducts);
  });
});
```

## 📦 Assets Organization

### 🖼️ Assets Structure
```
assets/
├── icon/                          # Iconos y logos
│   ├── logo.png                   # Logo principal
│   ├── logo.svg                   # Logo vectorial
│   ├── favicon.ico                # Favicon
│   ├── placeholder.png            # Imagen placeholder
│   └── placeholder.svg            # Placeholder vectorial
├── images/                        # Imágenes de la aplicación
│   ├── hero/                      # Imágenes hero
│   ├── backgrounds/               # Fondos
│   └── illustrations/             # Ilustraciones
├── fonts/                         # Fuentes personalizadas
└── data/                          # Datos estáticos (JSON)
    ├── mock-products.json         # Productos de prueba
    └── categories.json             # Categorías
```

### 🎨 Styles Organization
```
src/
├── styles.css                     # Estilos globales base
├── custom-theme.scss              # Tema Material personalizado
└── app/
    └── **/*.component.css         # Estilos por componente
```

## 🌍 Environment Configuration

### 🔧 Environment Files
```
environments/
├── environment.ts                 # Desarrollo
├── environment.prod.ts            # Producción
├── environment.staging.ts         # Staging
└── environment.test.ts            # Testing
```

### ⚙️ Configuration Pattern
```typescript
export const environment = {
  // Environment metadata
  production: false,
  version: '2.0.0',
  
  // API configuration
  apiUrl: 'https://localhost:7127/api',
  azureBlobUrl: 'https://azstaagromarket.blob.core.windows.net',
  
  // Authentication
  jwtKey: 'agromarket_jwt_token',
  tokenExpiry: 3600000, // 1 hour
  
  // Feature flags
  features: {
    enableAnimations: true,
    enablePWA: false,
    enableAnalytics: false
  },
  
  // Third-party services
  services: {
    analytics: {
      googleAnalyticsId: '',
      enableTracking: false
    }
  }
};
```

## 🔄 Build & Deployment

### 📋 Build Configuration
```json
// angular.json - Extractos relevantes
{
  "build": {
    "configurations": {
      "production": {
        "outputHashing": "all",
        "optimization": true,
        "sourceMap": false,
        "namedChunks": false,
        "aot": true,
        "extractLicenses": true,
        "budgets": [
          {
            "type": "initial",
            "maximumWarning": "2mb",
            "maximumError": "5mb"
          }
        ]
      }
    }
  }
}
```

### 🚀 Deployment Structure
```
dist/
├── agromarket-front/              # Build output
│   ├── assets/                    # Static assets
│   ├── *.js                       # JavaScript bundles
│   ├── *.css                      # CSS bundles
│   ├── index.html                 # Main HTML
│   └── *.map                      # Source maps (dev only)
```

---

**📚 Esta estructura está diseñada para escalabilidad, mantenibilidad y claridad.**

*Para más información sobre componentes específicos, revisa la documentación individual en cada carpeta.*