export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error !== null && typeof error === 'object') {
    // Проверяем наличие свойства message у объекта
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }

    // Проверяем наличие свойства error у объекта
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }

  return 'An unknown error occurred';
}

// Type guard для проверки наличия message
export function hasMessageProperty(
  error: unknown
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}
