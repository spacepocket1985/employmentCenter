import { Typography } from '@mui/material';

export const NoteForPlan: React.FC = () => {
  return (
    <Typography align="right" variant="subtitle2" sx={{ mb: 1 }}>
      Примечание: Информация о необходимости проведения совещаний ежедневно
      будет доводиться руководством филиала на утренних селекторных совещаниях.
    </Typography>
  );
};
