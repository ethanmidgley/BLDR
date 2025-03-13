import { useState } from "react";

const API_PATH = "http://192.168.1.148:3000";

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
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as DataType;

      setData(json);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
      throw err;
    }

    return { data, status, error };
  };

  return [send, { data, status, error }];
};

// a query is an api with different preset values and automatically called

export default useApi;
