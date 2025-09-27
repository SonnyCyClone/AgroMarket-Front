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

### 🏗️ **Principios Arquitectónicos**

- **Standalone Components**: Arquitectura moderna sin NgModules
- **Signal-based State**: Estado reactivo con Angular Signals
- **Dependency Injection**: Patrón de inyección moderno con función `inject()`
- **Feature-First**: Organización por funcionalidades de negocio
- **API-First**: Diseño centrado en integración con APIs externas

### 📂 src/app/ - Estructura Principal

```
src/app/
├── 📁 core/                       # Funcionalidades centrales del sistema
│   ├── 📁 guards/                 # Protección de rutas
│   │   └── 📁 auth/               # Guards de autenticación y roles
│   ├── 📁 models/                 # Interfaces TypeScript y tipos de datos
│   │   ├── 📄 auth.model.ts       # Tipos de autenticación
│   │   ├── 📄 product.model.ts    # Modelos de productos
│   │   ├── � cart.model.ts       # Interfaces del carrito
│   │   └── 📄 user.model.ts       # Modelos de usuario
│   ├── �📁 services/               # Servicios de lógica de negocio
│   │   ├── 📁 auth/               # Autenticación y autorización
│   │   ├── 📁 cart/               # Gestión del carrito
│   │   ├── 📁 product/            # Operaciones de productos
│   │   ├── 📁 user/               # Gestión de usuarios
│   │   ├── 📁 http/               # Servicios HTTP base y especializados
│   │   ├── 📁 logging/            # Sistema de logging
│   │   └── 📁 animation/          # Servicios de animaciones
│   ├── 📁 interceptors/           # HTTP interceptors
│   │   └── 📄 apim.interceptor.ts # Interceptor de Azure APIM
│   └── 📁 mappers/                # Transformadores de datos API ↔ UI
├── 📁 features/                   # Módulos funcionales por dominio
│   ├── 📁 home/                   # Catálogo público de productos
│   ├── 📁 login/                  # Autenticación de usuarios
│   ├── 📁 cart/                   # Carrito y gestión de compras
│   ├── 📁 checkout/               # Proceso completo de compra
│   │   ├── 📁 checkout-shipping/  # Información de envío
│   │   ├── 📁 checkout-payment/   # Métodos de pago
│   │   ├── 📁 checkout-summary/   # Resumen de orden
│   │   ├── 📁 checkout-success/   # Confirmación exitosa
│   │   └── 📁 checkout-failure/   # Manejo de errores
│   ├── 📁 account/                # Gestión de perfil usuario
│   │   └── 📄 forgot-password.page.ts # Recuperación de contraseña
│   ├── 📁 product-edit/           # Edición de productos (agricultores)
│   ├── 📁 products-manage/        # Dashboard de productos del agricultor
│   ├── 📁 register-product/       # Registro de nuevos productos
│   ├── 📁 register-user/          # Registro de nuevos usuarios
│   ├── 📁 profile/                # Perfil y configuración de usuario
│   ├── 📁 support/                # Centro de ayuda y soporte
│   └── 📁 faq/                    # Preguntas frecuentes
├── 📁 layout/                     # Componentes de estructura UI
│   ├── 📁 app-shell/              # Shell principal con router-outlet
│   ├── 📁 header-bar/             # Navegación superior y menús
│   └── 📁 footer-bar/             # Pie de página con enlaces
├── 📁 shared/                     # Componentes reutilizables
│   ├── 📁 product-card/           # Tarjeta de producto con acciones
│   ├── 📁 product-preview/        # Modal de vista previa detallada
│   ├── 📁 floating-cart/          # FAB del carrito con contador
│   ├── 📁 fly-to-cart-overlay/    # Animaciones fly-to-cart
│   ├── 📁 search-bar/             # Barra de búsqueda inteligente
│   ├── 📁 sidebar-filter/         # Panel de filtros avanzados
│   ├── 📁 confirm-dialog/         # Diálogos de confirmación
│   ├── 📁 edit-product-modal/     # Modal de edición rápida
│   └── 📁 image-upload/           # Componente de subida de imágenes
├── 📁 environments/               # Configuraciones por entorno
│   ├── 📄 environment.ts          # Desarrollo local
│   └── 📄 environment.prod.ts     # Producción con Azure APIM
├── 📄 app.config.ts               # Configuración principal de la app
├── 📄 app.html                    # Template raíz
├── 📄 app.routes.ts               # Definición de rutas y guards
└── 📄 app.ts                      # Componente raíz standalone
```

## 🧩 Detalles por Módulo

### 🏠 Core Module - Sistema Central
> **Propósito**: Funcionalidades transversales, servicios singleton y configuración base

