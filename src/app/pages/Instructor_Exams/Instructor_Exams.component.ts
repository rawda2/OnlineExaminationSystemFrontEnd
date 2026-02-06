 // features/instructor-exams/instructor-exams.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ExamService } from '../../core/services/Instructor_exams/Instructor_Exams.service';
import { InstructorQuestionsService } from '../../core/services/Instructor/Instructor_questions.service';
import { ToastService } from '../../core/services/Toast/Toast.service';
import { IQuestion as IQuestionFromService } from '../../shared/interfaces/Instructor_questions/IQuestions';

@Component({
  selector: 'app-instructor-exams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Instructor_Exams.component.html',
})
export class InstructorExamsComponent implements OnInit {
  private examService = inject(ExamService);
  private questionsService = inject(InstructorQuestionsService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  currentUser = localStorage.getItem('current_user');
  instructorId = JSON.parse(this.currentUser || '{}').userId;

  exams: any[] = [];
  courseQuestions: IQuestionFromService[] = [];
  assignedQuestions: any[] = []; // Store actual assigned questions data
  selectedExamForQuestions: any = null;
  viewMode: 'list' | 'add' | 'manage-questions' = 'list';
  examForm: FormGroup;
  isLoading = false;

  constructor() {
    this.examForm = this.fb.group({
      instructorId: [this.instructorId],
      courseId: [null, Validators.required], // Changed from '' to null
      title: ['', [Validators.required, Validators.minLength(3)]],
      durationMinutes: [60, [Validators.required, Validators.min(10)]],
      totalMarks: [100, Validators.required],
      passingScore: [50, Validators.required],
      isPublished: [false],
    });
  }

  ngOnInit() {
    this.loadMyExams();
  }

  loadMyExams() {
    this.isLoading = true;
    this.examService.getMyExams().subscribe({
      next: (data) => {
        console.log('Exams loaded:', data);
        this.exams = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading exams:', err);
        this.toastService.show('Failed to load exams', 'error');
        this.isLoading = false;
      },
    });
  }

  openManageQuestions(exam: any) {
    console.log('Opening manage questions for exam:', exam);

    if (!exam || !exam.examId || !exam.courseId) {
      this.toastService.show('Invalid exam data', 'error');
      return;
    }

    this.selectedExamForQuestions = exam;
    this.viewMode = 'manage-questions';

    // Reset arrays
    this.courseQuestions = [];
    this.assignedQuestions = [];

    // Load course questions
    this.loadCourseQuestions(exam.courseId);

    // Load already assigned questions
    this.loadAssignedQuestions(exam.examId);
  }

  loadCourseQuestions(courseId: number) {
    console.log('Loading course questions for courseId:', courseId);

    if (!courseId || isNaN(courseId)) {
      console.error('Invalid course ID:', courseId);
      this.toastService.show('Invalid course ID', 'error');
      return;
    }

    this.questionsService.getQuestionsByCourse(courseId).subscribe({
      next: (data) => {
        console.log('Course questions loaded:', data);
        this.courseQuestions = data;
      },
      error: (err) => {
        console.error('Error loading course questions:', err);
        this.toastService.show('Failed to load course questions', 'error');
      },
    });
  }

  loadAssignedQuestions(examId: number) {
    console.log('Loading assigned questions for examId:', examId);

    if (!examId || isNaN(examId)) {
      console.error('Invalid exam ID:', examId);
      return;
    }

    this.examService.getExamDetails(examId).subscribe({
      next: (examDetails: any) => {
        console.log('Exam details loaded:', examDetails);
        this.assignedQuestions = examDetails.questions || [];
      },
      error: (err) => {
        console.error('Error loading assigned questions:', err);
        this.assignedQuestions = [];
        this.toastService.show('Could not load assigned questions', 'error');
      },
    });
  }
  assignQuestion(questionId: number) {
    if (!this.selectedExamForQuestions) {
      this.toastService.show('No exam selected', 'error');
      return;
    }

    const question = this.courseQuestions.find(
      (q) => q.questionId === questionId,
    );

    if (!question) {
      this.toastService.show('Question not found', 'error');
      return;
    }

    if (this.isQuestionAssigned(questionId)) {
      this.toastService.show(
        'This question is already assigned to the exam',
        'error',
      );
      return;
    }

    const nextOrderNo = this.getNextAvailableOrderNumber();

    const payload = {
      examId: this.selectedExamForQuestions.examId,
      questionId: questionId,
      orderNo: nextOrderNo,
      pointsOverride: question.defaultMark || 5,
    };

    console.log('Assigning question with payload:', payload);

    this.examService.addQuestionToExam(payload).subscribe({
      next: (res) => {
        console.log('Question assignment response:', res);
        this.toastService.show(
          res.message || 'Question added successfully!',
          'success',
        );
        // Refresh the assigned questions list
        this.loadAssignedQuestions(this.selectedExamForQuestions.examId);
      },
      error: (err) => {
        console.error('Error assigning question:', err);
        const errorMsg =
          err.error?.message ||
          err.error?.error ||
          err.message ||
          'Error adding question to exam';
        this.toastService.show(errorMsg, 'error');
      },
    });
  }

  private getNextAvailableOrderNumber(): number {
    if (this.assignedQuestions.length === 0) {
      return 1;
    }

    const existingOrderNumbers = this.assignedQuestions
      .map((q) => q.orderNo || q.orderNumber || 0)
      .filter((order) => order > 0)
      .sort((a, b) => a - b);

    console.log('Existing order numbers:', existingOrderNumbers);

    for (let i = 0; i < existingOrderNumbers.length; i++) {
      if (existingOrderNumbers[i] !== i + 1) {
        return i + 1;
      }
    }

    return existingOrderNumbers.length + 1;
  }

  removeQuestion(questionId: number) {
    if (!this.selectedExamForQuestions) {
      this.toastService.show('No exam selected', 'error');
      return;
    }

    if (
      !confirm('Are you sure you want to remove this question from the exam?')
    ) {
      return;
    }


  }

  isQuestionAssigned(questionId: number): boolean {
    return this.assignedQuestions.some((q) => q.questionId === questionId);
  }

  submitExam() {
    if (this.examForm.valid) {
      const formData = this.examForm.value;
      console.log('Submitting exam form:', formData);

      // Ensure courseId is a number
      const courseId = Number(formData.courseId);
      if (isNaN(courseId)) {
        this.toastService.show('Invalid Course ID', 'error');
        return;
      }

      const examData = {
        ...formData,
        courseId: courseId,
      };

      this.examService.createExam(examData).subscribe({
        next: (res) => {
          console.log('Exam creation response:', res);
          this.toastService.show('Exam created successfully!', 'success');
          this.viewMode = 'list';
          this.examForm.reset({
            instructorId: this.instructorId,
            durationMinutes: 60,
            totalMarks: 100,
            passingScore: 50,
            isPublished: false,
          });
          this.loadMyExams();
        },
        error: (err) => {
          console.error('Error creating exam:', err);
          const errorMsg =
            err.error?.message ||
            err.error?.error ||
            err.message ||
            'Error creating exam';
          this.toastService.show(errorMsg, 'error');
        },
      });
    } else {
      console.log('Form invalid:', this.examForm.errors);
      this.toastService.show(
        'Please fill all required fields correctly',
        'error',
      );
      this.markFormGroupTouched(this.examForm);
    }
  }

  onDelete(examId: number) {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(this.instructorId, examId).subscribe({
        next: (res) => {
          console.log('Delete response:', res);
          this.toastService.show('Exam deleted successfully', 'info');
          this.loadMyExams();
        },
        error: (err) => {
          console.error('Error deleting exam:', err);
          const errorMsg =
            err.error?.message ||
            err.error?.error ||
            err.message ||
            'Could not delete exam';
          this.toastService.show(errorMsg, 'error');
        },
      });
    }
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
