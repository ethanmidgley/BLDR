import { useState } from "react";

export const API_PATH =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://devweb2024.cis.strath.ac.uk/mhb22136-nodejs";

type FetchStatus = "loading" | "error" | "success" | "not called";

type ApiResponse<DataType> = {
  data: DataType | null;
  status: FetchStatus;
  error: string | null;
};

export const useApi = <DataType,>(
  url: string,
  options?: RequestInit,
): [
  (variables?: Object) => Promise<ApiResponse<DataType>>,
  ApiResponse<DataType>,
] => {
  const [data, setData] = useState<DataType | null>(null);
  const [status, setStatus] = useState<FetchStatus>("not called");
  const [error, setError] = useState<string | null>(null);

  const send = async (body?: Object): Promise<ApiResponse<DataType>> => {
    setStatus("loading");
    setData(null);
    setError(null);
    try {
      const res = await fetch(API_PATH + url, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(body),
        ...options,
      });
      const json = (await res.json()) as DataType;

      setData(json);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
      return { data: null, status: "error", error: err.message };
      throw err;
    }

    return { data, status, error };
  };

  return [send, { data, status, error }];
};

// a query is an api with different preset values and automatically called

export default useApi;