```
core/
├── guards/ ─────────────────────── # Protección y autorización de rutas
│   └── auth/
│       ├── auth.guard.ts          # Guard principal de autenticación
│       ├── role.guard.ts          # Autorización basada en roles (AGRICULTOR/COMPRADOR)
│       └── auth.guard.spec.ts     # Tests de guards
├── models/ ─────────────────────── # Contratos de datos TypeScript
│   ├── auth.model.ts              # LoginRequest, AuthResponse, UserRole
│   ├── cart.model.ts              # CartItem, CartSummary, CartState
│   ├── categoria.model.ts         # Categoria, CategoriaResponse
│   ├── product.model.ts           # Product, CreateProductRequest, ProductFilter
│   ├── crear-usuario.model.ts     # CreateUserRequest, UserRegistration
│   ├── rol.model.ts               # UserRole enum y Role interface
│   ├── tipo-documento.model.ts    # TipoDocumento para identificación
│   ├── tipo-producto.model.ts     # TipoProducto para clasificación
│   └── unidad.model.ts            # Unidad de medida (kg, unidad, litro)
├── services/ ───────────────────── # Servicios de lógica de negocio
│   ├── auth/ ──────────────────── # Sistema de autenticación
│   │   ├── auth.service.ts        # Login, logout, token management
│   │   ├── auth.api.ts           # Cliente API de autenticación
│   │   └── auth.interceptor.ts    # Interceptor JWT (deprecated, usar APIM)
│   ├── cart/ ──────────────────── # Sistema de carrito de compras
│   │   └── cart.service.ts        # Estado reactivo con signals
│   ├── http/ ──────────────────── # Clientes HTTP especializados
│   │   ├── base-http.service.ts   # Clase base para servicios HTTP
│   │   ├── product-api.service.ts # API client para productos
│   │   ├── auth-api.service.ts    # API client para autenticación
│   │   └── http.service.ts        # Utilidades HTTP generales
│   ├── product/ ───────────────── # Gestión de productos
│   │   └── product.service.ts     # CRUD productos, búsqueda, filtros
│   ├── user/ ──────────────────── # Gestión de usuarios
│   │   ├── user.service.ts        # Perfil, configuración usuario
│   │   └── user.api.ts           # Cliente API usuarios
│   ├── logging/ ───────────────── # Sistema de logging
│   │   └── logging.service.ts     # Logs estructurados con niveles
│   └── animation/ ─────────────── # Servicios de animaciones
│       └── fly-to-cart.service.ts # Coordinar animaciones fly-to-cart
├── interceptors/ ──────────────── # HTTP interceptors globales
│   └── apim.interceptor.ts        # Azure APIM: headers automáticos
└── mappers/ ───────────────────── # Transformadores de datos
    └── product.mapper.ts          # API DTO ↔ UI Model mapping
```

#### 🔑 **Características Clave del Core**

##### **🛡️ Security & Authentication**
- **JWT Management**: Almacenamiento seguro y renovación automática
- **Role-based Access**: Guards específicos para AGRICULTOR/COMPRADOR  
- **Azure APIM Integration**: Headers de suscripción automáticos
- **Token Validation**: Verificación de tokens expirados

##### **🌐 HTTP Layer**
```typescript
// Base HTTP Service Pattern
@Injectable()
export abstract class BaseHttpService {
  protected abstract getBaseUrl(): string;
  
  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl()}${endpoint}`);
  }
  
  protected postFormData<T>(endpoint: string, data: FormData): Observable<T> {
    return this.http.post<T>(`${this.getBaseUrl()}${endpoint}`, data);
  }
}

// Specialized API Services
export class ProductApiService extends BaseHttpService {
  protected getBaseUrl(): string {
    return environment.apiBaseUrl;
  }
  
  getProductsByAgricultor<T>(userId: string): Observable<T> {
    return this.get<T>(`${environment.api.productByAgricultor}/${userId}`);
  }
}
```

##### **⚡ Reactive State Management**
```typescript
// Signal-based State Pattern
@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  private _isLoading = signal(false);
  
  // Read-only signals para componentes
  readonly items = this._items.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  
  // Computed values
  readonly totalItems = computed(() => 
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
}
```

### 🎨 Features Module - Funcionalidades de Dominio
> **Propósito**: Páginas y flujos de usuario organizados por dominio de negocio

#### 🏠 **Home Page - Catálogo Público**
```
features/home/
├── home.page.ts                   # Componente principal con signals
├── home.page.html                 # Template responsivo
├── home.page.css                  # Estilos Grid + Flexbox
└── home.page.spec.ts              # Tests de integración
```

**🎯 Responsabilidades Técnicas:**
- **Estado Reactivo**: Gestión de productos con signals
- **Búsqueda en Tiempo Real**: Debounce y filtrado instantáneo
- **Paginación Virtual**: Lazy loading para performance
- **Integración de Componentes**: SearchBar + SidebarFilter + ProductCard
- **Optimización**: TrackBy functions para ngFor eficiente

```typescript
export class HomePage implements OnInit {
  // Signals para estado reactivo
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');
  
