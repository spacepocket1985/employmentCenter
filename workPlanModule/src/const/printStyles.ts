// Базовые стили для печати
export const PRINT_BASE_STYLES = {
  backgroundColor: 'white !important',
  color: 'black !important',
  border: '1px solid #000 !important',
  borderRadius: '0 !important',
} as const;

// Стили для заголовка таблицы при печати
export const PRINT_TABLE_HEADER_STYLES = {
  ...PRINT_BASE_STYLES,
  borderBottom: '2px solid #000 !important',
} as const;

// Стили для ячеек таблицы при печати
export const PRINT_CELL_STYLES = {
  ...PRINT_BASE_STYLES,
} as const;

// Стили для строк таблицы при печати
export const PRINT_ROW_STYLES = {
  ...PRINT_BASE_STYLES,
} as const;

// Стили для заголовка плана при печати
export const PRINT_HEADER_STYLES = {
  ...PRINT_BASE_STYLES,
  background: 'white !important',
  border: '1px solid #000 !important',
} as const;

// Стили для иконок при печати
export const PRINT_ICON_STYLES = {
  color: '#666 !important',
  fill: '#666 !important',
} as const;

// Стили для текста при печати
export const PRINT_TEXT_STYLES = {
  color: 'black !important',
} as const;

export const PRINT_NO_BORDERS = {
  border: '0',
} as const;

// CSS для глобальных стилей печати
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
    }
    
    /* Отступы страницы */
    @page {
      margin: 0.5cm;
      size: A4 portrait;
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
  }
`;