import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Menu, DayMenu } from 'src/types/menu.types';

interface MenuDisplayProps {
  menu: Menu;
  isLoading: boolean;
  error: string | null;
  formatPrice: (price: number) => string;
  isToday: (dateString: string) => boolean;
  handlePrint: () => void;
  refetchMenu: () => void;
  clearError: () => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({
  menu,
  isLoading,
  error,
  formatPrice,
  isToday,
  handlePrint,
  refetchMenu,
  clearError,
}) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={refetchMenu}
          startIcon={<RefreshIcon />}
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  if (menu.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="info">
          Меню пока не загружено. Пожалуйста, зайдите позже.
        </Alert>
        <Button
          variant="outlined"
          onClick={refetchMenu}
          startIcon={<RefreshIcon />}
          sx={{ mt: 2 }}
        >
          Обновить
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Заголовок */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #1976d2, #1a4ec2)',
          // background: 'linear-gradient(135deg, #103896, #1a4ec2)',
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Меню столовой
        </Typography>
        <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
          ТЭЦ-23 Гродно
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1, opacity: 0.8 }}>
          Обновлено: {new Date().toLocaleDateString('ru-RU')}
        </Typography>
      </Paper>

      {/* Кнопки управления */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refetchMenu}
          className="no-print"
        >
          Обновить
        </Button>
        {/* <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          className="no-print"
          sx={{ bgcolor: '#103896', '&:hover': { bgcolor: '#0a2c7a' } }}
        >
          Распечатать меню
        </Button> */}
      </Box>

      {/* Меню по дням */}
      {menu.map((day: DayMenu) => (
        <Paper
          key={day.date}
          sx={{
            mb: 3,
            overflow: 'hidden',
            border: isToday(day.date)
              ? '2px solid #103896'
              : '1px solid #dee2e6',
          }}
        >
          {/* Заголовок дня */}
          <Box
            sx={{
              p: 2,
              bgcolor: isToday(day.date) ? '#e7f1ff' : '#f8f9fa',
              borderBottom: '1px solid #dee2e6',
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{
                fontWeight: 700,
                color: '#103896',
              }}
            >
              {day.date} — {day.dayOfWeek}
              {isToday(day.date) && (
                <Chip
                  label="Сегодня"
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
          </Box>

          {/* Таблица блюд */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, width: '8%' }}
                  >
                    №
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, width: '62%' }}
                  >
                    Наименование блюда
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, width: '15%' }}
                  >
                    Выход, г
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, width: '15%' }}
                  >
                    Цена, руб.
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {day.dishes.map((dish, index) => (
                  <TableRow
                    key={dish.number}
                    sx={{
                      '&:hover': { bgcolor: '#f8f9fa' },
                      bgcolor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{ color: '#6c757d', fontWeight: 500 }}
                    >
                      {dish.number}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ paddingLeft: 3, paddingRight: 3 }}
                    >
                      {dish.name}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: '#6c757d', fontWeight: 500 }}
                    >
                      {dish.weight}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: '#198754',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                      }}
                    >
                      {formatPrice(dish.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}

      {/* Подвал */}
      <Box
        sx={{
          mt: 4,
          pt: 2,
          borderTop: '1px solid #dee2e6',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          ТЭЦ-23 Гродно • Столовая • {new Date().getFullYear()}
        </Typography>
      </Box>

      {/* Стили для печати */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            .MuiPaper-root {
              box-shadow: none !important;
              border: 1px solid #ddd !important;
              page-break-inside: avoid;
            }
            .MuiButton-root {
              display: none !important;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default MenuDisplay;