  // Computed para valores derivados
  displayProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.filteredProducts().filter(p => 
      p.variedad.toLowerCase().includes(term)
    );
  });
  
  totalProducts = computed(() => this.displayProducts().length);
}
```

#### 🛒 **Cart Page - Gestión de Compras**
```
features/cart/
├── cart.page.ts                   # Estado del carrito con signals
├── cart.page.html                 # Lista reactiva de items
├── cart.page.css                  # Animaciones y responsive
└── cart.page.spec.ts              # Tests unitarios completos
```

**🎯 Responsabilidades Técnicas:**
- **Estado Persistente**: Sincronización automática con localStorage
- **Cálculos Reactivos**: Subtotales, impuestos, descuentos en tiempo real
- **Validaciones**: Stock disponible y límites de cantidad
- **UX Optimizada**: Animaciones de feedback y estados de carga
- **Navegación Inteligente**: Redirección basada en estado del carrito

```typescript
export class CartPage implements OnInit {
  private cartService = inject(CartService);
  
  // Estado reactivo desde servicio
  cartItems = this.cartService.items;
  totalPrice = this.cartService.totalPrice;
  totalItems = this.cartService.totalItems;
  
  // Estados locales
  isUpdating = signal(false);
  
  updateQuantity(itemId: string, newQuantity: number): void {
    this.isUpdating.set(true);
    this.cartService.updateQuantity(itemId, newQuantity)
      .subscribe(() => this.isUpdating.set(false));
  }
}
```

#### 🔐 **Authentication System**

##### **🚪 Login Page**
```
features/login/
├── login.page.ts                  # Formulario reactivo con validaciones
├── login.page.html                # Form con Material Design
├── login.page.css                 # Estilos responsive + animaciones
└── login.page.spec.ts             # Tests de formulario y API
```

**Características:**
- **Reactive Forms**: FormBuilder con validaciones custom
- **Azure APIM Integration**: Autenticación a través de API Gateway
- **Role-based Redirect**: Navegación automática según rol de usuario
- **Error Handling**: Mensajes localizados en español

```typescript
export class LoginPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  isLoading = signal(false);
  errorMessage = signal('');
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.login(this.loginForm.value as LoginRequest)
        .subscribe({
          next: (response) => this.handleLoginSuccess(response),
          error: (error) => this.handleLoginError(error)
        });
    }
  }
}
```

##### **👥 User Registration**
```
features/register-user/
├── register-user.page.ts          # Multi-step form con validación
├── register-user.page.html        # Wizard-style form
├── register-user.page.css         # Stepper styles
└── register-user.page.spec.ts     # Tests de flujo completo
```

**Funcionalidades Avanzadas:**
- **Multi-step Form**: Wizard con validación por pasos
- **Role Selection**: Agricultor vs Comprador con UI diferenciada
- **Document Validation**: Validación de cédula colombiana
- **Image Upload**: Avatar del usuario con preview
- **Auto-login**: Login automático después del registro exitoso

#### 🛍️ **E-commerce Features**

##### **📦 Products Management (Agricultores)**
```
features/products-manage/
├── products-manage.page.ts        # Dashboard personal del agricultor
├── products-manage.page.html      # Grid con acciones CRUD
├── products-manage.page.css       # Layout tipo dashboard
└── products-manage.page.spec.ts   # Tests de autorización
```

**Características Específicas:**
- **User-specific Data**: Solo productos del agricultor autenticado
- **CRUD Operations**: Crear, editar, activar/desactivar productos
- **Bulk Actions**: Operaciones masivas sobre selección múltiple
- **Real-time Updates**: Actualización automática del estado

```typescript
export class ProductsManagePage implements OnInit {
  private productService = inject(ProductService);
  
  // Solo productos del usuario autenticado
  myProducts = signal<Product[]>([]);
  selectedProducts = signal<Set<string>>(new Set());
  
  ngOnInit(): void {
    const userId = localStorage.getItem('am_user_id');
    if (userId) {
      this.loadMyProducts(userId);
    }
  }
  
  private loadMyProducts(userId: string): void {
    this.productService.getProductsByAgricultor(userId)
      .subscribe(products => this.myProducts.set(products));
  }
}
```

##### **🛒 Checkout Flow**
```
features/checkout/
├── checkout-shipping/             # Información de envío
│   ├── checkout-shipping.page.ts  # Formulario de dirección
│   └── shipping-options.component.ts # Opciones de envío
├── checkout-payment/              # Métodos de pago
│   ├── checkout-payment.page.ts   # Integración con pasarelas
│   └── payment-methods.component.ts # Selección de método
├── checkout-summary/              # Resumen de orden
│   ├── checkout-summary.page.ts   # Revisión final
│   └── order-summary.component.ts # Desglose de precios
├── checkout-success/              # Confirmación exitosa
│   └── checkout-success.page.ts   # Página de éxito
└── checkout-failure/              # Manejo de errores
    └── checkout-failure.page.ts   # Recuperación de errores
