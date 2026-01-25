import React from 'react';
import { Box, Typography } from '@mui/material';

const PrintApproval: React.FC = () => {
  return (
    <Box
      className="print-only"
      sx={{
        display: 'none',
        textAlign: 'right',
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        УТВЕРЖДАЮ
      </Typography>
      <Typography variant="body1" mb={4}>
        Директор станции __________________ Балабанович Д.С.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        __ ___________ 2026 г.
      </Typography>
    </Box>
  );
};

export default PrintApproval;
