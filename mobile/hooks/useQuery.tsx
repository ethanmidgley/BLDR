import { useEffect } from "react";
import useApi from "./useApi";

export const useQuery = <DataType,>(url: string, options?: RequestInit) => {
  const queryOptions: RequestInit = { method: "get" };
  const [mutate, state] = useApi<DataType>(url, {
    ...queryOptions,
    ...options,
  });

  useEffect(() => {
    mutate();
  }, []);

  return state;
};