```

**Flujo de Estados:**
1. **Shipping**: Validación de dirección y opciones de envío
2. **Payment**: Integración con PSE, tarjetas, etc.
3. **Summary**: Revisión final con posibilidad de editar
4. **Processing**: Estado de carga durante el pago
5. **Success/Failure**: Confirmación o manejo de errores

#### 🔧 **Utility Features**

##### **👤 User Profile & Account**
```
features/account/
├── forgot-password.page.ts        # Recuperación de contraseña
├── profile/                       # Gestión de perfil
│   ├── profile.models.ts         # Interfaces específicas
│   └── profile-edit.component.ts  # Edición de datos personales
└── account-settings/              # Configuraciones
    └── preferences.component.ts   # Preferencias de usuario
```

##### **📞 Support System**
```
features/support/
├── support.page.ts                # Centro de ayuda
└── components/
    ├── contact-form.component.ts  # Formulario de contacto
    └── ticket-system.component.ts # Sistema de tickets

features/faq/
└── faq.page.ts                    # Preguntas frecuentes con búsqueda
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

## 🧪 Testing Architecture

### 📋 **Testing Strategy & Organization**

```
src/
├── app/
│   ├── **/*.spec.ts               # Unit tests (services, utilities)
│   ├── **/*.component.spec.ts     # Component tests
│   └── **/*.integration.spec.ts   # Integration tests
├── test/
│   ├── mocks/                     # Mock implementations
│   │   ├── auth-service.mock.ts   # Auth service mock
│   │   ├── product-api.mock.ts    # API responses mock
│   │   └── environment.mock.ts    # Environment mock
│   ├── fixtures/                  # Test data factories
│   │   ├── product.fixtures.ts    # Product test data
│   │   ├── user.fixtures.ts       # User test data
│   │   └── cart.fixtures.ts       # Cart test scenarios
│   ├── helpers/                   # Test utilities
│   │   ├── component.helpers.ts   # Component testing utilities
│   │   ├── signal.helpers.ts      # Signal testing helpers
│   │   └── async.helpers.ts       # Async testing utilities
│   └── setup/
│       ├── test-setup.ts          # Global test configuration
│       └── custom-matchers.ts     # Custom Jest matchers
└── e2e/
    ├── specs/                     # E2E test scenarios
    │   ├── auth-flow.e2e.ts      # Login/logout flows
    │   ├── product-crud.e2e.ts   # Product management flows
    │   └── cart-checkout.e2e.ts  # Purchase flows
    ├── pages/                     # Page Object Models
    │   ├── login.page.ts         # Login page POM
    │   ├── products.page.ts      # Products page POM
    │   └── cart.page.ts          # Cart page POM
    └── fixtures/
        └── e2e-test-data.json     # E2E test data
```

### 🎯 **Testing Patterns & Best Practices**

#### **🧩 Component Testing with Signals**
```typescript
describe('ProductsManagePage', () => {
  let component: ProductsManagePage;
  let fixture: ComponentFixture<ProductsManagePage>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', 
      ['getProductsByAgricultor']);

    await TestBed.configureTestingModule({
      imports: [ProductsManagePage, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsManagePage);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  it('should load products for authenticated agricultor', fakeAsync(() => {
    // Given: Usuario autenticado
    spyOn(localStorage, 'getItem').and.returnValue('user123');
    const mockProducts = createMockProducts(3);
    mockProductService.getProductsByAgricultor.and.returnValue(of(mockProducts));

    // When: Inicializar componente
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Then: Productos cargados correctamente
    expect(component.products()).toEqual(mockProducts);
    expect(mockProductService.getProductsByAgricultor).toHaveBeenCalledWith('user123');
  }));

  it('should handle missing user authentication', () => {
    // Given: Usuario no autenticado
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // When: Intentar cargar productos
    component.ngOnInit();
    fixture.detectChanges();

    // Then: Mostrar mensaje de error
    expect(component.errorMessage()).toContain('inicia sesión');
    expect(mockProductService.getProductsByAgricultor).not.toHaveBeenCalled();
  });
});
```

