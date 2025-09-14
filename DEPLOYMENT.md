# 🚀 Guía de Despliegue - AgroMarket Frontend

Esta guía proporciona instrucciones detalladas para desplegar la aplicación AgroMarket Frontend en diferentes entornos.

## 📋 Prerequisitos

### 🛠️ Herramientas Requeridas
- **Node.js**: v18.19.0 o superior
- **npm**: v9.0.0 o superior
- **Angular CLI**: v20.2.1
- **Git**: Para control de versiones

### 🌐 Cuentas de Servicio
- **Azure**: Para almacenamiento de imágenes (Blob Storage)
- **Hosting Provider**: Netlify, Vercel, Azure Static Web Apps, etc.

## 🏗️ Preparación del Build

### 1. Instalación de Dependencias
```bash
# Instalar dependencias
npm install

# Verificar versiones
node --version
npm --version
ng version
```

### 2. Configuración de Entornos

#### Desarrollo
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7127/api',
  azureBlobUrl: 'https://azstaagromarket.blob.core.windows.net',
  jwtKey: 'agromarket_jwt_token',
  features: {
    enableAnimations: true,
    enablePWA: false
  }
};
```

#### Producción
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://agromarket-api.azurewebsites.net/api',
  azureBlobUrl: 'https://azstaagromarket.blob.core.windows.net',
  jwtKey: 'agromarket_jwt_token',
  features: {
    enableAnimations: true,
    enablePWA: true
  }
};
```

### 3. Build de Producción
```bash
# Build para producción
ng build --configuration=production

# Verificar salida
ls -la dist/agromarket-front/
```

## 🌐 Despliegue en Netlify

### 📝 Configuración Manual

1. **Subir Archivos**:
   - Comprimir carpeta `dist/agromarket-front/`
   - Subir a Netlify Dashboard
   - Descomprimir en el directorio raíz

