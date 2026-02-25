export interface DashboardSummary {
  totalStudents: number;
  activeExams: number;
  classAverage: number;
  atRiskStudents: number;
}

export interface ExamPerformance {
  examTitle: string;
  averageScore: number;
}

export interface EnrollmentTrend {
  monthLabel: string;
  studentCount: number;
}