#### **⚡ Service Testing with Azure APIM**
```typescript
describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductApiService,
        { provide: HTTP_INTERCEPTORS, useClass: ApimInterceptor, multi: true }
      ]
    });

    service = TestBed.inject(ProductApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get products by agricultor with APIM headers', () => {
    const userId = 'agricultor123';
    const mockProducts = createMockProducts(5);
    const expectedUrl = `${environment.apiBaseUrl}${environment.api.productByAgricultor}/${userId}`;

    service.getProductsByAgricultor<Product[]>(userId).subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(expectedUrl);
    
    // Verificar headers APIM automáticos
    expect(req.request.headers.get('Ocp-Apim-Subscription-Key'))
      .toBe(environment.apimKey);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockProducts);
  });

  it('should handle FormData uploads correctly', () => {
    const formData = new FormData();
    formData.append('variedad', 'Tomate');
    formData.append('precio', '5000');

    service.createProduct(formData).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}${environment.api.product}`);
    
    // Verificar que no se establece Content-Type para FormData
    expect(req.request.headers.has('Content-Type')).toBeFalsy();
    expect(req.request.headers.get('Ocp-Apim-Subscription-Key'))
      .toBe(environment.apimKey);
      
    req.flush({ success: true });
  });
});
```

#### **🔐 Authentication Testing**
```typescript
describe('AuthService Integration', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should login and store user data correctly', fakeAsync(() => {
    const loginRequest: LoginRequest = {
      email: 'agricultor@test.com',
      password: 'password123'
    };

    const mockResponse: AuthResponse = {
      token: 'jwt-token',
      userId: 'user123',
      rol: 'AGRICULTOR',
      email: 'agricultor@test.com'
    };

    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');

    authService.login(loginRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}${environment.api.authLogin}`);
    req.flush(mockResponse);
    tick();

    // Verificar almacenamiento de datos
    expect(localStorage.setItem).toHaveBeenCalledWith('agromarket_token', 'jwt-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('am_user_id', 'user123');
    
    // Verificar redirección basada en rol
    expect(router.navigate).toHaveBeenCalledWith(['/products/manage']);
  }));
});
```

#### **🛒 Signal-based Cart Testing**
```typescript
describe('CartService with Signals', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  it('should manage cart state reactively', () => {
    const product = createMockProduct();
    
    // Estado inicial
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.items()).toEqual([]);

    // Agregar producto
    const result = service.addToCart(product, { quantity: 2 });
    
    expect(result.success).toBe(true);
    expect(service.totalItems()).toBe(2);
    expect(service.totalPrice()).toBe(product.precio * 2);
    expect(service.items().length).toBe(1);

    // Verificar persistencia en localStorage
    const storedCart = JSON.parse(localStorage.getItem('agromarket_cart') || '[]');
    expect(storedCart).toHaveLength(1);
    expect(storedCart[0].quantity).toBe(2);
  });

  it('should handle stock validation', () => {
    const product = createMockProduct({ cantidadDisponible: 5 });
    
    // Intentar agregar más del stock disponible
    const result = service.addToCart(product, { quantity: 10 });
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('stock disponible');
    expect(service.items()).toEqual([]);
  });
});
```

#### **🌐 E2E Testing Strategy**
```typescript
// e2e/specs/product-management.e2e.ts
describe('Product Management Flow', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsManagePage;

  beforeEach(async () => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsManagePage(page);
    
    // Login como agricultor
    await loginPage.goto();
    await loginPage.loginAs('agricultor@test.com', 'password123');
  });

  it('should create, edit and manage products', async () => {
    // Navegar a gestión de productos
    await productsPage.goto();
    
    // Verificar que solo se muestran productos propios
    const initialCount = await productsPage.getProductCount();
    
    // Crear nuevo producto
    await productsPage.createNewProduct({
      variedad: 'Tomate Cherry E2E',
      descripcion: 'Producto creado en E2E test',
      precio: 8000,
      cantidadDisponible: 50
    });
    
    // Verificar incremento en contador
    const newCount = await productsPage.getProductCount();
    expect(newCount).toBe(initialCount + 1);
    
    // Verificar que el producto aparece en la lista
    await expect(productsPage.productCard('Tomate Cherry E2E')).toBeVisible();
    
    // Editar producto
    await productsPage.editProduct('Tomate Cherry E2E', {
      precio: 9000
    });
    
    // Verificar precio actualizado
    const updatedPrice = await productsPage.getProductPrice('Tomate Cherry E2E');
    expect(updatedPrice).toBe('$9.000');
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

## ☁️ Azure APIM Integration

### 🌐 **API Management Architecture**

La aplicación está completamente integrada con **Azure API Management (APIM)** para una arquitectura robusta y escalable en la nube.

#### **🔧 APIM Configuration**
```typescript
// Configuración centralizada en environments
export const environment = {
  production: false,
  
  // Azure APIM Gateway
  apiBaseUrl: 'https://az-apim-use-agromarket.azure-api.net',
  apimKey: 'd47baf874da1405a99db2198f4fb95bd',
  
  // Endpoints centralizados
  api: {
    // Productos
    product: '/api/v1/Producto',
    productSearch: (q: string) => `/api/v1/Producto/buscar/${encodeURIComponent(q)}`,
    productById: (id: number) => `/api/v1/Producto/${id}`,
    productByAgricultor: '/api/v1/Producto/agricultor', // 🆕 Filtrado por usuario
    
    // Autenticación
    authLogin: '/api/v1/Auth/login',
    userRegister: '/api/v1/Usuarios',
    
    // Catálogos
    category: '/api/Categoria',
    productTypeByCategory: (catId: number) => `/api/TipoProducto/Categoria/${catId}`,
    units: '/api/Uniodades'
  }
};
```

#### **🛡️ APIM Interceptor**
```typescript
@Injectable()
export class ApimInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo aplicar a peticiones del API base
    if (req.url.startsWith(environment.apiBaseUrl)) {
      
      // Clonar request y agregar headers APIM
      const apimRequest = req.clone({
        setHeaders: {
          'Ocp-Apim-Subscription-Key': environment.apimKey,
          // No establecer Content-Type para FormData (se auto-detecta)
          ...(this.isFormData(req.body) ? {} : { 'Content-Type': 'application/json' })
        }
      });
      
      return next.handle(apimRequest);
    }
    
    return next.handle(req);
  }
  
  private isFormData(body: any): boolean {
    return body instanceof FormData;
  }
}
```

#### **🔄 HTTP Service Pattern**
```typescript
// Base service para todos los API clients
@Injectable()
export abstract class BaseHttpService {
  protected http = inject(HttpClient);
  
