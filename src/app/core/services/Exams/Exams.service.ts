import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IExam, IExamDetails } from '../../../shared/interfaces/Exams/IExam';
import { environment } from '../../environment/environment';
import { IStudentAttempt } from '../../../shared/interfaces/Attemps/IAttemps';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseURL}`;
  attemptsUrl: any;

  getAvailableExams(): Observable<IExam[]> {
    return this.http.get<IExam[]>(`${this.apiUrl}Exams/all`);
  }
  // Exams.service.ts
  getAllExams(): Observable<IExam[]> {
    return this.http.get<IExam[]>(`${this.apiUrl}Exams/all`);
  }

  getExamDetails(id: number): Observable<IExamDetails> {
    return this.http.get<IExamDetails>(`${this.apiUrl}Exams/details/${id}`);
  }
  createAttempt(examId: number, studentId: number): Observable<any> {
    return this.http.post(`${environment.baseURL}Attempts/create`, {
      examId,
      studentId,
    });
  }

  submitAnswer(payload: {
    attemptId: number;
    questionId: number;
    selectedChoiceId: number;
  }) {
    return this.http.post(`${this.apiUrl}Attempts/answers/add`, payload);
  }

  updateAnswer(payload: {
    attemptId: number;
    questionId: number;
    selectedChoiceId: number;
  }) {
    return this.http.put(`${this.apiUrl}Attempts/answers/update`, payload);
  }

  getStudentAttempts(studentId: number): Observable<IStudentAttempt[]> {
    return this.http.get<IStudentAttempt[]>(
      `${this.apiUrl}Attempts/student/${studentId}`,
    );
  }

  finalizeAttempt(attemptId: number) {
    return this.http.post(`${this.apiUrl}Attempts/${attemptId}/submit`, {});
  }
  deleteAttempt(attemptId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Attempts/${attemptId}`);
  }
}
