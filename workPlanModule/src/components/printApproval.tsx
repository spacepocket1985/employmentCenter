import React from 'react';
import { Box, Typography } from '@mui/material';

type PrintApprovalProps = { mounth: string };
const PrintApproval: React.FC<PrintApprovalProps> = ({ mounth }) => {
  return (
    <Box
      className="print-only"
      sx={{
        display: 'none',
        textAlign: 'right',
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        УТВЕРЖДЕНО
      </Typography>
      <Typography variant="body1" mb={4}>
        Директор станции  ________  Балабанович Д.С.
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {`${mounth} 2026 г.`}
      </Typography>
    </Box>
  );
};

export default PrintApproval;