  protected abstract getBaseUrl(): string;
  
  // GET requests con APIM automático
  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl()}${endpoint}`);
  }
  
  // FormData para uploads (productos con imágenes)
  protected postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.getBaseUrl()}${endpoint}`, formData);
    // Headers APIM se inyectan automáticamente via interceptor
  }
}

// Servicios especializados
@Injectable({ providedIn: 'root' })
export class ProductApiService extends BaseHttpService {
  protected getBaseUrl(): string {
    return environment.apiBaseUrl;
  }
  
  // Nuevo endpoint para productos por agricultor
  getProductsByAgricultor<T>(userId: string): Observable<T> {
    const endpoint = `${environment.api.productByAgricultor}/${userId}`;
    return this.get<T>(endpoint);
  }
}
```

### 🌍 Environment Configuration

#### **� Environment Files Structure**
```
environments/
├── environment.ts                 # Desarrollo local
├── environment.prod.ts            # Producción Azure APIM
├── environment.staging.ts         # Staging environment
└── environment.test.ts            # Testing con mocks
```

#### **⚙️ Production Configuration**
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  version: '2.1.0',
  
  // Azure APIM Production Gateway
  apiBaseUrl: 'https://az-apim-use-agromarket.azure-api.net',
  apimKey: process.env['APIM_SUBSCRIPTION_KEY'] || 'fallback-key',
  
  // Centralized API endpoints
  api: {
    product: '/api/v1/Producto',
    productSearch: (q: string) => `/api/v1/Producto/buscar/${encodeURIComponent(q)}`,
    productById: (id: number) => `/api/v1/Producto/${id}`,
    productByAgricultor: '/api/v1/Producto/agricultor',
    authLogin: '/api/v1/Auth/login',
    userRegister: '/api/v1/Usuarios',
    category: '/api/Categoria',
    productTypeByCategory: (catId: number) => `/api/TipoProducto/Categoria/${catId}`,
    units: '/api/Uniodades'
  },
  
  // Storage keys
  storageKeys: {
    authToken: 'agromarket_token',
    userId: 'am_user_id',
    cart: 'agromarket_cart',
    userPreferences: 'user_preferences'
  },
  
  // Feature flags para producción
  features: {
    enableAnimations: true,
    enablePWA: true,
    enableAnalytics: true,
    enableOfflineMode: false,
    debugMode: false
  },
  
  // Third-party integrations
  services: {
    analytics: {
      googleAnalyticsId: 'GA_TRACKING_ID',
      enableTracking: true
    },
    monitoring: {
      applicationInsights: 'APP_INSIGHTS_KEY',
      enableLogging: true
    }
  }
};
```

#### **🔧 Development vs Production**

| Aspecto | Development | Production |
|---------|-------------|-------------|
| **API Base** | Local/Mock | Azure APIM Gateway |
| **APIM Key** | Development key | Production subscription |
| **Logging** | Console verbose | Application Insights |
| **Error Handling** | Developer-friendly | User-friendly messages |
| **Caching** | Disabled | Enabled with TTL |
| **Bundle Size** | Source maps included | Optimized and minified |

