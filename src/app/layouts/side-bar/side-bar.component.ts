import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/Auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  standalone:true,
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  private readonly auth = inject(AuthService);

  user = computed(() => this.auth.currentUser());
  role = computed(() => this.user()?.roleName ?? '');
  fullName = computed(() => this.user()?.fullName ?? '');

  isStudent = computed(() => this.role() === 'Student');
  isInstructor = computed(() => this.role() === 'Instructor');

  logout() {
    this.auth.logout();
  }

}
