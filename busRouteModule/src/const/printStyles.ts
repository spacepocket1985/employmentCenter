// Добавляем специальные стили для черно-белой печати
export const PRINT_GLOBAL_STYLES = `
  @media print {
    /* Скрываем элементы с классом no-print */
    .no-print {
      display: none !important;
    }
    
    /* Показываем элементы с классом print-only */
    .print-only {
      display: block !important;
    }
    
    /* Глобальные настройки печати */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      
      /* Убираем все цветные заливки для черно-белой печати */
      background: white !important;
      background-color: white !important;
      color: black !important;
      border-color: black !important;
      
      /* Градиенты заменяем на сплошной цвет */
      background-image: none !important;
      
      /* Убираем тени */
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    /* Отступы страницы */
    @page {
      margin: 1.5cm;
      size: A4 portrait;
    }
    
    /* Стили для таблиц */
    table {
      border-collapse: collapse !important;
      width: 100% !important;
    }
    
    th, td {
      border: 1px solid #000 !important;
      padding: 8px !important;
      text-align: left !important;
    }
    
    /* Заголовки таблиц - жирный шрифт */
    th {
      font-weight: bold !important;
      background-color: #f0f0f0 !important;
    }
    
    /* Предотвращаем разрывы строк */
    tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    

    
    /* Блок утверждения на новой странице */
    .approval-block {
      page-break-before: always !important;
      margin-top: 2cm !important;
    }
    
    /* Заголовки градиентов */
    .gradient-header {
      background: white !important;
      border: 2px solid black !important;
      color: black !important;
    }
    
    /* Стили для заголовка графика */
    h1, h2, h3, h4, h5, h6 {
      color: black !important;
    }
    
    /* Специальные отметки (примечания) */
    .special-note {
      border: 1px dashed #000 !important;
      background: white !important;
      color: black !important;
    }
    
    /* Периоды (утро/вечер) */
    .period-morning, .period-evening {
      background: white !important;
      border: 1px solid #000 !important;
      color: black !important;
    }
    
    /* Бумажные компоненты (Paper) */
    .MuiPaper-root {
      background: white !important;
      border: 1px solid #000 !important;
      box-shadow: none !important;
    }
    
    /* Кнопки фильтрации */
    .MuiToggleButton-root,
    .MuiToggleButtonGroup-root {
      border: 1px solid #000 !important;
      background: white !important;
      color: black !important;
    }
    
    /* Выделенные кнопки */
    .Mui-selected {
      font-weight: bold !important;
      background: #f0f0f0 !important;
    }
    
    /* Селекты */
    .MuiSelect-select,
    .MuiFormControl-root {
      border: 1px solid #000 !important;
      background: white !important;
    }
    
    /* Разделители */
    .MuiDivider-root {
      border-color: #000 !important;
      background-color: #000 !important;
    }
    
    /* Stack компоненты */
    .MuiStack-root {
      background: white !important;
    }
  }
    
`;

// Вспомогательные функции для создания стилей с поддержкой печати
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const createPrintFriendlyStyles = (styles: any) => ({
  ...styles,
  '@media print': {
    background: 'none !important',
    backgroundColor: 'white !important',
    color: 'black !important',
    border: '1px solid #000 !important',
    boxShadow: 'none !important',
    textShadow: 'none !important',
    '& *': {
      background: 'none !important',
      backgroundColor: 'white !important',
      color: 'black !important',
    },
  },
});

// Стили для Paper компонентов
export const PAPER_STYLES = {
  '@media print': {
    background: 'white !important',
    border: '1px solid #000 !important',
    boxShadow: 'none !important',
  },
};

export const CHIP_STYLES = {
  backgroundColor: 'rgb(16, 56, 150)',
  color: '#fff',
  '@media print': {
    background: 'none !important',
    backgroundColor: 'transparent !important',
    color: 'black !important',
    border: '2px solid #fff !important', // Изменено с none на границу
    boxShadow: 'none !important',
    padding: '0 8px !important', // Изменено для отступов внутри границы
    margin: '0 4px 4px 0 !important', // Добавлен нижний отступ
    borderRadius: '16px !important', // Добавлено скругление

    '& .MuiChip-label': {
      padding: '4px 0 !important', // Увеличены отступы
      color: 'black !important',
      background: 'none !important',
      border: '2px solid #fff !important',
      fontSize: 'inherit !important',
    },

    '& .MuiChip-icon': {
      display: 'none !important',
    },

    // Добавлено для удаления возможных фоновых элементов
    '&::before, &::after': {
      display: 'none !important',
    },
  },
} as const;

// Стили для заголовков с градиентом
export const GRADIENT_HEADER_STYLES = {
  background: 'linear-gradient(135deg, #103896, #1a4ec2)',
  color: 'white',
  '@media print': {
    background: 'white !important',
    border: '2px solid #000 !important',
    color: 'black !important',
    '& *': {
      color: 'black !important',
    },
  },
};