#### **🔑 Security Configuration**
```typescript
// Configuración de seguridad por entorno
const securityConfig = {
  development: {
    enableCSP: false,
    allowUnsafeEval: true,
    enableSourceMaps: true
  },
  
  production: {
    enableCSP: true,
    allowUnsafeEval: false,
    enableSourceMaps: false,
    enableHttps: true,
    tokenExpiry: 3600000, // 1 hour
    refreshTokenExpiry: 604800000 // 7 days
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

## 🚀 Performance & Optimization

### ⚡ **Angular Optimization Strategies**

#### **📦 Bundle Optimization**
```json
// angular.json - Production build configuration
{
  "production": {
    "optimization": true,
    "outputHashing": "all",
    "sourceMap": false,
    "namedChunks": false,
    "aot": true,
    "extractLicenses": true,
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "2mb",
        "maximumError": "5mb"
      },
      {
        "type": "anyComponentStyle",
        "maximumWarning": "6kb",
        "maximumError": "10kb"
      }
    ]
  }
}
```

#### **🔄 Lazy Loading Strategy**
```typescript
// app.routes.ts - Route-based code splitting
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  
  // Lazy-loaded feature modules
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.page').then(m => m.CartPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then(m => m.checkoutRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'products/manage',
    loadComponent: () => import('./features/products-manage/products-manage.page')
      .then(m => m.ProductsManagePage),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: 'AGRICULTOR' }
  }
];
```

#### **🎯 OnPush Change Detection**
```typescript
@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ProductCardComponent {
  // Uso de signals para optimizar change detection
  product = input.required<Product>();
  canEdit = input(false);
  
  // Computed values para evitar cálculos repetitivos
  displayPrice = computed(() => this.formatPrice(this.product().precio));
  hasDiscount = computed(() => this.product().descuento > 0);
  
  // TrackBy function para ngFor optimizado
  trackByProductId = (index: number, product: Product) => product.id;
}
```

### 🔒 **Security Best Practices**

#### **🛡️ Security Headers & CSP**
```typescript
// CSP Configuration para producción
const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://az-apim-use-agromarket.azure-api.net;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://azstaagromarket.blob.core.windows.net;
    connect-src 'self' https://az-apim-use-agromarket.azure-api.net;
    font-src 'self';
  `,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

#### **🔐 Token Security**
```typescript
// Secure token storage and validation
@Injectable()
export class TokenService {
  private readonly TOKEN_KEY = 'agromarket_token';
  private readonly USER_ID_KEY = 'am_user_id';
  
  storeTokenSecurely(token: string, userId: string): void {
    // Validar formato JWT
    if (!this.isValidJWT(token)) {
      throw new Error('Token JWT inválido');
    }
    
    // Almacenar con timestamp para expiración
    const tokenData = {
      token,
      timestamp: Date.now(),
      expiresIn: this.getTokenExpiry(token)
    };
    
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
    localStorage.setItem(this.USER_ID_KEY, userId);
  }
  
  private isValidJWT(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3 && this.isValidBase64(parts[1]);
  }
}
```

### 📊 **Monitoring & Analytics**

#### **� Application Insights Integration**
```typescript
// Monitoring service para Azure Application Insights
@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private appInsights?: ApplicationInsights;
  
  constructor() {
    if (environment.production && environment.services.monitoring.applicationInsights) {
      this.initializeAppInsights();
    }
  }
  
  trackEvent(name: string, properties?: Record<string, any>): void {
    if (this.appInsights) {
      this.appInsights.trackEvent({ name }, properties);
    }
  }
  
  trackError(error: Error, severityLevel?: SeverityLevel): void {
    if (this.appInsights) {
      this.appInsights.trackException({ 
        exception: error, 
        severityLevel 
      });
    }
    
    // Fallback logging para desarrollo
    console.error('Application Error:', error);
  }
  
  trackPageView(name: string, uri?: string): void {
    if (this.appInsights) {
      this.appInsights.trackPageView({ name, uri });
    }
  }
}
```

#### **⚠️ Error Boundary & Global Error Handler**
```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private monitoring: MonitoringService,
    private snackBar: MatSnackBar
  ) {}
  
  handleError(error: any): void {
    // Log error para monitoring
    this.monitoring.trackError(error);
    
    // Determinar tipo de error y respuesta apropiada
    if (this.isHttpError(error)) {
      this.handleHttpError(error);
    } else if (this.isJSError(error)) {
      this.handleJavaScriptError(error);
    } else {
      this.handleGenericError(error);
    }
  }
  
  private handleHttpError(error: HttpErrorResponse): void {
    const userMessage = this.getHttpErrorMessage(error.status);
    this.snackBar.open(userMessage, 'Cerrar', { duration: 5000 });
  }
  
  private getHttpErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      401: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      403: 'No tienes permisos para realizar esta acción.',
      404: 'El recurso solicitado no existe.',
      500: 'Error interno del servidor. Intenta nuevamente más tarde.'
    };
    
    return messages[status] || 'Error de conexión. Verifica tu internet.';
  }
}
```

## 🔄 CI/CD & Deployment

### 🏗️ **Build Pipeline**
```yaml
# azure-pipelines.yml
trigger:
- main
- develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '18.x'
  angularCliVersion: 'latest'

