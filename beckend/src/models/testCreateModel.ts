import {
  QuestionType,
  ScaleType,
  ResultInterpretationType,
} from './test.model';

export type TestCreateModel = {
  title: string;
  description: string;
  shortDescription?: string;
  category: string | string[];
  isActive: boolean;
  estimatedTime?: number;
  questions: QuestionType[];
  scales?: ScaleType[];
  scoringMethod: 'sum' | 'average' | 'scale_based';
  interpretations: ResultInterpretationType[];
  showProgress: boolean;
  showScore: boolean;
  randomizeQuestions?: boolean;
  requireAllQuestions: boolean;
  randomizeOptions?: boolean;
  showCorrectAnswers?: boolean;
};
