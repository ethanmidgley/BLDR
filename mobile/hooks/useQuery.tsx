import { useEffect } from "react";
import useApi, { RequestOptions } from "./useApi";

export const useQuery = <DataType,>(
  url: string,
  options?: RequestOptions<DataType>,
) => {
  const queryOptions: RequestInit = { method: "get" };
  const [mutate, state] = useApi<DataType>(url, {
    ...queryOptions,
    ...options,
  });

  useEffect(() => {
    mutate();
  }, [url]);

  return state;
};
