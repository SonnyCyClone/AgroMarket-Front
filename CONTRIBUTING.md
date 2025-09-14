# 🤝 Guía de Contribución - AgroMarket

¡Gracias por tu interés en contribuir a AgroMarket! Esta guía te ayudará a entender cómo contribuir efectivamente al proyecto.

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Contribuir](#cómo-contribuir)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Workflow de Desarrollo](#workflow-de-desarrollo)
5. [Estándares de Código](#estándares-de-código)
6. [Testing](#testing)
7. [Documentación](#documentación)
8. [Pull Requests](#pull-requests)

## 📜 Código de Conducta

Este proyecto sigue el [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct. Al participar, te comprometes a mantener un ambiente respetuoso y colaborativo.

### Comportamientos Esperados:
- ✅ Usar lenguaje inclusivo y respetuoso
- ✅ Respetar diferentes puntos de vista y experiencias
- ✅ Aceptar críticas constructivas
- ✅ Enfocarse en lo que es mejor para la comunidad
- ✅ Mostrar empatía hacia otros miembros

### Comportamientos No Tolerados:
- ❌ Lenguaje o imágenes sexualizadas
- ❌ Comentarios despectivos, insultos o ataques personales
- ❌ Acoso público o privado
- ❌ Publicar información privada sin consentimiento
- ❌ Cualquier conducta inapropiada en un entorno profesional

## 🚀 Cómo Contribuir

### Tipos de Contribuciones

1. **🐛 Reportar Bugs**
   - Usa el template de issue para bugs
   - Incluye pasos para reproducir
   - Proporciona información del sistema

2. **✨ Sugerir Features**
   - Usa el template de feature request
   - Explica el caso de uso
   - Proporciona ejemplos o mockups

3. **📚 Mejorar Documentación**
   - Corregir typos
   - Actualizar información obsoleta
   - Agregar ejemplos o clarificaciones

4. **💻 Contribuir Código**
   - Bug fixes
   - Nuevas features
   - Optimizaciones de performance
   - Refactoring

## ⚙️ Configuración del Entorno

### Prerrequisitos
```bash
Node.js >= 18.x
npm >= 9.x
Git >= 2.30
Angular CLI >= 18.x
```

### Configuración Inicial
```bash
# 1. Fork el repositorio en GitHub
# 2. Clonar tu fork
git clone https://github.com/tu-usuario/AgroMarket-Front.git
cd AgroMarket-Front

# 3. Agregar upstream remote
git remote add upstream https://github.com/SonnyCyClone/AgroMarket-Front.git

# 4. Instalar dependencias
npm install

# 5. Crear archivo de configuración
cp src/environments/environment.ts.example src/environments/environment.ts

# 6. Ejecutar aplicación
npm start
```

### Configuración de Tools
```bash
# Instalar herramientas de desarrollo
npm install -g @angular/cli
npm install -g typescript
npm install -g eslint
npm install -g prettier

# Configurar Git hooks (opcional pero recomendado)
npm run prepare
```

## 🔄 Workflow de Desarrollo

### 1. Sincronizar con Upstream
```bash
git checkout develop
git fetch upstream
git merge upstream/develop
git push origin develop
```

### 2. Crear Feature Branch
```bash
# Usar naming convention: type/description
git checkout -b feat/product-preview-modal
git checkout -b fix/cart-calculation-bug
git checkout -b docs/update-readme
```

### 3. Hacer Cambios
```bash
# Hacer commits frecuentes con mensajes descriptivos
git add .
git commit -m "feat: add product preview modal component"
```

### 4. Push y PR
```bash
git push origin feat/product-preview-modal
# Crear Pull Request en GitHub
```

## 📝 Estándares de Código

### TypeScript Guidelines

#### Naming Conventions
```typescript
// Classes, Interfaces, Types - PascalCase
class ProductService { }
interface User { }
type ProductType = 'ORGANIC' | 'CONVENTIONAL';

// Variables, Functions - camelCase
const userName = 'john';
function calculateTotal() { }

// Constants - SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Files - kebab-case
product-card.component.ts
user-auth.service.ts
```

#### Code Structure
```typescript
/**
 * Service for managing products
 * 
 * @description Handles CRUD operations for products
 * and provides caching functionality
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // 1. Public properties
  readonly products = signal<Product[]>([]);
  
  // 2. Private properties
  private http = inject(HttpClient);
  
  // 3. Constructor
  constructor() { }
  
  // 4. Public methods
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
  
  // 5. Private methods
  private validateProduct(product: Product): boolean {
    return !!product.name && !!product.price;
  }
}
```

### Angular Best Practices

#### Components
```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  // Usar input() y output() functions
  product = input.required<Product>();
  readonly canEdit = input(false);
  
  productClick = output<Product>();
  
  // Usar signals para estado local
  isLoading = signal(false);
  
  // Usar computed para valores derivados
  displayPrice = computed(() => 
    this.formatPrice(this.product().price)
  );
}
```

#### Templates
```html
<!-- Usar control flow nativo -->
@if (isLoading()) {
  <div class="loading">Cargando...</div>
}

@for (product of products(); track product.id) {
  <app-product-card [product]="product" />
}

<!-- Usar class y style bindings en lugar de ngClass/ngStyle -->
<div 
  [class.active]="isActive()"
  [style.color]="textColor()"
>
  Content
</div>
```

### CSS Guidelines

#### Architecture
```scss
// 1. Variables
:root {
  --primary-color: #28a745;
  --secondary-color: #6c757d;
  --border-radius: 8px;
}

// 2. Component styles
.product-card {
  // Layout
  display: flex;
  flex-direction: column;
  
  // Visual
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  // Interaction
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  // Responsive
  @media (max-width: 768px) {
    flex-direction: row;
  }
}
```

#### BEM Methodology
```scss
// Block
.product-card { }

// Element
.product-card__image { }
.product-card__title { }
.product-card__price { }

// Modifier
.product-card--featured { }
.product-card--sold-out { }
```

## 🧪 Testing

### Configuración de Tests
```bash
# Ejecutar tests
npm test                    # Watch mode
npm run test:ci            # Single run
npm run test:coverage      # Con coverage

# E2E tests
npm run e2e
```

### Unit Tests
```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch products', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Test Product', price: 100 }
    ];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

### Component Tests
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

  it('should display product name', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('.product-name');
    expect(nameElement.textContent).toContain('Test Product');
  });
});
```

### Coverage Requirements
- **Statements**: ≥ 80%
- **Branches**: ≥ 75%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

## 📚 Documentación

### JSDoc Comments
```typescript
/**
 * Calculates the total price including taxes
 * 
 * @param basePrice - The base price before taxes
 * @param taxRate - Tax rate as decimal (e.g., 0.19 for 19%)
 * @returns The total price including taxes
 * 
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.19);
 * console.log(total); // 119
 * ```
 */
function calculateTotal(basePrice: number, taxRate: number): number {
  return basePrice * (1 + taxRate);
}
```

### README Updates
- Mantener la documentación actualizada
- Incluir ejemplos de uso
- Documentar breaking changes
- Actualizar screenshots si es necesario

## 🔍 Pull Requests

### Checklist antes de crear PR
- [ ] ✅ Código sigue las convenciones del proyecto
- [ ] ✅ Tests pasan (`npm test`)
- [ ] ✅ Linting pasa (`npm run lint`)
- [ ] ✅ Build de producción funciona (`npm run build`)
- [ ] ✅ Documentación actualizada
- [ ] ✅ No hay conflictos con develop
- [ ] ✅ Commits siguen conventional commits

### Template de PR
```markdown
## 📝 Descripción
Breve descripción de los cambios realizados.

## 🔗 Issue Relacionado
Fixes #123

## 🧪 Testing
- [ ] Unit tests añadidos/actualizados
- [ ] E2E tests pasan
- [ ] Testing manual realizado

## 📸 Screenshots (si aplica)
Antes / Después

## ⚠️ Breaking Changes
Describir cualquier breaking change.

## 📋 Checklist
- [ ] Código sigue las convenciones
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Self-review completado
```

### Review Process
1. **Automated Checks**: CI/CD debe pasar
2. **Code Review**: Al menos 1 aprobación requerida
3. **Testing**: QA team valida funcionalidad
4. **Merge**: Squash merge a develop

## 🏷️ Versionado y Releases

### Semantic Versioning
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

### Conventional Commits
```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, no cambia funcionalidad
refactor: refactoring sin cambios funcionales
test: añadir o corregir tests
chore: cambios en build, deps, etc.
```

### Release Process
1. **Feature Freeze** en develop
2. **Release Candidate** testing
3. **Tag Release** con version number
4. **Deploy** a producción
5. **Post-release** monitoring

## 🆘 Obteniendo Ayuda

### Canales de Comunicación
- **🐛 Issues**: Para bugs y feature requests
- **💬 Discussions**: Para preguntas generales
- **📧 Email**: soporte@agromarket.com
- **💼 LinkedIn**: [AgroMarket Team](https://linkedin.com/company/agromarket)

### FAQ

**Q: ¿Cómo ejecuto la aplicación localmente?**
A: Ejecuta `npm install` y luego `npm start`. La app estará disponible en http://localhost:4200

**Q: ¿Qué hacer si los tests fallan?**
A: Primero ejecuta `npm test` para ver los detalles del error. Si necesitas ayuda, crea un issue.

**Q: ¿Cómo actualizo las dependencias?**
A: Usa `npm update` para updates menores. Para major updates, crea un PR separado.

**Q: ¿Puedo trabajar en múltiples features simultáneamente?**
A: Sí, pero usa branches separados para cada feature.

## 🎉 Reconocimientos

### Contributors
Lista de contribuidores será mantenida automáticamente.

### Hall of Fame
Reconocimiento especial para contribuidores destacados.

---

**¡Gracias por contribuir a AgroMarket! 🌾**

*Tu contribución ayuda a conectar el campo colombiano con la tecnología moderna.*