import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../core/services/Exams/Exams.service';
import { IExamDetails } from '../../shared/interfaces/Exams/IExam';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-student-exam',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './student-exam.component.html',
})
export class StudentExamComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private examService = inject(ExamService);
  private router = inject(Router);

  exam: IExamDetails | null = null;
  attemptId!: number;
  currentQuestionIndex = 0;
  selectedAnswers: Map<number, number> = new Map();

  showConfirmModal = false;
  showTimeUpModal = false;
  isSubmitting = false;
  isLoading = true;
  errorMessage = '';

  // Timer properties
  remainingTime: number = 0; // in seconds
  formattedTime: string = '00:00';
  timerSubscription: Subscription | null = null;
  totalDuration: number = 0; // in minutes

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.attemptId = Number(this.route.snapshot.queryParamMap.get('attemptId'));

    if (!this.attemptId) {
      this.errorMessage =
        'No active attempt found. Please start the exam again.';
      this.isLoading = false;
      return;
    }

    this.examService.getExamDetails(id).subscribe({
      next: (data) => {
        this.exam = data;
        this.totalDuration = data.durationMinutes;
        this.startTimer();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Could not load exam', err);
        this.errorMessage =
          err.error?.message || 'Failed to load exam. Please try again.';
        this.isLoading = false;
      },
    });
  }

  startTimer() {
    if (!this.exam) return;

    // Calculate total seconds from durationMinutes
    this.remainingTime = this.exam.durationMinutes * 60;

    // Update the display immediately
    this.updateDisplayTime();

    // Start countdown timer
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.updateDisplayTime();

        // Show warning at 5 minutes and 1 minute remaining
        if (this.remainingTime === 5 * 60 || this.remainingTime === 60) {
          this.showTimeWarning();
        }

        // Auto-submit when time reaches 0
        if (this.remainingTime === 0) {
          this.autoSubmitExam();
        }
      }
    });
  }

  updateDisplayTime() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;

    // Format with leading zeros
    this.formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update document title with remaining time
    document.title = `(${this.formattedTime}) Exam - ${this.exam?.title || 'In Progress'}`;
  }

  showTimeWarning() {
    const minutes = Math.floor(this.remainingTime / 60);
    const message =
      minutes > 0
        ? `${minutes} minute${minutes > 1 ? 's' : ''} remaining!`
        : '1 minute remaining!';

    // You can show a toast notification here
    console.warn('Time warning:', message);

    // Example using alert (replace with your toast service)
    if (this.remainingTime === 60) {
      alert('Warning: 1 minute remaining! Please save your answers.');
    }
  }

  autoSubmitExam() {
    this.showTimeUpModal = true;

    // Auto-submit after 5 seconds of showing the modal
    setTimeout(() => {
      this.submitExam();
    }, 5000);
  }

  getProgressPercentage(): number {
    if (!this.exam) return 0;
    const totalTime = this.exam.durationMinutes * 60;
    const elapsedTime = totalTime - this.remainingTime;
    return Math.min(100, (elapsedTime / totalTime) * 100);
  }

  getTimeClass(): string {
    if (this.remainingTime > 300) {
      // More than 5 minutes
      return 'text-green-600';
    } else if (this.remainingTime > 60) {
      // More than 1 minute
      return 'text-yellow-600';
    } else {
      // Less than 1 minute
      return 'text-red-600 animate-pulse';
    }
  }

  returnToExams() {
    this.router.navigate(['/app/exams']);
  }

  openSubmitModal() {
    this.showConfirmModal = true;
  }

  closeModal() {
    this.showConfirmModal = false;
  }

  closeTimeUpModal() {
    this.showTimeUpModal = false;
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
    if (
      this.exam &&
      this.currentQuestionIndex < this.exam.questions.length - 1
    ) {
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
        this.showTimeUpModal = false;
        this.stopTimer();
        document.title = 'Exam Completed';
        this.router.navigate(['/app/exam-results']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Final submission failed', err);
        alert(
          err.error?.message || 'An error occurred while finalizing the exam.',
        );
      },
    });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  ngOnDestroy() {
    this.stopTimer();
    // Reset document title when component is destroyed
    document.title = 'Exam System';
  }
}
