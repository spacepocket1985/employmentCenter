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
    
    /* Чипы (Chip компоненты) - полностью убираем границы и заливки */
    .MuiChip-root {
      background: none !important;
      background-color: transparent !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
      display: inline-block !important;
    }
    
    /* Убираем обводку и фон у обертки чипа */
    .MuiChip-root::before,
    .MuiChip-root::after {
      display: none !important;
    }
    
    /* Текст внутри чипа - обычный текст без рамок */
    .MuiChip-label {
      color: black !important;
      padding: 0 2px !important;
      font-size: inherit !important;
      line-height: inherit !important;
      background: none !important;
      border: none !important;
    }
    
    /* Убираем все возможные border-radius */
    .MuiChip-root,
    .MuiChip-label {
      border-radius: 0 !important;
    }
    
    /* Для чипов с иконками */
    .MuiChip-icon,
    .MuiChip-deleteIcon {
      display: none !important;
    }
    
    /* Блок утверждения на новой странице */
    .approval-block {
      page-break-before: always !important;
      margin-top: 2cm !important;
    }
    
    /* Заголовки градиентов */
    .plan-header {
      background: white !important;
      border: 2px solid black !important;
    }
    
    .plan-header * {
      color: black !important;
    }
    
    /* Стили для заголовка графика */
    h1, h2, h3, h4, h5, h6 {
      color: black !important;
    }
  }
`;

// Стили для цветных чипов (отключаем при печати)
export const CHIP_STYLES = {
  backgroundColor: 'rgb(16, 56, 150)',
  color: '#fff',
  '@media print': {
    background: 'none !important',
    backgroundColor: 'transparent !important',
    color: 'black !important',
    border: 'none !important',
    boxShadow: 'none !important',
    padding: '0 !important',
    '& .MuiChip-label': {
      padding: '0 2px !important',
      color: 'black !important',
      background: 'none !important',
      border: 'none !important',
    },
  },
} as const;
