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
