import { useStorageState } from "@/context/useStorageState";
import { useState } from "react";
import { router } from "expo-router";

export const API_PATH =
  process.env.EXPO_PUBLIC_API_URL || "https://nbldr.app";

type TransmissionData = {
  body?: object;
  params?: Record<string, string | number | boolean | undefined>;
};

export type RequestOptions<DataType> = RequestInit & {
  refetchPolicy?: (oldData: DataType, newData: DataType) => DataType;
};

type FetchStatus = "loading" | "error" | "success" | "not called";

type ApiResponse<DataType> = {
  data: DataType | null;
  status: FetchStatus;
  error: string | null;
  refetch: (
    variables?: TransmissionData,
    refetchOptions?: RequestOptions<DataType>,
  ) => Promise<ApiResponse<DataType>>;
};

const convertParams = (
  obj: Record<string, string | number | boolean | undefined>,
): string => {
  let s = "";

  for (const key in obj) {
    if (s.length !== 0) {
      s += "&";
    }
    if (obj[key]) {
      s += key + "=" + encodeURIComponent(obj[key]);
    }
  }
  return s;
};

export const useApi = <DataType,>(
  url: string,
  options?: RequestOptions<DataType>,
): [
  (variables?: TransmissionData) => Promise<ApiResponse<DataType>>,
  ApiResponse<DataType>,
] => {
  const [data, setData] = useState<DataType | null>(null);
  const [status, setStatus] = useState<FetchStatus>("not called");
  const [error, setError] = useState<string | null>(null);

  const [_, setSession] = useStorageState("session");

  const send = async (
    variables?: TransmissionData,
    sendOptions?: RequestOptions<DataType>,
  ): Promise<ApiResponse<DataType>> => {
    const finalOptions = {
      ...options,
      ...sendOptions,
    };

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
          ...finalOptions,
        },
      );

      if (!res.ok && res.status === 403) {
        setSession(null);
        router.replace("/login");
        throw Error("Forbidden: 403");
      }

      const json = (await res.json()) as DataType;

      if (finalOptions?.refetchPolicy && data != null) {
        setData(finalOptions.refetchPolicy(data, json));
      } else {
        setData(json);
      }
      setStatus("success");
      return {
        data: json,
        status: "success",
        error: null,
        refetch: send,
      };
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
      return {
        data: null,
        status: "error",
        error: err.message,
        refetch: send,
      };
    }
  };

  return [send, { data, status, error, refetch: send }];
};

// a query is an api with different preset values and automatically called

export default useApi;
