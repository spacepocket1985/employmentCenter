// Описание: Конфигурация эндпоинтов для API
// Централизованное хранение всех путей

// ============================================
// Модуль: Сотрудники
// ============================================

/** Базовый эндпоинт для сотрудников */
export const employeesEndpoint: string = 'employees';

/** Эндпоинт для получения списка мастеров */
export const mastersEndpoint: string = 'employees/masters';

// ============================================
// Модуль: Дни рождения
// ============================================

/** Эндпоинт для получения ближайших ДР (виджет /hb) */
export const todayBirthdaysEndpoint: string = 'employees/hb';

/** Эндпоинт для получения полного списка ДР с фильтрами */
export const birthdaysEndpoint: string = 'employees/birthdays';

/** Эндпоинт для получения справочника отделов */
export const departmentsEndpoint: string = 'employees/departments';
