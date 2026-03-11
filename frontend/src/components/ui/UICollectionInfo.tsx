import { Box, Button, Chip } from '@mui/material';

type UICollectionInfoProps = {
  collectionLength: number;
  collectionTitle: string;
  onRefetch: () => void;
};

export const UICollectionInfo: React.FC<UICollectionInfoProps> = ({
  collectionLength,
  collectionTitle,
  onRefetch,
}) => {
  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box component="span" sx={{ typography: 'body2' }}>
          {collectionTitle}, общее количество:
        </Box>
        <Chip
          label={collectionLength}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      <Button variant="outlined" onClick={() => onRefetch()} size="small">
        Обновить список
      </Button>
    </Box>
  );
};