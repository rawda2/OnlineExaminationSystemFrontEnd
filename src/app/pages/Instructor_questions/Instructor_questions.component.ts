import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';

import { InstructorQuestionsService } from '../../core/services/Instructor/Instructor_questions.service';
import { ICourse, IQuestion } from '../../shared/interfaces/Instructor_questions/IQuestions';
import { ToastService } from '../../core/services/Toast/Toast.service';

@Component({
  selector: 'app-instructor_questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './instructor_questions.component.html',
})
export class InstructorQuestionsComponent implements OnInit {
  private instructorService = inject(InstructorQuestionsService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  courses: ICourse[] = [];
  selectedCourse: ICourse | null = null;
  questions: IQuestion[] = [];

  // State Management
  instructorId = 42;
  viewMode: 'courses' | 'questions' | 'add' = 'courses';
  questionForm: FormGroup;

  constructor() {
    this.questionForm = this.fb.group({
      instructorId: [this.instructorId],
      courseId: [0, Validators.required],
      questionText: ['', [Validators.required, Validators.minLength(5)]],
      questionType: ['MCQ'],
      defaultMark: [5, [Validators.required, Validators.min(1)]],
      choices: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.loadCourses();
  }

  // --- NAVIGATION ---

  loadCourses() {

    this.instructorService.getCourses(this.instructorId).subscribe({
      next: (data) => {
        this.courses = data;
        this.viewMode = 'courses';
        this.selectedCourse = null;
        console.log('Courses loaded:', data);
      },
      error: () => this.toastService.show('Failed to load courses', 'error'),
    });
  }

  viewQuestions(course: ICourse) {
    this.selectedCourse = course;
    this.instructorService.getQuestionsByCourse(course.courseId).subscribe({
      next: (data) => {
        this.questions = data;
        this.viewMode = 'questions';
      },
      error: () => this.toastService.show('Error fetching questions', 'error'),
    });
  }

  openAddQuestion(course: ICourse) {
    this.selectedCourse = course;

    this.questionForm.reset({
      instructorId: this.instructorId,
      courseId: course.courseId,
      questionType: 'MCQ',
      defaultMark: 5,
      questionText: '',
    });

    this.onTypeChange();
    this.viewMode = 'add';
  }

  get choicesArray() {
    return this.questionForm.get('choices') as FormArray;
  }

  onTypeChange() {
    const type = this.questionForm.get('questionType')?.value;
    this.choicesArray.clear();

    if (type === 'TF') {
      this.addChoice('True', true);
      this.addChoice('False', false);
    } else {
      for (let i = 0; i < 4; i++) {
        this.addChoice('', i === 0);
      }
    }
  }

  addChoice(text: string, isCorrect: boolean) {
    this.choicesArray.push(
      this.fb.group({
        choiceText: [text, Validators.required],
        isCorrect: [isCorrect],
      }),
    );
  }

  setCorrectChoice(index: number) {
    this.choicesArray.controls.forEach((control, i) => {
      control.get('isCorrect')?.setValue(i === index);
    });
  }

  submitQuestion() {
    if (this.questionForm.valid) {
      console.log('Payload:', this.questionForm.value);

      this.toastService.show('Question saved successfully! 🎉', 'success');

      if (this.selectedCourse) {
        this.viewQuestions(this.selectedCourse);
      }
    } else {
      this.toastService.show('Please complete the form correctly.', 'error');
    }
  }
}