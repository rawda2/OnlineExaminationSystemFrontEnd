import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentDashboardService } from '../../../core/services/Student_dashboard/student_dashboard.service';
import { StudentDashboardData } from '../../../shared/interfaces/Dashboards/Student';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class StudentHome implements OnInit {
  dashboardData: StudentDashboardData | null = null;
  upcomingExams: any[] = [];
  loading = true;
  error: string | null = null;
  showTooltip: number | null = null;
  usingMockData = false;
  userName: string = '';

  private defaultDashboardData: StudentDashboardData = {
    examsTaken: 0,
    averageScore: 0,
    bestScore: 0,
    upcomingExams: 0,
    performance: [],
    scoreTrend: [],
    recentResults: [],
    gradeDistribution: { a: 0, b: 0, c: 0, d: 0 },
  };

  constructor(private dashboardService: StudentDashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();

    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userName = user.fullName?.toUpperCase() || '';
        console.log(this.userName);
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;
    this.usingMockData = false;

    this.dashboardService.getStudentDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
        console.log('Dashboard data loaded:', data);
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.dashboardData = this.defaultDashboardData;
        this.loading = false;
      },
    });
  }

  // Safe getter for template
  get safeDashboardData(): StudentDashboardData {
    return this.dashboardData || this.defaultDashboardData;
  }
 getBestScoreSubject(): string {
    if (this.safeDashboardData.recentResults && this.safeDashboardData.recentResults.length > 0) {
        const bestResult = this.safeDashboardData.recentResults.reduce((best, current) => {
            return current.score > best.score ? current : best;
        }, this.safeDashboardData.recentResults[0]);
        
        return bestResult.courseName || 'N/A';
    }
    
    if (this.safeDashboardData.performance && this.safeDashboardData.performance.length > 0) {
        const bestPerformance = this.safeDashboardData.performance.reduce((best, current) => {
            return current.averageScore > best.averageScore ? current : best;
        }, this.safeDashboardData.performance[0]);
        
        return bestPerformance.courseName || 'N/A';
    }
    
    return 'N/A';
}

  get performanceData() {
    return this.safeDashboardData.performance.map((p) => ({
      subject: p.courseName,
      score: p.averageScore,
    }));
  }

  // Transform trend data for the chart
  get trendData() {
    return this.safeDashboardData.scoreTrend.map((t) => ({
      month: t.monthName,
      score: t.averageScore,
    }));
  }

  // Transform recent results for display
  get recentResults() {
    return this.safeDashboardData.recentResults.map((r) => ({
      subject: r.courseName,
      score: r.score,
      date: new Date(r.submittedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      total: 100, // Assuming total is 100, adjust if needed
    }));
  }

  getScoreTrendPoints(): { x: number; y: number }[] {
    const data = this.trendData;
    if (!data.length) return [];

    const width = 600;
    const height = 200;
    const padding = 30;

    return data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - (point.score / 100) * (height - 2 * padding);
      return { x, y };
    });
  }

  getScoreTrendPath(): string {
    const points = this.getScoreTrendPoints();
    if (points.length === 0) return '';
    return points.reduce((path, point, index) => {
      return index === 0
        ? `M ${point.x},${point.y}`
        : `${path} L ${point.x},${point.y}`;
    }, '');
  }

  getTotalGrades(): number {
    const g = this.safeDashboardData.gradeDistribution;
    return g.a + g.b + g.c + g.d;
  }

  retry(): void {
    this.loadDashboard();
  }
}
