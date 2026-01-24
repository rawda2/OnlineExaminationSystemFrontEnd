// IAttempt.ts
export interface ICreateAttemptRequest {
  examId: number;
  studentId: number;
}

export interface ICreateAttemptResponse {
  attemptId: number;
  attemptNo: number;
  message: string;
}

export interface IAddAnswerRequest {
  attemptId: number;
  questionId: number;
  selectedChoiceId: number;
}

export interface ISubmitResponse {
  success: boolean;
  score: number;
  maxMarks: number;
  isPassed: boolean;
  percentage: number;
}

export interface IExamResult {
  success: boolean;
  attemptId: number;
  score: number;
  maxMarks: number;
  passingMarks: number;
  isPassed: boolean;
  percentage: number;
  message: string;
}

export interface IStudentAttempt {
  attemptId: number;
  examId: number;
  examTitle: string;
  score: number;
  totalMarks: number;
  passingMarks: number;
  percentage: number;
  isPassed: boolean;
  submittedAt: Date;
  attemptNo: number;
}