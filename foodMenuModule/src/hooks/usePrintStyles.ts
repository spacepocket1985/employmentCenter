import { useMemo } from 'react';

interface UsePrintStylesOptions {
  dense?: boolean;
  fontSize?: number;
  margin?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const usePrintStyles = (options: UsePrintStylesOptions = {}): string => {
  const {
    dense = false,
    fontSize = 14,
    margin = '2cm',
    showHeader = true,
    showFooter = true,
  } = options;

  const printStyles = useMemo(() => {
    const headerFooterStyles = `
      ${showHeader ? '' : '.print-header { display: none !important; }'}
      ${showFooter ? '' : '.print-footer { display: none !important; }'}
    `;

    return `
      @media print {
        /* Основные настройки */
        @page {
          margin: ${margin};
          size: A4 portrait;
        }
        
        body * {
          visibility: hidden;
        }
        
        .print-area,
        .print-area * {
          visibility: visible;
        }
        
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          font-size: ${fontSize}pt !important;
        }
        
        /* Стили таблицы */
        .MuiTable-root {
          border-collapse: collapse !important;
          width: 100% !important;
        }
        
        .MuiTableCell-root {
          border: 1px solid #ddd !important;
          padding: ${dense ? '4px 2px' : '6px 4px'} !important;
          font-size: ${fontSize}pt !important;
        }
        
        .MuiTableCell-head {
          font-weight: bold !important;
          background-color: #f9f9f9 !important;
          font-size: ${fontSize + 1}pt !important;
        }
        
        /* Скрываем элементы */
        .no-print,
        .MuiButton-root,
        .MuiTabs-root,
        .MuiAlert-root {
          display: none !important;
        }
        
        /* Оптимизация отступов */
        .MuiContainer-root,
        .MuiBox-root,
        .MuiPaper-root {
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          max-width: 100% !important;
        }
        
        .menu-day {
          page-break-inside: avoid;
          margin-bottom: ${dense ? '10px' : '15px'} !important;
        }
        
        /* Заголовок и подвал */
        ${headerFooterStyles}
        
        .print-header h1 {
          margin: 0 0 5px 0 !important;
          font-size: ${fontSize + 7}pt !important;
        }
        
        .print-footer {
          font-size: ${fontSize - 1}pt !important;
        }
      }
      
      @media screen {
        .print-area {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .print-only {
          display: none;
        }
      }
    `;
  }, [dense, fontSize, margin, showHeader, showFooter]);

  return printStyles;
};
