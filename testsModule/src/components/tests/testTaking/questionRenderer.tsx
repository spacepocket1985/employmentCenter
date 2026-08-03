// Описание: Компонент для рендеринга вопроса в зависимости от типа

import React from 'react';
import { QuestionSingle, QuestionMultiple } from '@components/tests';
import type { QuestionType } from 'src/types/tests.types';

type QuestionRendererProps = {
  question: QuestionType;
  selectedIds: string[];
  onSelect: (optionIds: string[]) => void;
};

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  selectedIds,
  onSelect,
}: QuestionRendererProps): React.ReactElement => {
  const handleSingleSelect = (optionId: string): void => {
    onSelect([optionId]);
  };

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
