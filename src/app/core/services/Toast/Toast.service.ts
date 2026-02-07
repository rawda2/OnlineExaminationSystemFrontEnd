import { Injectable } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = this.counter++;
    this.toasts.push({ id, message, type });

    // إزالة التنبيه تلقائياً بعد 3 ثوانٍ
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
