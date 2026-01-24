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
  private route = inject(ActivatedRoute);
  private examService = inject(ExamService);
  private router = inject(Router);

  exam!: IExamDetails;
  attemptId!: number;
  currentQuestionIndex = 0;
  selectedAnswers: Map<number, number> = new Map(); 
  
  showConfirmModal = false;
  isSubmitting = false;
  ngOnInit(): void {
    // Get the Exam ID from the URL path: /app/student-exam/10
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.attemptId = Number(this.route.snapshot.queryParamMap.get('attemptId'));

    if (!this.attemptId) {
      alert('No active attempt found. Please start the exam again.');
      this.router.navigate(['/app/exams']);
      return;
    }

    this.examService.getExamDetails(id).subscribe({
      next: (data) => (this.exam = data),
      error: (err) => console.error('Could not load exam', err),
    });
  }
  openSubmitModal() {
    this.showConfirmModal = true;
  }

  // Step 2: Triggered by the "Cancel" button in the Modal
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
    if (this.currentQuestionIndex < this.exam.questions.length - 1) {
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
        // Navigate to exams or a result page
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

