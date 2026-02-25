import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { StudentDashboardData } from '../../../shared/interfaces/Dashboards/Student';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentDashboardService {
  private baseUrl = environment.baseURL;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private ensureValidStructure(
    response: StudentDashboardData,
  ): StudentDashboardData {
    // Ensure all required fields exist, but preserve actual values
    return {
      examsTaken: response.examsTaken ?? 0,
      averageScore: response.averageScore ?? 0,
      bestScore: response.bestScore ?? 0,
      upcomingExams: response.upcomingExams ?? 0,
      performance: response.performance ?? [],
      scoreTrend: response.scoreTrend ?? [],
      recentResults: response.recentResults ?? [],
      gradeDistribution: response.gradeDistribution ?? {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
      },
    };
  }

  getStudentDashboard(): Observable<StudentDashboardData> {
    return this.http
      .get<StudentDashboardData>(`${this.baseUrl}student-dashboard`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('✅ API Response received:', response);
          const validData = this.ensureValidStructure(response);
          console.log('📊 Showing API data:', validData);
          return validData;
        }),
        catchError((error) => {
          console.error('❌ API failed:', error);

          // Create a user-friendly error message based on status
          let errorMessage = 'Failed to load dashboard data. ';

          if (error.status === 401) {
            errorMessage += 'Please log in again.';
          } else if (error.status === 403) {
            errorMessage += 'You do not have permission to access this data.';
          } else if (error.status === 404) {
            errorMessage += 'Dashboard endpoint not found.';
          } else if (error.status === 500) {
            errorMessage += 'Server error. Please try again later.';
          } else if (error.status === 0) {
            errorMessage += 'Network error. Please check your connection.';
          } else {
            errorMessage += 'Please try again later.';
          }

          return throwError(() => ({
            status: error.status,
            message: errorMessage,
            originalError: error,
          }));
        }),
      );
  }


  refreshDashboard(): Observable<StudentDashboardData> {
    return this.getStudentDashboard();
  }
}
