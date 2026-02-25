// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import {
  DashboardSummary,
  ExamPerformance,
  EnrollmentTrend,
} from '../../../shared/interfaces/Dashboards/Instructor';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl =environment.baseURL + 'dashboard';
  constructor(private http: HttpClient) {}


  getSummary(instructorId: number): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${this.baseUrl}/summary/${instructorId}`,
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  
  getExamPerformance(instructorId: number): Observable<ExamPerformance[]> {
    return this.http.get<ExamPerformance[]>(
      `${this.baseUrl}/exam-performance/${instructorId}`,
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  
  getEnrollmentTrend(instructorId: number): Observable<EnrollmentTrend[]> {
    return this.http.get<EnrollmentTrend[]>(
      `${this.baseUrl}/enrollment-trend/${instructorId}`,
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
