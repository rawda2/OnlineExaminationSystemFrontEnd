// instructor-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../../../core/services/instructor_dashboard/Instructor_dashboard.service';
import { forkJoin } from 'rxjs';

interface DashboardSummary {
  totalStudents: number;
  activeExams: number;
  classAverage: number;
  atRiskStudents: number;
}

interface ExamPerformance {
  examTitle: string;
  averageScore: number;
}

interface EnrollmentTrend {
  monthLabel: string;
  studentCount: number;
}

interface DashboardData {
  summary: DashboardSummary;
  examPerformance: ExamPerformance[];
  enrollmentTrend: EnrollmentTrend[];
  summaryChange?: {
    studentsChange: number;
    averageChange: number;
  };
}

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './instructor-home.component.html',
  styleUrls: ['./instructor-home.component.css'],
})
export class InstructorHomeComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  loading = true;
  error: string | null = null;
  instructorId = 4; // This should come from your auth service

  // Mock data for development when APIs return limited data
  private mockExamPerformance: ExamPerformance[] = [
    { examTitle: 'Advanced JS Exam 1', averageScore: 78 },
    { examTitle: 'Advanced JS Exam 2', averageScore: 82 },
    { examTitle: 'Advanced JS Exam 3', averageScore: 65 },
    { examTitle: 'Advanced JS Exam 4', averageScore: 91 },
    { examTitle: 'Advanced JS Exam 5', averageScore: 70 },
    { examTitle: 'Advanced JS Exam 6', averageScore: 88 },
  ];

  private mockEnrollmentTrend: EnrollmentTrend[] = [
    { monthLabel: 'Sep', studentCount: 45 },
    { monthLabel: 'Oct', studentCount: 68 },
    { monthLabel: 'Nov', studentCount: 82 },
    { monthLabel: 'Dec', studentCount: 110 },
    { monthLabel: 'Jan', studentCount: 135 },
    { monthLabel: 'Feb', studentCount: 162 },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    const summary$ = this.dashboardService.getSummary(this.instructorId);
    const examPerformance$ = this.dashboardService.getExamPerformance(
      this.instructorId,
    );
    const enrollmentTrend$ = this.dashboardService.getEnrollmentTrend(
      this.instructorId,
    );

    forkJoin({
      summary: summary$,
      examPerformance: examPerformance$,
      enrollmentTrend: enrollmentTrend$,
    }).subscribe({
      next: (data) => {
        this.dashboardData = {
          summary: data.summary,
          examPerformance:
            data.examPerformance.length > 0
              ? data.examPerformance
              : this.mockExamPerformance,
          enrollmentTrend:
            data.enrollmentTrend[0]?.monthLabel !== 'MMM'
              ? data.enrollmentTrend
              : this.mockEnrollmentTrend,
          summaryChange: {
            studentsChange: 8,
            averageChange: 3,
          },
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.error = 'Failed to load dashboard data. Please try again.';

        this.dashboardData = {
          summary: {
            totalStudents: 162,
            activeExams: 5,
            classAverage: 74,
            atRiskStudents: 8,
          },
          examPerformance: this.mockExamPerformance,
          enrollmentTrend: this.mockEnrollmentTrend,
          summaryChange: {
            studentsChange: 8,
            averageChange: 3,
          },
        };
        this.loading = false;
      },
    });
  }

  getUpcomingExamsCount(): number {
    return this.dashboardData?.summary.activeExams || 0;
  }

  getEnrollmentBarHeight(studentCount: number): number {
    const maxCount = 180;
    return (studentCount / maxCount) * 180;
  }

  retry(): void {
    this.loadDashboardData();
  }
  showTooltip: number | null = null;
  getExamShortName(title: string, index: number): string {
    const defaultNames = [
      'Exam 1',
      'Exam 2',
      'Exam 3',
      'Exam 4',
      'Midterm',
      'Exam 5',
    ];
    return defaultNames[index] || title;
  }
  getEnrollmentPath(): string {
    if (!this.dashboardData?.enrollmentTrend) return '';

    const data = this.dashboardData.enrollmentTrend;
    const width = 600;
    const height = 200;
    const maxValue = 180; // Max Y value

    const points = data.map((item: any, i: number) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (item.studentCount / maxValue) * height;
      return { x, y };
    });

    // Create smooth curve using quadratic bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;

      path += ` Q ${controlX} ${current.y}, ${next.x} ${next.y}`;
    }

    return path;
  }

  // Get enrollment area path (for background fill)
  getEnrollmentAreaPath(): string {
    if (!this.dashboardData?.enrollmentTrend) return '';

    const data = this.dashboardData.enrollmentTrend;
    const width = 600;
    const height = 200;
    const maxValue = 180;

    const points = data.map((item: any, i: number) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (item.studentCount / maxValue) * height;
      return { x, y };
    });

    // Start from bottom left
    let path = `M 0 ${height}`;

    // Line to first point
    path += ` L ${points[0].x} ${points[0].y}`;

    // Smooth curve through points
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;

      path += ` Q ${controlX} ${current.y}, ${next.x} ${next.y}`;
    }

    // Line down to bottom right and close
    path += ` L ${width} ${height} L 0 ${height} Z`;

    return path;
  }

  // Get enrollment points for circles
  getEnrollmentPoints(): Array<{ x: number; y: number }> {
    if (!this.dashboardData?.enrollmentTrend) return [];

    const data = this.dashboardData.enrollmentTrend;
    const width = 600;
    const height = 200;
    const maxValue = 180;

    return data.map((item: any, i: number) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (item.studentCount / maxValue) * height;
      return { x, y };
    });
  }
}

