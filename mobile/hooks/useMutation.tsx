import useApi from "./useApi";

export const useMutation = <DataType,>(url: string, options?: RequestInit) => {
  const mutationOptions: RequestInit = {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json; charset=UTF-8",
    }),
  };
  return useApi<DataType>(url, { ...mutationOptions, ...options });
};
