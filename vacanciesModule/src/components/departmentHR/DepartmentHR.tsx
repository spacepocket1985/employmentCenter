import { Box } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import { ButtonIcon } from '../moduleElements/ButtonIcon';

export const DepartmentHrInfo: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: '#103896',
        width: '100%',
        borderRadius: '5px',
        boxShadow:
          '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)',
        marginBottom: '5px',
      }}
    >
      {/* <Typography color="white" variant="body2">
        отдел кадров:
      </Typography> */}
      <ButtonIcon text="+375 (15) 245-33-57" textSize=".8rem">
        <LocalPhoneIcon style={{ marginRight: '5px' }} />
      </ButtonIcon>
      <ButtonIcon text="moroztatiana@energo.grodno.by" textSize=".8rem">
        <EmailIcon style={{ marginRight: '5px' }} />
      </ButtonIcon>
    </Box>
  );
};
