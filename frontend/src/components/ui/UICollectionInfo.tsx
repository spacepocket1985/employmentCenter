import { Box, Typography, Button, Chip } from '@mui/material';

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
      <Typography variant="body2">
        {collectionTitle}, общее колличество:{' '}
        <Chip
          label={collectionLength}
          
          color="primary"
          variant="outlined"
        />
      </Typography>

      <Button variant="outlined" onClick={() => onRefetch()} size="small">
        Обновить список
      </Button>
    </Box>
  );
};
