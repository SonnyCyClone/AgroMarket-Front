/**
 * Página de soporte - AgroMarket
 */

import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
  type: 'text' | 'options' | 'typing';
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  message: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="support-container">
      <header class="support-header">
        <h1>Soporte al cliente</h1>
        <p>Estamos aquí para ayudarte. Chatea con nuestro equipo de soporte</p>
      </header>

      <div class="support-content">
        <!-- Panel de información -->
        <div class="info-panel">
          <div class="contact-info">
            <h3>📞 Contacto directo</h3>
            <div class="contact-item">
              <span class="contact-label">Teléfono:</span>
              <span class="contact-value">+57 (1) 234-5678</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Email:</span>
              <span class="contact-value">soporte@agromarket.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Horario:</span>
              <span class="contact-value">Lun-Vie 8AM-6PM, Sáb 9AM-2PM</span>
            </div>
          </div>

          <div class="quick-actions">
            <h3>⚡ Acciones rápidas</h3>
            <div class="actions-grid">
              <button 
                *ngFor="let action of quickActions" 
                class="action-btn"
                (click)="sendQuickMessage(action.message)"
              >
                <span class="action-icon">{{ action.icon }}</span>
                <span class="action-label">{{ action.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Chat -->
        <div class="chat-container">
          <div class="chat-header">
            <div class="agent-info">
              <div class="agent-avatar">👩‍💼</div>
              <div class="agent-details">
                <h4>María García</h4>
                <span class="agent-status">En línea • Agente de soporte</span>
              </div>
            </div>
            <div class="chat-status">
              <span class="status-indicator"></span>
              <span>Conectado</span>
            </div>
          </div>

          <div class="chat-messages" #chatMessages>
            <div *ngFor="let message of messages()" class="message" [class.user]="message.isUser">
              <div class="message-bubble" [class.user]="message.isUser">
                <div class="message-content" *ngIf="message.type === 'text'">
                  {{ message.content }}
                </div>
                
                <div class="typing-indicator" *ngIf="message.type === 'typing'">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                
                <div class="message-timestamp">
                  {{ message.timestamp | date:'HH:mm' }}
                </div>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <div class="input-container">
              <input 
                type="text" 
                placeholder="Escribe tu mensaje..." 
                [(ngModel)]="currentMessage"
                (keydown.enter)="sendMessage()"
                id="inpSupportMessage"
                class="message-input"
                [disabled]="isTyping()"
              >
              <button 
                class="send-button"
                (click)="sendMessage()"
                [disabled]="!currentMessage.trim() || isTyping()"
                id="btnSupportSend"
              >
                <span *ngIf="!isTyping()">📤</span>
                <span *ngIf="isTyping()" class="loading-spinner">⏳</span>
              </button>
            </div>
            
            <div class="chat-features">
              <button class="feature-btn" (click)="attachFile()">
                📎 Adjuntar archivo
              </button>
              <button class="feature-btn" (click)="sendScreenshot()">
                📸 Captura de pantalla
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de satisfacción (aparece al final del chat) -->
      <div class="satisfaction-modal" *ngIf="showSatisfaction()" (click)="closeSatisfaction()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h3>¿Cómo calificarías nuestro soporte?</h3>
          <div class="rating-stars">
            <button 
              *ngFor="let star of [1,2,3,4,5]" 
              class="star-btn"
              [class.active]="star <= selectedRating()"
              (click)="setRating(star)"
            >
              ⭐
            </button>
          </div>
          <textarea 
            placeholder="Déjanos tus comentarios (opcional)"
            [(ngModel)]="feedbackComment"
            class="feedback-input"
          ></textarea>
          <div class="modal-actions">
            <button class="agro-outline" (click)="closeSatisfaction()">
              Saltar
            </button>
            <button class="agro-primary" (click)="submitFeedback()">
              Enviar feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .support-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .support-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .support-header h1 {
      color: var(--agro-text);
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 12px 0;
    }

    .support-header p {
      color: var(--agro-muted);
      font-size: 1.1rem;
      margin: 0;
    }

    .support-content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 24px;
      height: 600px;
    }

    .info-panel {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .contact-info,
    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .contact-info h3,
    .quick-actions h3 {
      color: var(--agro-text);
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 16px 0;
    }

    .contact-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    .contact-label {
      font-weight: 500;
      color: var(--agro-muted);
      font-size: 0.9rem;
    }

    .contact-value {
      color: var(--agro-text);
      font-weight: 600;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      border-color: var(--agro-green-400);
      background: var(--agro-green-50);
    }

    .action-icon {
      font-size: 1.2rem;
    }

    .action-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--agro-text);
    }

    .chat-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-header {
      background: var(--agro-green-500);
      color: white;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .agent-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .agent-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .agent-details h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .agent-status {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .chat-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f8fafc;
    }

    .message {
      display: flex;
      justify-content: flex-start;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message-bubble {
      max-width: 70%;
      background: white;
      padding: 12px 16px;
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .message-bubble.user {
      background: var(--agro-green-500);
      color: white;
      border-bottom-left-radius: 18px;
      border-bottom-right-radius: 4px;
    }

    .message-content {
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .message-timestamp {
      font-size: 0.75rem;
      opacity: 0.7;
      text-align: right;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: var(--agro-muted);
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

    .chat-input {
      border-top: 1px solid #e5e7eb;
      padding: 16px 20px;
      background: white;
    }

    .input-container {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .message-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 25px;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .message-input:focus {
      outline: none;
      border-color: var(--agro-green-400);
    }

    .send-button {
      width: 48px;
      height: 48px;
      background: var(--agro-green-500);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .send-button:hover:not(:disabled) {
      background: var(--agro-green-400);
      transform: scale(1.05);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .chat-features {
      display: flex;
      gap: 12px;
    }

    .feature-btn {
      background: none;
      border: 1px solid #e5e7eb;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--agro-muted);
    }

    .feature-btn:hover {
      border-color: var(--agro-green-400);
      color: var(--agro-green-500);
    }

    .satisfaction-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 400px;
      width: 90%;
      text-align: center;
    }

    .modal-content h3 {
      color: var(--agro-text);
      margin: 0 0 20px 0;
    }

    .rating-stars {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 20px;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      opacity: 0.3;
      transition: all 0.2s ease;
    }

    .star-btn.active,
    .star-btn:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    .feedback-input {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 20px;
      resize: vertical;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .support-content {
        grid-template-columns: 1fr;
        height: auto;
      }

      .info-panel {
        order: 2;
        flex-direction: row;
        overflow-x: auto;
      }

      .chat-container {
        height: 500px;
      }

      .message-bubble {
        max-width: 85%;
      }
    }
  `]
})
export class SupportPage implements AfterViewChecked {
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  currentMessage = '';
  isTyping = signal(false);
  showSatisfaction = signal(false);
  selectedRating = signal(0);
  feedbackComment = '';
  shouldScrollToBottom = false;

  messages = signal<ChatMessage[]>([
    {
      id: '1',
      content: '¡Hola! Soy María, tu agente de soporte. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      isUser: false,
      type: 'text'
    }
  ]);

  quickActions: QuickAction[] = [
    {
      id: '1',
      label: 'Estado de mi pedido',
      icon: '📦',
      message: 'Quiero consultar el estado de mi pedido'
    },
    {
      id: '2',
      label: 'Problema con pago',
      icon: '💳',
      message: 'Tengo un problema con mi pago'
    },
    {
      id: '3',
      label: 'Cambiar dirección',
      icon: '📍',
      message: 'Necesito cambiar mi dirección de envío'
    },
    {
      id: '4',
      label: 'Devolución',
      icon: '↩️',
      message: 'Quiero hacer una devolución'
    },
    {
      id: '5',
      label: 'Cuenta bloqueada',
      icon: '🔒',
      message: 'Mi cuenta está bloqueada'
    },
    {
      id: '6',
      label: 'Información de producto',
      icon: '🥕',
      message: 'Tengo una pregunta sobre un producto'
    }
  ];

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isTyping()) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: this.currentMessage,
      timestamp: new Date(),
      isUser: true,
      type: 'text'
    };

    this.messages.update(messages => [...messages, userMessage]);
    this.currentMessage = '';
    this.shouldScrollToBottom = true;

    // Simular respuesta del agente
    this.simulateAgentResponse(userMessage.content);
  }

  sendQuickMessage(message: string): void {
    this.currentMessage = message;
    this.sendMessage();
  }

  simulateAgentResponse(userMessage: string): void {
    this.isTyping.set(true);

    // Agregar indicador de "escribiendo"
    const typingMessage: ChatMessage = {
      id: 'typing',
      content: '',
      timestamp: new Date(),
      isUser: false,
      type: 'typing'
    };

    this.messages.update(messages => [...messages, typingMessage]);
    this.shouldScrollToBottom = true;

    // Simular tiempo de respuesta
    setTimeout(() => {
      // Remover indicador de "escribiendo"
      this.messages.update(messages => messages.filter(m => m.id !== 'typing'));

      // Generar respuesta basada en el mensaje del usuario
      const response = this.generateResponse(userMessage);
      
      const agentMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response,
        timestamp: new Date(),
        isUser: false,
        type: 'text'
      };

      this.messages.update(messages => [...messages, agentMessage]);
      this.isTyping.set(false);
      this.shouldScrollToBottom = true;

      // Mostrar modal de satisfacción después de varias interacciones
      if (this.messages().length > 8) {
        setTimeout(() => {
          this.showSatisfaction.set(true);
        }, 2000);
      }
    }, 1500 + Math.random() * 2000);
  }

  generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('pedido') || message.includes('orden')) {
      return 'Claro, puedo ayudarte con tu pedido. Por favor compárteme tu número de orden y verificaré el estado para ti.';
    }
    
    if (message.includes('pago') || message.includes('tarjeta')) {
      return 'Entiendo tu preocupación con el pago. ¿Podrías contarme más detalles sobre el problema? ¿Recibiste algún mensaje de error?';
    }
    
    if (message.includes('dirección') || message.includes('envío')) {
      return 'Por supuesto, puedo ayudarte a actualizar tu dirección de envío. Puedes cambiarla en tu perfil o puedo guiarte paso a paso.';
    }
    
    if (message.includes('devolución') || message.includes('devolver')) {
      return 'Te ayudo con la devolución. Nuestro proceso es muy sencillo. ¿Cuál es el motivo de la devolución y qué productos quieres devolver?';
    }
    
    if (message.includes('cuenta') || message.includes('bloqueada')) {
      return 'Vamos a resolver el problema con tu cuenta. Por seguridad, necesitaré verificar algunos datos contigo. ¿Podrías confirmarme tu email registrado?';
    }
    
    if (message.includes('producto') || message.includes('información')) {
      return 'Perfecto, estaré encantada de ayudarte con información sobre nuestros productos. ¿Sobre qué producto específico tienes dudas?';
    }
    
    // Respuestas generales
    const responses = [
      'Entiendo tu consulta. Permíteme revisar esto para darte la mejor solución.',
      'Gracias por contactarnos. Te voy a ayudar a resolver esto paso a paso.',
      'Me parece muy importante tu consulta. Déjame verificar la información para ayudarte mejor.',
      'Por supuesto que puedo ayudarte con eso. ¿Podrías darme un poco más de contexto?',
      'Excelente consulta. Te guío para que podamos resolver esto juntos.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  attachFile(): void {
    alert('Función de adjuntar archivo - En desarrollo');
  }

  sendScreenshot(): void {
    alert('Función de captura de pantalla - En desarrollo');
  }

  setRating(rating: number): void {
    this.selectedRating.set(rating);
  }

  submitFeedback(): void {
    const rating = this.selectedRating();
    const comment = this.feedbackComment;
    
    alert(`Gracias por tu feedback!\nCalificación: ${rating} estrellas\nComentario: ${comment || 'Sin comentarios'}`);
    this.closeSatisfaction();
  }

  closeSatisfaction(): void {
    this.showSatisfaction.set(false);
    this.selectedRating.set(0);
    this.feedbackComment = '';
  }

  private scrollToBottom(): void {
    try {
      const element = this.chatMessages.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.log('Error scrolling to bottom:', err);
    }
  }
}