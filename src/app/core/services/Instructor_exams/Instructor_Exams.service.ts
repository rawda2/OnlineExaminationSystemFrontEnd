import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseURL}Exams`;
  private apiUrl2 = `${environment.baseURL}Questions`;

  getMyExams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-exams`);
  }

  getExamsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-course/${courseId}`);
  }

  getCourseQuestions(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}/by-course/${courseId}`);
  }

  getExamDetails(examId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/details/${examId}`);
  }

  createExam(examData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, examData);
  }
  addQuestionToExam(payload: {
    examId: number;
    questionId: number;
    orderNo: number;
    pointsOverride: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-to-exam`, payload);
  }
  deleteExam(instructorId: number, examId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, {
      body: { instructorId, examId },
    });
  }
}