import { useEffect } from "react";
import useApi from "./useApi";

export const useQuery = (url: string, options?: RequestInit) => {
  const queryOptions: RequestInit = { method: "get" };
  const [mutate, state] = useApi(url, { ...queryOptions, ...options });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return state;
};
