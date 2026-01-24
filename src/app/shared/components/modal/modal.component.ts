import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() maxWidth = 'max-w-md'; // Can be max-w-lg, max-w-2xl, etc.

  @Output() close = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent) {
    // Only close if the backdrop was clicked, not the modal content
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
