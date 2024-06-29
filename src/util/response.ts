const createSuccessResponse = (code: number, message: string, data: any) => {
  return {
    status: 'success',
    code,
    message,
    data,
  };
};

const createErrorResponse = (code: number, message: string) => {
  return {
    status: 'error',
    code,
    message,
    data: null,
  };
};

export { createSuccessResponse, createErrorResponse };
