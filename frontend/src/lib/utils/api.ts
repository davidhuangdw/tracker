import {useCallback, useEffect, useState} from "react";
import API from "@/app/constants/api.ts";

export function useFetchData<T>(url: string): {
  data: T | undefined;
  loading: boolean;
  refetch: () => void;
} {
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState(false);
  const [reDo, setReDo] = useState(0);
  useEffect(() => {
    (async () => {
      if (!url) {
        setData(undefined);
        return;
      }
      try{
        setLoading(true);
        setData((await API.get(url)).data as T)
      }finally {
        setLoading(false);
      }
    })()
  }, [url, reDo])

  return {
    data,
    loading,
    refetch: () => setReDo(r => r + 1)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncRun<T> = (...args: any[]) => Promise<T>;

export function useAsyncRun<T>(run: AsyncRun<T>): [AsyncRun<T>, boolean] {
  const [loading, setloading] = useState(false);
  const wrapRun: AsyncRun<T>= useCallback(async (...args): Promise<T> => {
    try {
      setloading(true);
      return await run(...args)
    }finally {
      setloading(false);
    }
  }, [run])
  return [wrapRun, loading]
}