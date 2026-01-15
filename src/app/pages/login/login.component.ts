import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/Auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly fb= inject(FormBuilder);
  private readonly authService=inject(AuthService);
  private readonly router=inject(Router);
  loginForm!:FormGroup;

    isSubmitting = false;
  showPassword = false;
  apiError: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      passwordHash: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          // at least 1 digit, 1 lowercase, 1 uppercase, 1 special char
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/),
        ],
      ],
      rememberMe: [false],
    });
  }

  // Getters
  get email() {
    return this.loginForm.get('email');
  }
  get passwordHash() {
    return this.loginForm.get('passwordHash');
  }

  isInvalid(controlName: 'email' | 'passwordHash') {
    const c = this.loginForm.get(controlName);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  isValid(controlName: 'email' | 'passwordHash') {
    const c = this.loginForm.get(controlName);
    return !!(c && c.valid && (c.dirty || c.touched));
  }

  submit(): void {
  this.apiError = null;

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  const payload = {
    email: this.loginForm.value.email,
    passwordHash: this.loginForm.value.passwordHash,
  };

  this.authService.login(payload).subscribe({
    next: (res) => {
      console.log('LOGIN RESPONSE:', res);
      this.authService.handleLoginSuccess(res);
      this.authService.redirectAfterLogin();
      this.isSubmitting = false;
    },
    error: (err) => {
      console.error('LOGIN ERROR:', err);
      this.isSubmitting = false;
      this.apiError =
        err?.error?.message ||
        (typeof err?.error === 'string' ? err.error : null) ||
        'Invalid email or password.';
    },
  });
}

}
