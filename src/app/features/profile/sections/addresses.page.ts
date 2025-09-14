/**
 * Página de direcciones - AgroMarket Profile
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="addresses-container">
      <div class="breadcrumb">
        <button class="agro-outline" (click)="goBack()">← Volver al perfil</button>
      </div>

      <header class="page-header">
        <h1>Direcciones</h1>
        <p>Gestiona las direcciones de envío y facturación</p>
      </header>

      <div class="addresses-content">
        <!-- Lista de direcciones -->
        <div class="addresses-section">
          <div class="section-header">
            <h3>Mis direcciones</h3>
            <button 
              class="agro-primary"
              id="btnAddAddress"
              (click)="showAddAddressForm()"
            >
              + Agregar dirección
            </button>
          </div>

          <div class="addresses-grid" *ngIf="addresses().length > 0">
            <div *ngFor="let address of addresses()" class="address-card">
              <div class="address-header">
                <div class="address-type">
                  <span class="type-icon">{{ getAddressIcon(address.type) }}</span>
                  <span class="type-name">{{ getAddressTypeName(address.type) }}</span>
                </div>
                <div class="address-badge" *ngIf="address.isDefault">
                  Predeterminada
                </div>
              </div>
              
              <div class="address-details">
                <h4>{{ address.name }}</h4>
                <p class="address-line">{{ address.address }}</p>
                <p class="address-location">{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
                <p class="address-phone" *ngIf="address.phone">📞 {{ address.phone }}</p>
              </div>
              
              <div class="address-actions">
                <button 
                  class="action-btn"
                  [class.active]="address.isDefault"
                  (click)="setDefaultAddress(address.id)"
                  title="Marcar como predeterminada"
                >
                  {{ address.isDefault ? '★ Predeterminada' : '☆ Marcar como predeterminada' }}
                </button>
                
                <div class="button-group">
                  <button 
                    class="agro-outline small"
                    (click)="editAddress(address)"
                  >
                    Editar
                  </button>
                  <button 
                    class="address-remove"
                    (click)="removeAddress(address.id)"
                    [disabled]="address.isDefault"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="addresses().length === 0">
            <div class="empty-icon">📍</div>
            <h4>No tienes direcciones guardadas</h4>
            <p>Agrega una dirección para facilitar tus compras</p>
            <button 
              class="agro-primary"
              (click)="showAddAddressForm()"
            >
              Agregar mi primera dirección
            </button>
          </div>
        </div>

        <!-- Formulario para agregar/editar dirección -->
        <div class="add-address-form" *ngIf="showingForm()">
          <h3>{{ isEditing() ? 'Editar dirección' : 'Agregar nueva dirección' }}</h3>
          
          <form [formGroup]="addressForm" (ngSubmit)="onSubmitAddress()" class="address-form">
            <div class="form-row">
              <div class="form-group">
                <label for="inpAddressType">Tipo de dirección *</label>
                <select 
                  id="inpAddressType"
                  formControlName="type"
                  class="form-input"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="home">🏠 Casa</option>
                  <option value="work">🏢 Trabajo</option>
                  <option value="other">📍 Otra</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="inpAddressName">Nombre de la dirección *</label>
                <input 
                  id="inpAddressName"
                  type="text" 
                  formControlName="name"
                  class="form-input"
                  placeholder="Ej: Casa de Juan, Oficina principal"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="inpStreetAddress">Dirección completa *</label>
                <input 
                  id="inpStreetAddress"
                  type="text" 
                  formControlName="address"
                  class="form-input"
                  placeholder="Calle, número, apartamento, referencias"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="inpCity">Ciudad *</label>
                <input 
                  id="inpCity"
                  type="text" 
                  formControlName="city"
                  class="form-input"
                  placeholder="Ciudad"
                >
              </div>
              
              <div class="form-group">
                <label for="inpState">Departamento/Estado *</label>
                <select 
                  id="inpState"
                  formControlName="state"
                  class="form-input"
                >
                  <option value="">Seleccionar departamento</option>
                  <option *ngFor="let state of colombianStates" [value]="state">
                    {{ state }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="inpZipCode">Código postal</label>
                <input 
                  id="inpZipCode"
                  type="text" 
                  formControlName="zipCode"
                  class="form-input"
                  placeholder="110111"
                  maxlength="6"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="inpAddressPhone">Teléfono de contacto</label>
                <input 
                  id="inpAddressPhone"
                  type="tel" 
                  formControlName="phone"
                  class="form-input"
                  placeholder="+57 300 123 4567"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    formControlName="isDefault"
                    id="chkDefaultAddress"
                  >
                  <span class="checkmark"></span>
                  Establecer como dirección predeterminada
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                class="agro-outline"
                (click)="cancelForm()"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="agro-primary"
                id="btnSaveAddress"
                [disabled]="addressForm.invalid || isLoading()"
              >
                <span *ngIf="isLoading()">Guardando...</span>
                <span *ngIf="!isLoading()">{{ isEditing() ? 'Actualizar' : 'Agregar' }} dirección</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .addresses-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .breadcrumb {
      margin-bottom: 24px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      color: var(--agro-text);
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: var(--agro-muted);
      margin: 0;
    }

    .addresses-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h3 {
      color: var(--agro-text);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .addresses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }

    .address-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .address-card:hover {
      border-color: var(--agro-green-400);
    }

    .address-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .address-type {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .type-icon {
      font-size: 1.2rem;
    }

    .type-name {
      font-weight: 600;
      color: var(--agro-text);
    }

    .address-badge {
      background: var(--agro-green-50);
      color: var(--agro-green-500);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .address-details {
      margin-bottom: 20px;
    }

    .address-details h4 {
      color: var(--agro-text);
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .address-line {
      color: var(--agro-text);
      margin: 0 0 4px 0;
      font-weight: 500;
    }

    .address-location {
      color: var(--agro-muted);
      margin: 0 0 8px 0;
    }

    .address-phone {
      color: var(--agro-muted);
      margin: 0;
      font-size: 0.9rem;
    }

    .address-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-btn {
      background: none;
      border: 1px solid #e5e7eb;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--agro-muted);
    }

    .action-btn:hover {
      border-color: var(--agro-green-400);
      color: var(--agro-green-500);
    }

    .action-btn.active {
      background: var(--agro-green-50);
      border-color: var(--agro-green-400);
      color: var(--agro-green-500);
      font-weight: 500;
    }

    .button-group {
      display: flex;
      gap: 8px;
    }

    .address-remove {
      background: none;
      border: 1px solid #dc3545;
      color: #dc3545;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .address-remove:hover:not(:disabled) {
      background: #dc3545;
      color: white;
    }

    .address-remove:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .empty-state h4 {
      color: var(--agro-text);
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: var(--agro-muted);
      margin: 0 0 24px 0;
    }

    .add-address-form {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .add-address-form h3 {
      color: var(--agro-text);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 24px 0;
    }

    .address-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-row:has(.full-width) {
      grid-template-columns: 1fr;
    }

    .form-row:has(.form-group:nth-child(3)) {
      grid-template-columns: 1fr 1fr 120px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-weight: 600;
      color: var(--agro-text);
      font-size: 0.95rem;
    }

    .form-input {
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--agro-green-400);
      box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.25);
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-weight: 400;
    }

    .checkbox-label input[type="checkbox"] {
      display: none;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid #e5e7eb;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark {
      background: var(--agro-green-400);
      border-color: var(--agro-green-400);
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
      content: '✓';
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .agro-outline.small {
      padding: 8px 12px;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .addresses-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .button-group {
        flex-direction: column;
      }
    }
  `]
})
export class AddressesPage {
  isLoading = signal(false);
  showingForm = signal(false);
  isEditing = signal(false);
  editingAddressId = signal<string | null>(null);

  addresses = signal<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'Casa principal',
      address: 'Calle 123 #45-67, Apartamento 301',
      city: 'Bogotá',
      state: 'Cundinamarca',
      zipCode: '110111',
      phone: '+57 300 123 4567',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'Oficina',
      address: 'Carrera 15 #85-32, Oficina 504',
      city: 'Bogotá',
      state: 'Cundinamarca',
      zipCode: '110221',
      isDefault: false
    }
  ]);

  colombianStates = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
    'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
    'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
    'Vaupés', 'Vichada'
  ];

  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      type: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required]],
      zipCode: [''],
      phone: [''],
      isDefault: [false]
    });
  }

  showAddAddressForm(): void {
    this.showingForm.set(true);
    this.isEditing.set(false);
    this.editingAddressId.set(null);
    this.addressForm.reset();
  }

  editAddress(address: Address): void {
    this.showingForm.set(true);
    this.isEditing.set(true);
    this.editingAddressId.set(address.id);
    
    this.addressForm.patchValue({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
      isDefault: address.isDefault
    });
  }

  cancelForm(): void {
    this.showingForm.set(false);
    this.isEditing.set(false);
    this.editingAddressId.set(null);
    this.addressForm.reset();
  }

  onSubmitAddress(): void {
    if (this.addressForm.valid) {
      this.isLoading.set(true);
      
      setTimeout(() => {
        const formValue = this.addressForm.value;
        
        if (this.isEditing()) {
          // Lógica de edición
          const updated = this.addresses().map(addr => {
            if (addr.id === this.editingAddressId()) {
              return { ...addr, ...formValue };
            }
            return formValue.isDefault ? { ...addr, isDefault: false } : addr;
          });
          this.addresses.set(updated);
          alert('Dirección actualizada correctamente');
        } else {
          // Lógica de creación
          const newAddress: Address = {
            id: Date.now().toString(),
            ...formValue
          };
          
          const currentAddresses = this.addresses();
          if (newAddress.isDefault) {
            currentAddresses.forEach(addr => addr.isDefault = false);
          }
          
          this.addresses.set([...currentAddresses, newAddress]);
          alert('Dirección agregada correctamente');
        }
        
        this.isLoading.set(false);
        this.cancelForm();
      }, 2000);
    }
  }

  setDefaultAddress(addressId: string): void {
    const updated = this.addresses().map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    this.addresses.set(updated);
    alert('Dirección establecida como predeterminada');
  }

  removeAddress(addressId: string): void {
    const address = this.addresses().find(a => a.id === addressId);
    if (address?.isDefault) {
      alert('No puedes eliminar la dirección predeterminada');
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      const updated = this.addresses().filter(a => a.id !== addressId);
      this.addresses.set(updated);
      alert('Dirección eliminada correctamente');
    }
  }

  getAddressIcon(type: string): string {
    const icons = {
      home: '🏠',
      work: '🏢',
      other: '📍'
    };
    return icons[type as keyof typeof icons] || '📍';
  }

  getAddressTypeName(type: string): string {
    const names = {
      home: 'Casa',
      work: 'Trabajo',
      other: 'Otra'
    };
    return names[type as keyof typeof names] || 'Otra';
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}