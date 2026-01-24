export interface IExam {
  examId: number;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  passingScore: number;
  courseName: string;
}

export interface IExamDetails extends IExam {
  questions: IQuestion[];
}

export interface IQuestion {
  questionId: number;
  questionText: string;
  points: number;
  choices: IChoice[];
}

export interface IChoice {
  choiceId: number;
  choiceText: string;
}

