// Описание: Конфигурация эндпоинтов для API
// Централизованное хранение всех путей

/** Базовый эндпоинт для тестов */
export const testsEndpoint: string = 'tests';

/** Эндпоинт для отправки результатов теста */
export const submitTestEndpoint: string = 'tests/submit';

/** Базовый эндпоинт для сотрудников */
export const employeesEndpoint: string = 'employees';

/** Эндпоинт для получения списка мастеров */
export const mastersEndpoint: string = 'employees/masters';

/** Эндпоинт для получения сессий тестов */
export const testSessionsEndpoint: string = 'tests/sessions';

/** Эндпоинт для получения статистики сессий */
export const testSessionsStatsEndpoint: string = 'tests/sessions/stats';
