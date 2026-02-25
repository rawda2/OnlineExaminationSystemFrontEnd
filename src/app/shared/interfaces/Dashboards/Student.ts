export interface StudentDashboardData {
  examsTaken: number;
  averageScore: number;
  bestScore: number;
  upcomingExams: number;
  performance: PerformanceBySubject[];
  scoreTrend: ScoreTrend[];
  recentResults: RecentResult[];
  gradeDistribution: GradeDistribution;
}

export interface PerformanceBySubject {
  averageScore: any;
  courseName: any;
  subject: string;
  score: number;
}

export interface ScoreTrend {
  averageScore: any;
  monthName: any;
  month: string;
  score: number;
}

export interface RecentResult {
  submittedAt: string | number | Date;
  courseName: any;
  subject: string;
  date: string;
  score: number;
  total: number;
}

export interface GradeDistribution {
  a: number;
  b: number;
  c: number;
  d: number;
}
