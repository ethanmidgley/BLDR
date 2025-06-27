import { useState } from "react";

export const API_PATH =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://devweb2024.cis.strath.ac.uk/mhb22136-nodejs";

type TransmissionData = {
  body?: object;
  params?: Record<string, string | number | boolean>;
};

type FetchStatus = "loading" | "error" | "success" | "not called";

type ApiResponse<DataType> = {
  data: DataType | null;
  status: FetchStatus;
  error: string | null;
  refetch: (variables?: TransmissionData) => Promise<ApiResponse<DataType>>;
};

const convertParams = (
  obj: Record<string, string | number | boolean>,
): string => {
  let s = "";

  for (const key in obj) {
    if (s.length !== 0) {
      s += "&";
    }
    s += key + "=" + encodeURIComponent(obj[key]);
  }
  return s;
};

export const useApi = <DataType,>(
  url: string,
  options?: RequestInit,
): [
  (variables?: TransmissionData) => Promise<ApiResponse<DataType>>,
  ApiResponse<DataType>,
] => {
  const [data, setData] = useState<DataType | null>(null);
  const [status, setStatus] = useState<FetchStatus>("not called");
  const [error, setError] = useState<string | null>(null);

  const send = async (
    variables?: TransmissionData,
  ): Promise<ApiResponse<DataType>> => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(
        API_PATH +
          url +
          ("?" + (variables?.params ? convertParams(variables?.params) : "")),
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify(variables?.body),
          ...options,
        },
      );
      const json = (await res.json()) as DataType;

      setData(json);
      setStatus("success");
      return { data: json, status: "success", error: null, refetch: send };
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
      return { data: null, status: "error", error: err.message, refetch: send };
    }
  };

  return [send, { data, status, error, refetch: send }];
};

// a query is an api with different preset values and automatically called

export default useApi;
