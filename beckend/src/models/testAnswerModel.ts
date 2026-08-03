// Description: Defines the data structure for user answers.

export type TestAnswerModel = {
  questionId: string;
  optionIds: string[];
};

export type TestSubmissionModel = {
  testId: string;
  answers: TestAnswerModel[];
  timeSpent?: number;
};

export type QuestionReviewType = {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
};