2. **Configurar Redirects**:
   ```toml
   # netlify.toml
   [build]
     publish = "dist/agromarket-front"
     command = "npm run build:prod"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### 🔄 Despliegue Automático (Git)

1. **Conectar Repositorio**:
   - Vincular repositorio GitHub
   - Configurar rama principal (main/master)

2. **Configurar Build**:
   ```yaml
   # Build settings
   Build command: npm run build:prod
   Publish directory: dist/agromarket-front
   ```

3. **Variables de Entorno**:
   ```bash
   NODE_VERSION=18.19.0
   NPM_VERSION=9.0.0
   ANGULAR_CLI_VERSION=20.2.1
   ```

## ☁️ Despliegue en Vercel

### 📦 Configuración
```json
{
  "version": 2,
  "name": "agromarket-front",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/agromarket-front"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 🛠️ Scripts de Build
```json
{
  "scripts": {
    "build": "ng build --configuration=production",
    "vercel-build": "ng build --configuration=production"
  }
}
```

## 🔵 Despliegue en Azure Static Web Apps

### 🔧 Azure CLI Setup
```bash
# Instalar Azure CLI
az login
az account set --subscription "your-subscription-id"

# Crear Static Web App
az staticwebapp create \
  --name agromarket-front \
  --resource-group agromarket-rg \
  --source https://github.com/usuario/agromarket-front \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --output-location "dist/agromarket-front"
```

### ⚙️ GitHub Actions Workflow
```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.19.0'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build Angular app
        run: npm run build:prod
        
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist/agromarket-front"
```

## 🐳 Despliegue con Docker

### 📝 Dockerfile
```dockerfile
# Dockerfile
# Etapa 1: Build
FROM node:18.19.0-alpine AS build

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build:prod

# Etapa 2: Serve con nginx
FROM nginx:alpine

# Copiar build a nginx
COPY --from=build /app/dist/agromarket-front /usr/share/nginx/html

# Configurar nginx para SPAs
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 🔧 Nginx Configuration
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/css application/javascript application/json image/svg+xml;
        gzip_comp_level 9;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;

        # Handle Angular routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security for sensitive files
        location ~ /\. {
            deny all;
        }
    }
}
```

### 🚀 Docker Commands
```bash
# Build imagen
docker build -t agromarket-front .

# Ejecutar contenedor
docker run -d -p 80:80 --name agromarket-app agromarket-front

# Docker Compose
docker-compose up -d
```

### 📋 docker-compose.yml
```yaml
version: '3.8'

services:
  agromarket-front:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  # Si necesitas nginx como proxy
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
    depends_on:
      - agromarket-front
```

## 🔄 CI/CD con GitHub Actions

### 🛠️ Workflow Completo
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '18.19.0'
  WORKING_DIRECTORY: './'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Build application
        run: npm run build:prod

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build for production
        run: npm run build:prod
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist/agromarket-front'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔍 Monitoreo y Logs

### 📊 Configuración de Analytics
```typescript
// src/app/core/services/analytics.service.ts
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor() {
    if (environment.production && environment.features.enableAnalytics) {
      this.initGoogleAnalytics();
    }
  }

  private initGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.services.analytics.googleAnalyticsId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', environment.services.analytics.googleAnalyticsId);
  }

  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (environment.production && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  }
}
```

### 🔧 Error Tracking (Sentry)
```typescript
// src/main.ts
import * as Sentry from '@sentry/angular';

if (environment.production) {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'production',
    tracesSampleRate: 0.1
  });
}
```

## 🔒 Configuración de Seguridad

### 🛡️ Content Security Policy
```html
<!-- src/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               img-src 'self' data: https://azstaagromarket.blob.core.windows.net;
               connect-src 'self' https://agromarket-api.azurewebsites.net;">
```

### 🔐 HTTPS y Certificados
```nginx
# nginx-ssl.conf
server {
    listen 443 ssl http2;
    server_name agromarket.com www.agromarket.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name agromarket.com www.agromarket.com;
    return 301 https://$server_name$request_uri;
}
```

## ⚡ Optimización de Performance

### 🚀 Build Optimizations
```json
{
  "configurations": {
    "production": {
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true,
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
}
```

### 🎯 Lazy Loading
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES)
  }
];
```

## 🧪 Testing en Producción

### 🔍 Health Check
```typescript
// src/app/core/services/health.service.ts
@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private http = inject(HttpClient);

  checkHealth() {
    return this.http.get(`${environment.apiUrl}/health`).pipe(
      timeout(5000),
      catchError(() => of({ status: 'error', message: 'API no disponible' }))
    );
  }
}
```

### 📊 Performance Monitoring
```typescript
// src/app/core/services/performance.service.ts
@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  measureNavigationTiming() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint()
      };
      
      this.sendMetrics(metrics);
    }
  }

  private getFirstPaint() {
    const paint = performance.getEntriesByType('paint');
    return paint.find(entry => entry.name === 'first-paint')?.startTime || 0;
  }

  private getFirstContentfulPaint() {
    const paint = performance.getEntriesByType('paint');
    return paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
  }

  private sendMetrics(metrics: any) {
    // Enviar métricas a servicio de monitoreo
    console.log('Performance metrics:', metrics);
  }
}
```

## 🔄 Rollback Strategy

### 📦 Version Management
```bash
# Etiquetar release
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin v2.0.0

# Rollback a versión anterior
git checkout v1.9.0
npm run build:prod
# Deploy de la versión anterior
```

### 🔄 Blue-Green Deployment
```yaml
# Ejemplo con múltiples entornos
production:
  - slot: blue (activo)
    url: https://agromarket.com
  - slot: green (staging)
    url: https://green.agromarket.com

# Deploy a green, test, luego swap
```

## 📋 Checklist Pre-Deploy

### ✅ Verificaciones Técnicas
- [ ] Build exitoso sin errores
- [ ] Tests unitarios pasando
- [ ] Tests E2E pasando
- [ ] Bundle size dentro de límites
- [ ] No console.log en producción
- [ ] Variables de entorno configuradas
- [ ] APIs accesibles desde producción

### ✅ Verificaciones de Contenido
- [ ] Imágenes optimizadas
- [ ] Textos finales sin placeholders
- [ ] Enlaces funcionando
- [ ] Formularios validados
- [ ] 404 page configurada

### ✅ Verificaciones de Seguridad
- [ ] HTTPS configurado
- [ ] Headers de seguridad
- [ ] CSP configurado
- [ ] No credenciales hardcodeadas
- [ ] CORS configurado correctamente

---

**🚀 ¡Listo para producción!**

*Esta guía cubre los escenarios más comunes. Para casos específicos, consulta la documentación del proveedor de hosting correspondiente.*