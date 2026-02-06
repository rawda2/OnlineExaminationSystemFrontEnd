import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { BranchesService } from '../../core/services/Branches/branches.service';
import { TracksService } from '../../core/services/Tracks/tracks.service';
import { AuthService } from '../../core/services/Auth/auth.service';
import { ToastService } from '../../core/services/Toast/Toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  private fb = inject(FormBuilder);
  private branchesService = inject(BranchesService);
  private tracksService = inject(TracksService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  registerForm!: FormGroup;
  showPassword = false;


  // expose signals
  branches = this.branchesService.BranchesData;
  tracksByBranch = this.tracksService.tracksByBranch;

  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
    this.branchesService.getBranchesData();
  }

  // =========================
  // Form initialization
  // =========================
  private initForm(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/),
        ],
      ],
      branchId: [null, Validators.required],
      trackId: [{ value: null, disabled: true }, Validators.required],
    });
  }

  isInvalid(controlName: string): boolean {
  const c = this.registerForm.get(controlName);
  return !!(c && c.invalid && (c.dirty || c.touched));
}

isValid(controlName: string): boolean {
  const c = this.registerForm.get(controlName);
  return !!(c && c.valid && (c.dirty || c.touched));
}

get passwordHash() {
  return this.registerForm.get('passwordHash');
}


  // =========================
  // Branch change
  // =========================
  onBranchChange(): void {
    const branchId = this.registerForm.value.branchId;

    this.registerForm.patchValue({ trackId: null });
    this.registerForm.get('trackId')?.disable();
    this.tracksService.tracksByBranch.set([]);

    if (!branchId) return;

    this.tracksService.loadTracksByBranch(branchId);
    this.registerForm.get('trackId')?.enable();
  }

  // =========================
  // Submit
  // =========================
  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastService.show(
        'Please fill all required fields correctly.',
        'info'
      );
      return;
    }

    this.isSubmitting = true;

    const payload = this.registerForm.getRawValue();

    this.authService.register(payload).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.toastService.show(
          'Account created successfully 🎉 You can now log in.',
          'success'
        );

        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting = false;

        this.toastService.show(
          err?.error?.message || 'Registration failed. Please try again.',
          'error'
        );
      },
    });
  }
}
