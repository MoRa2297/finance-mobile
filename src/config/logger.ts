export const logQuery = (label: string, data: any) => {
  if (!__DEV__) return;

  console.tron?.display({
    name: 'QUERY',
    preview: label,
    value: data,
  });
};

export const logError = (label: string, error: any) => {
  if (!__DEV__) return;

  console.tron?.display({
    name: 'ERROR',
    preview: label,
    value: error,
    important: true,
  });
};
