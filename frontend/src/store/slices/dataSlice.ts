import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
  education: string[];
  experience: string[];
  department: string[];
  activities: string[]; // Мероприятия
  responsiblePersons: string[]; // Ответственные лица
  timeActivities: string[];
  query: string;
}

const initialState: DataState = {
  education: [
    '',
    'общее среднее',
    'профессионально-техническое',
    'среднее специальное',
    'высшее',
    'научно-ориентированное',
    'возможность обучения',
    'не имеет значения',
  ],

  experience: [
    '',
    'не имеет значения',
    'без опыта',
    'от 1 года до 3 лет',
    'от 3 до 6 лет',
    'более 6 лет',
  ],

  department: [
    '',
    'АУП',
    'КЦ',
    'ТЦ',
    'ЭЦ',
    'ПГТЦ',
    'ЭЦ',
    'ХЦ',
    'ЦТАИ',
    'СППР',
    'ПТО',
    'ОНиОТ',
    'ОМТС',
    'ОКиПР',
    'ОКС',
    'ПЭО',
    'УБиНУ',
    'ЦОП',
    'ЛНКиТД',
    'ЦТП',
    'РСЦ',
  ],

  // Список стандартных мероприятий
  activities: [
    'Совещание по ремонтам и наведению порядка',
    'Совещание с начальниками цехов',
    'Совещание по планам работ',
    'Совещание по капстроительству',
    'Предэкзаменационная подготовка перед проверкой знаний',
    'Совещание по режимам и ТЭП',
    'Селекторное совещание «Белэнерго»',
    'Психологическое тестирование персонала',
    'Проверка состояния эксплуатации, охраны труда, промышленной и пожарной безопасности',
    'Производственно-техническое обучение',
    'Занятия по охране труда',
    'Санитарный день',
    'Предоставление информации в ПТО',
    'Единый день информирования',
    'Заседание комиссии об оказании материальной помощи',
    'Занятия с санитарной дружиной',
    'Производственно-техническая учёба с ремонтным персоналом',
    'Отчёт о выполнении приказов, предписаний, планов мероприятий',
    'Цеховые собрания',
    'Проверка знаний в комиссии ТЭЦ-2',
    'Производственно-техническое обучение с вахтой',
  ],

  // Список стандартных ответственных
  responsiblePersons: [
    'Балабанович Д.С.',
    'Нач. цехов',
    'Оксентюк С.В.',
    'Матусевич А.В.',
    'Осьмак Т.С.',
    'Нач. СОУ',
    'Витецкий Ю.И.',
    'Гуж А.Г.',
  ],
  timeActivities: [
    '08:15',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '11:00',
    '12:00',
    '13:25',
    '14:00',
    '15:10',
    '16:00',
  ],

  query: '',
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    addActivity: (state, action: PayloadAction<string>) => {
      if (!state.activities.includes(action.payload)) {
        state.activities.push(action.payload);
      }
    },
    addTimeActivity: (state, action: PayloadAction<string>) => {
      if (!state.timeActivities.includes(action.payload)) {
        state.timeActivities.push(action.payload);
      }
    },
    addResponsiblePerson: (state, action: PayloadAction<string>) => {
      if (!state.responsiblePersons.includes(action.payload)) {
        state.responsiblePersons.push(action.payload);
      }
    },
  },
});

export default dataSlice.reducer;
export const { setQuery, addActivity, addResponsiblePerson, addTimeActivity } =
  dataSlice.actions;
