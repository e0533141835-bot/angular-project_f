import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common'; // או Imports אחרים לפי הצורך

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule], 
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item" [class]="toast.type" (click)="toastService.remove(toast.id)">
          <div class="icon">
            @if(toast.type === 'success') { ✅ }
            @else if(toast.type === 'error') { 🛑 }
            @else { ℹ️ }
          </div>
          <div class="message">{{ toast.message }}</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none; /* כדי לא להפריע ללחיצות מתחת */
    }

    .toast-item {
      pointer-events: all;
      background: rgba(30, 41, 59, 0.95); /* צבע כהה מהעיצוב שלך */
      backdrop-filter: blur(10px);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 250px;
      max-width: 350px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border-left: 5px solid;
      animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
      cursor: pointer;
      font-size: 0.9rem;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .toast-item:hover { transform: translateX(-5px); }

    /* צבעים לפי סוג */
    .success { border-left-color: #10b981; }
    .error { border-left-color: #ef4444; }
    .info { border-left-color: #3b82f6; }

    .message { font-weight: 500; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}