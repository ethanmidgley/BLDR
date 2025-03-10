import useApi from "./useApi";

export const useMutation = (url: string, options?: RequestInit) => {
  const mutationOptions: RequestInit = {
    method: "post",
  };
  return useApi(url, { ...mutationOptions, ...options });
};