stages:
- stage: Build
  jobs:
  - job: BuildAndTest
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: $(nodeVersion)
    
    - script: npm ci
      displayName: 'Install dependencies'
    
    - script: npm run lint
      displayName: 'Lint code'
    
    - script: npm run test -- --code-coverage --watch=false
      displayName: 'Run unit tests'
    
    - script: npm run build:prod
      displayName: 'Build production'
    
    - task: PublishTestResults@2
      inputs:
        testResultsFormat: 'JUnit'
        testResultsFiles: 'coverage/junit.xml'
    
    - task: PublishCodeCoverageResults@1
      inputs:
        codeCoverageTool: 'Cobertura'
        summaryFileLocation: 'coverage/cobertura-coverage.xml'

- stage: Deploy
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - job: DeployToAzure
    steps:
    - task: AzureStaticWebApp@0
      inputs:
        app_location: 'dist/agromarket-front'
        api_location: ''
        output_location: ''
```

### 🌐 **Deployment Environments**

#### **🧪 Development**
- **URL**: `http://localhost:4200`
- **APIM**: Development gateway
- **Database**: Local/Mock data
- **Monitoring**: Console logging only

#### **🎭 Staging** 
- **URL**: `https://staging-agromarket.azurestaticapps.net`
- **APIM**: Staging gateway with test data
- **Database**: Staging database with anonymized data
- **Monitoring**: Limited Application Insights

#### **🚀 Production**
- **URL**: `https://agromarket.azurestaticapps.net`
- **APIM**: Production gateway with full security
- **Database**: Production database with backups
- **Monitoring**: Full Application Insights + alerts

## 📋 Code Quality & Standards

### 🎨 **Coding Standards**

#### **📝 Naming Conventions**
```typescript
// ✅ Correcto
export class ProductManagementService { }     // PascalCase para clases
export interface ProductFilter { }           // PascalCase para interfaces
const apiBaseUrl = 'https://api.example.com'; // camelCase para variables
const MAX_RETRY_ATTEMPTS = 3;                // SCREAMING_SNAKE_CASE para constantes

// ❌ Incorrecto
export class productmanagementservice { }     // Sin PascalCase
export interface product_filter { }          // Snake case en interface
const APIBaseURL = 'https://api.example.com'; // PascalCase en variable
```

#### **🔧 ESLint Configuration**
```json
// .eslintrc.json
{
  "extends": [
    "@angular-eslint/recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@angular-eslint/component-class-suffix": "error",
    "@angular-eslint/directive-class-suffix": "error",
    "@angular-eslint/no-empty-lifecycle-method": "error",
    "@angular-eslint/use-lifecycle-interface": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### �📚 **Documentation Standards**

#### **🎯 Component Documentation**
```typescript
/**
 * Tarjeta de producto con acciones contextuales
 * 
 * @description Componente reutilizable para mostrar información de producto
 * con botones de acción que varían según el rol del usuario y contexto.
 * 
 * @example
 * ```html
 * <app-product-card 
 *   [product]="product"
 *   [canEdit]="userCanEdit"
 *   (productClick)="onProductClick($event)"
 *   (editProduct)="onEditProduct($event)"
 *   (addToCart)="onAddToCart($event)">
 * </app-product-card>
 * ```
 * 
 * @since 2.0.0
 * @author AgroMarket Team
 */
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  /**
   * Producto a mostrar en la tarjeta
   */
  product = input.required<Product>();
  
  /**
   * Indica si el usuario puede editar este producto
   * @default false
   */
  canEdit = input(false);
}
```

---

## 🎯 **Resumen Arquitectónico**

**AgroMarket Frontend** es una aplicación Angular moderna diseñada con los siguientes principios:

### ✨ **Características Destacadas**
- 🏗️ **Standalone Components**: Arquitectura moderna sin NgModules
- ⚡ **Signal-based State**: Estado reactivo con Angular Signals  
- ☁️ **Azure APIM Integration**: Integración completa con Azure API Management
- 🔐 **Role-based Security**: Sistema de roles (AGRICULTOR/COMPRADOR)
- 🛒 **E-commerce Complete**: Carrito, checkout y gestión de productos
- 📱 **Mobile-first Design**: Responsive y optimizado para móviles

### 🏛️ **Patrones Arquitectónicos**
- **Feature-first Organization**: Código organizado por dominio de negocio
- **Dependency Injection**: Inyección moderna con función `inject()`
- **Reactive Programming**: RxJS + Signals para programación reactiva
- **API-first Approach**: Diseño centrado en integración con APIs
- **Security by Design**: Seguridad integrada desde el diseño

### 🚀 **Tecnologías Core**
- **Angular 20+** con Standalone Components
- **TypeScript 5+** con strict mode
- **Azure API Management** para gateway de APIs
- **Angular Material** para componentes UI
- **RxJS** para programación reactiva
- **Jasmine + Karma** para testing

---

**📚 Esta arquitectura está diseñada para escalabilidad, mantenibilidad, seguridad y experiencia de usuario excepcional.**

**🔗 Enlaces Útiles:**
- [Documentación de Angular](https://angular.dev)
- [Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)

*Para más información sobre componentes específicos, revisa la documentación individual en cada carpeta y los comentarios JSDoc en el código.*