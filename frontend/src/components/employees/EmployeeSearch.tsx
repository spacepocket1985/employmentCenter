import { Button, Stack, TextField } from '@mui/material';
import { setQuery, useGetEmployeesByNameQuery } from '@store/slices';
import { useState } from 'react';
import { EmployeesList } from './EmployeesList';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';

export const EmployeeSearch: React.FC = () => {
  const { query } = useAppSelector((state) => state.data);
  const [serchTerm, setSearchTerm] = useState(query);

  const dispatch = useAppDispatch();

  const handleChangeTerm = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleSearchClick = () => dispatch(setQuery(serchTerm));

  const { data: employeesByName, isFetching } = useGetEmployeesByNameQuery(
    query,
    { skip: !query,refetchOnMountOrArgChange: true }
  );
  return (
    <Stack direction={'column'} sx={{ width: '50%' }}>
      <Stack spacing={2} alignItems={'center'} direction={'row'}>
        <TextField
          type="text"
          required
          label="Поиск сотрудника по фамилии"
          variant="standard"
          fullWidth
          value={serchTerm}
          onChange={handleChangeTerm}
        ></TextField>
        <Button
          variant="contained"
          disabled={serchTerm.length <= 2}
          onClick={handleSearchClick}
        >
          Поиск
        </Button>
      </Stack>
      <EmployeesList
        employees={employeesByName?.data || []}
        listTitle="Результаты поиска"
        isFetching={isFetching}
      />
    </Stack>
  );
};
