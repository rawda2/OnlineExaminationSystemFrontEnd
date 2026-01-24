import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/Exams/Exams.service';
import { IExam } from '../../shared/interfaces/Exams/IExam';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './exams-list.component.html',
  styleUrl: './exams-list.component.css',
})
export class ExamsListComponent implements OnInit {
  private examService = inject(ExamService);
  private router = inject(Router);

  exams: IExam[] = [];

  // Modal State Properties
  showConfirmModal = false;
  selectedExamId: number | null = null; // Essential for tracking which exam to start

  ngOnInit(): void {
    this.examService.getAllExams().subscribe({
      next: (data) => (this.exams = data),
      error: (err) => console.error('Error fetching exams', err),
    });
  }

  // Step 1: User clicks "Start" - Just open the modal
  onSelectExam(examId: number) {
    this.selectedExamId = examId;
    this.showConfirmModal = true;
  }

  // Step 2: User clicks "Yes" in the modal
  confirmStart() {
    if (this.selectedExamId) {
      this.proceedToStartExam(this.selectedExamId);
    }
  }

  // Step 3: Handle the actual API logic
  private proceedToStartExam(examId: number) {
    const userString = localStorage.getItem('current_user');

    if (!userString) {
      alert('User session not found. Please log in.');
      this.closeModal();
      return;
    }

    try {
      const userData = JSON.parse(userString);
      const studentId = Number(userData.userId);

      this.examService.createAttempt(examId, studentId).subscribe({
        next: (res) => {
          this.closeModal(); // Hide modal on success
          this.router.navigate(['app/take-exam', examId], {
            queryParams: { attemptId: res.attemptId },
          });
        },
        error: (err) => {
          console.error('Could not start exam', err);
          alert(err.error?.message || 'Failed to start attempt.');
          this.closeModal();
        },
      });
    } catch (e) {
      alert('Error retrieving user information. Please log in again.');
      this.closeModal();
    }
  }

  closeModal() {
    this.showConfirmModal = false;
    this.selectedExamId = null;
  }
}
