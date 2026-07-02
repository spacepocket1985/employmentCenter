// Описание: Компонент для рендеринга вопроса в зависимости от типа
// Выбирает между QuestionSingle и QuestionMultiple

import React from 'react';
import { QuestionSingle, QuestionMultiple  } from '@components/tests';
import type { QuestionType} from 'src/types/tests.types';

/**
 * Props для QuestionRenderer
 */
type QuestionRendererProps = {
  /** Данные вопроса */
  question: QuestionType;
  /** Выбранные ID вариантов */
  selectedIds: string[];
  /** Обработчик выбора */
  onSelect: (optionIds: string[]) => void;
};

/**
 * Компонент для рендеринга вопроса
 * Определяет тип вопроса и рендерит соответствующий компонент
 */
export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  selectedIds,
  onSelect,
}: QuestionRendererProps): React.ReactElement => {
  // Обработчик для single вопроса
  const handleSingleSelect = (optionId: string): void => {
    onSelect([optionId]);
  };

  // В зависимости от типа вопроса рендерим соответствующий компонент
  if (question.type === 'multiple') {
    return (
      <QuestionMultiple
        questionId={question.id}
        text={question.text}
        options={question.options}
        selectedIds={selectedIds}
        onSelect={onSelect}
      />
    );
  }

  // По умолчанию single
  return (
    <QuestionSingle
      questionId={question.id}
      text={question.text}
      options={question.options}
      selectedId={selectedIds.length > 0 ? selectedIds[0] : null}
      onSelect={handleSingleSelect}
    />
  );
};