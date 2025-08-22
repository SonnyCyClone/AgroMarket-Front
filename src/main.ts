import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ProductService } from './app/core/services/product/product.service';

bootstrapApplication(App, appConfig)
  .then(appRef => {
    // Initialize ProductService to seed data if needed
    const productService = appRef.injector.get(ProductService);
    return appRef;
  })
  .catch((err) => console.error(err));
