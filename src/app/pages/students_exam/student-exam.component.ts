import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../core/services/Exams/Exams.service';
import { IExamDetails } from '../../shared/interfaces/Exams/IExam';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-student-exam',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './student-exam.component.html',
})
export class StudentExamComponent implements OnInit {
  returnToExams() {
    this.router.navigate(['/app/exams']);
}
  private route = inject(ActivatedRoute);
  private examService = inject(ExamService);
  private router = inject(Router);

  exam: IExamDetails | null = null;
  attemptId!: number;
  currentQuestionIndex = 0;
  selectedAnswers: Map<number, number> = new Map();
  
  showConfirmModal = false;
  isSubmitting = false;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.attemptId = Number(this.route.snapshot.queryParamMap.get('attemptId'));

    if (!this.attemptId) {
      this.errorMessage = 'No active attempt found. Please start the exam again.';
      this.isLoading = false;
      return;
    }

    this.examService.getExamDetails(id).subscribe({
      next: (data) => {
        this.exam = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Could not load exam', err);
        this.errorMessage = err.error?.message || 'Failed to load exam. Please try again.';
        this.isLoading = false;
      },
    });
  }

  openSubmitModal() {
    this.showConfirmModal = true;
  }

  closeModal() {
    this.showConfirmModal = false;
  }

  onSelectChoice(questionId: number, choiceId: number) {
    const isAlreadyAnswered = this.selectedAnswers.has(questionId);

    const payload = {
      attemptId: this.attemptId,
      questionId: questionId,
      selectedChoiceId: choiceId,
    };

    if (isAlreadyAnswered) {
      this.examService.updateAnswer(payload).subscribe({
        next: () => {
          this.selectedAnswers.set(questionId, choiceId);
          console.log('Answer updated');
        },
        error: (err) => alert(err.error?.message),
      });
    } else {
      this.examService.submitAnswer(payload).subscribe({
        next: () => {
          this.selectedAnswers.set(questionId, choiceId);
          console.log('Answer saved');
        },
        error: (err) => alert(err.error?.message),
      });
    }
  }

  goToNext() {
    if (this.exam && this.currentQuestionIndex < this.exam.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  goToPrevious() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitExam() {
    this.isSubmitting = true;

    this.examService.finalizeAttempt(this.attemptId).subscribe({
      next: (res) => {
        console.log('Exam Finalized:', res);
        this.showConfirmModal = false;
        this.router.navigate(['/app/exam-results']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Final submission failed', err);
        alert(err.error?.message || 'An error occurred while finalizing the exam.');
      },
    });
  }
}