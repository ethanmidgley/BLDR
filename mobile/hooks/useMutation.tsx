import useApi, { RequestOptions } from "./useApi";

export const useMutation = <DataType,>(
  url: string,
  options?: RequestOptions<DataType>,
) => {
  const mutationOptions: RequestInit = {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json; charset=UTF-8",
    }),
  };
  return useApi<DataType>(url, { ...mutationOptions, ...options });
};
