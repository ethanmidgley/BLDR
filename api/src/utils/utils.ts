export const enforceIntQuery = (query: any, fallback: number) => {
  return typeof query === "string" ? parseInt(query) || fallback : fallback;
};

export const enforceFloatQuery = (query: any, fallback: number) => {
  return typeof query === "string" ? parseFloat(query) || fallback : fallback;
};
