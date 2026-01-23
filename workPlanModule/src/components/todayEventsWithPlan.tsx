import React from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableContainer,
  Paper,
  Link,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { WorkPlan, Event } from 'src/types/plan.types';
import { formatTodayDate, getTodayEvents } from '@utils/weekUtils';
import { EventRow } from './eventRow';
import { TodayEventsTableHeader } from './todayEventsTableHeader';

interface TodayEventsWithPlanProps {
  plan: WorkPlan;
  showTitle?: boolean;
  compact?: boolean;
}

export const TodayEventsWithPlan: React.FC<TodayEventsWithPlanProps> = ({
  plan,
  showTitle = true,
  compact = false,
}) => {
  const todayFormatted = formatTodayDate();
  const { day: todayPlan, hasValidPlan } = getTodayEvents(plan);

  // Если план не на текущий месяц
  if (!hasValidPlan) {
    if (!showTitle) return null;

    return (
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            backgroundColor: '#103896',
            padding: compact ? '0.5rem 0.75rem' : '0.75rem 1rem',
            borderRadius: '5px',
            width: '100%',
            mb: 1,
          }}
        >
          <CalendarTodayIcon
            sx={{
              mr: 1.5,
              color: 'white',
              fontSize: compact ? '1rem' : '1.25rem',
            }}
          />
          <Typography
            component="h3"
            variant={compact ? 'body2' : 'body1'}
            color={'white'}
            fontWeight={600}
            sx={{ textTransform: 'uppercase' }}
          >
            Мероприятия на сегодня
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ml: 2,
              color: 'rgba(255,255,255,0.8)',
              fontSize: compact ? '0.7rem' : '0.8rem',
            }}
          >
            {todayFormatted}
          </Typography>
        </Box>

        <Card
          variant="outlined"
          sx={{
            borderRadius: '5px',
            p: compact ? 2 : 3,
            textAlign: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Typography
            variant={compact ? 'body2' : 'body1'}
            color="text.secondary"
            gutterBottom
          >
            План не на текущий месяц
          </Typography>
        </Card>
      </Box>
    );
  }

  // Если на сегодня нет мероприятий
  if (!todayPlan || todayPlan.events.length === 0) {
    if (!showTitle) return null;

    return (
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            backgroundColor: '#103896',
            padding: compact ? '0.5rem 0.75rem' : '0.75rem 1rem',
            borderRadius: '5px',
            width: '100%',
            mb: 1,
          }}
        >
          <CalendarTodayIcon
            sx={{
              mr: 1.5,
              color: 'white',
              fontSize: compact ? '1rem' : '1.25rem',
            }}
          />
          <Typography
            component="h3"
            variant={compact ? 'body2' : 'body1'}
            color={'white'}
            fontWeight={600}
            sx={{ textTransform: 'uppercase' }}
          >
            Мероприятия на сегодня
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ml: 2,
              color: 'rgba(255,255,255,0.8)',
              fontSize: compact ? '0.7rem' : '0.8rem',
            }}
          >
            {todayFormatted}
          </Typography>
        </Box>

        <Card
          variant="outlined"
          sx={{
            borderRadius: '5px',
            p: compact ? 2 : 3,
            textAlign: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Typography
            variant={compact ? 'body2' : 'body1'}
            color="text.secondary"
            gutterBottom
          >
            На сегодня нет запланированных мероприятий
          </Typography>
          <Box
            sx={{
              p: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#103896',
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="http://tec23.grodno.energo.net/index.php/fullworkplan"
              sx={{
                color: '#fff',
                '&:hover': {
                  borderColor: '#103896',
                  backgroundColor: '#ced4da',
                },
              }}
            >
              Посмотреть весь план
            </Link>
          </Box>
        </Card>
      </Box>
    );
  }

  // Если есть мероприятия на сегодня
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {showTitle && (
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            backgroundColor: '#103896',
            padding: compact ? '0.5rem 0.75rem' : '0.75rem 1rem',
            borderRadius: '5px 5px 0 0',
            width: '100%',
            mb: 0,
          }}
        >
          <CalendarTodayIcon
            sx={{
              mr: 1.5,
              color: 'white',
              fontSize: compact ? '1rem' : '1.25rem',
            }}
          />
          <Typography
            component="h3"
            variant={compact ? 'body2' : 'body1'}
            color={'white'}
            fontWeight={600}
            sx={{ textTransform: 'uppercase' }}
          >
            Мероприятия на сегодня
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ml: 2,
              color: 'rgba(255,255,255,0.8)',
              fontSize: compact ? '0.7rem' : '0.8rem',
            }}
          >
            {todayFormatted}
          </Typography>
          {/* <Chip
            label={`${todayPlan.events.length} мероприятий`}
            size="small"
            sx={{
              ml: 2,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              height: compact ? 20 : 22,
              fontSize: compact ? '0.7rem' : '0.75rem',
            }}
          /> */}
        </Box>
      )}

      <Card
        variant="outlined"
        sx={{
          borderRadius: showTitle ? '0 0 5px 5px' : '5px',
          borderTop: showTitle ? 'none' : '1px solid #e0e0e0',
          overflow: 'hidden',
        }}
      >
        <TableContainer component={Paper} elevation={0}>
          <Table size={compact ? 'small' : 'medium'}>
            <TodayEventsTableHeader compact={compact} />
            <TableBody>
              {todayPlan.events.map((event: Event, index: number) => (
                <EventRow
                  key={event.id}
                  event={event}
                  index={index}
                  compact={compact}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!compact && (
          <Box
            sx={{
              p: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#103896',
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="http://tec23.grodno.energo.net/index.php/fullworkplan"
              sx={{
                color: '#fff',
                '&:hover': {
                  borderColor: '#103896',
                  backgroundColor: '#ced4da',
                },
              }}
            >
              Посмотреть весь план
            </Link>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TodayEventsWithPlan;
