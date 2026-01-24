import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../core/services/Exams/Exams.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { IStudentAttempt } from '../../shared/interfaces/Attemps/IAttemps';
import { ModalComponent } from "../../shared/components/modal/modal.component";

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './exam-result.component.html',
})
export class ExamResultComponent implements OnInit {
  private examService = inject(ExamService);
  private router = inject(Router); // Inject Router properly

  attempts: IStudentAttempt[] = [];
  filteredAttempts: IStudentAttempt[] = [];
  searchTerm: string = '';
  isLoading = true;

  maxMarks: number = 0;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const userData = localStorage.getItem('current_user');

    if (userData) {
      try {
        const user = JSON.parse(userData);
        const id = Number(user.userId);

        // Logic check: if student, load their specific records
        if (user.roleName === 'Student') {
          this.loadStudentRecords(id);
        } else {
          // If Instructor/Admin, you might want to load all (requires different API call)
          this.loadAllRecords();
        }
      } catch (e) {
        console.error('Error parsing user data', e);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadStudentRecords(studentId: number) {
    this.isLoading = true;
    this.examService.getStudentAttempts(studentId).subscribe({
      next: (data) => {
        this.attempts = data;
        this.filteredAttempts = data;

        this.attempts.forEach((attempt, index) => {
          this.examService.getExamDetails(attempt.examId).subscribe({
            next: (details) => {
              this.attempts[index].totalMarks = details.totalMarks;
              console.log(details.totalMarks);
            },
            error: (err) =>
              console.error(
                `Error fetching marks for exam ${attempt.examId}`,
                err,
              ),
          });
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      },
    });
  }

  loadAllRecords() {
    // Note: You need an "All" method in your service for this
    // If you use getStudentAttempts(id), you MUST pass an ID.
    console.warn(
      "Instructor/Admin view requested. Ensure service has 'getAllAttempts'",
    );
  }

  // loadExamInfo(examId: number) {
  //   this.examService.getExamDetails(examId).subscribe({
  //     next: (details) => {
  //       this.maxMarks = details.totalMarks;
  //     },
  //   });
  // }

  filterResults() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAttempts = this.attempts.filter((a) =>
      a.examTitle.toLowerCase().includes(term),
    );
  }
  // exam-result.component.ts

  isDeleteModalOpen = false;
  attemptToDeleteId: number | null = null;

  openDeleteModal(attemptId: number) {
    this.attemptToDeleteId = attemptId;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.attemptToDeleteId) {
      this.examService.deleteAttempt(this.attemptToDeleteId).subscribe({
        next: (response) => {
          // Remove from local arrays
          this.attempts = this.attempts.filter(
            (a) => a.attemptId !== this.attemptToDeleteId,
          );
          this.filteredAttempts = this.filteredAttempts.filter(
            (a) => a.attemptId !== this.attemptToDeleteId,
          );

          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.closeDeleteModal();
        },
      });
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.attemptToDeleteId = null;
  }
}