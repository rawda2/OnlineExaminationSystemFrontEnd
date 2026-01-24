export interface ICourse {
  courseId: number;
  courseCode: string;
  courseName: string;
  description: string;
  trackName: string;
}

export interface IQuestion {
  questionId: number;
  questionText: string;
  questionType: 'MCQ' | 'TF';
  defaultMark: number;
  choices: IChoice[];
}

export interface IChoice {
  choiceText: string;
  isCorrect: boolean;
}
