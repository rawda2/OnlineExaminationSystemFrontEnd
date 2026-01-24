import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/Toast/Toast.service'; // تأكد من المسار الصحيح

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[100] flex flex-col gap-3">
      @for (toast of toastService.toasts; track toast.id) {
        <div 
          class="flex items-center p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 min-w-[300px]"
          [ngClass]="{
            'bg-emerald-50 border-emerald-200 text-emerald-800': toast.type === 'success',
            'bg-rose-50 border-rose-200 text-rose-800': toast.type === 'error',
            'bg-blue-50 border-blue-200 text-blue-800': toast.type === 'info'
          }">
          
          <span class="flex-1 font-bold text-sm">{{ toast.message }}</span>
          
          <button (click)="toastService.remove(toast.id)" class="ml-4 opacity-50 hover:opacity-100 transition-opacity">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}