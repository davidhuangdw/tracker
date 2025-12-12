import {useEffect, useState} from "react";
import API from "@/app/constants/api.ts";

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | undefined>()
  const [reDo, setReDo] = useState(0);
  useEffect(() => {
    (async() => {
      if(!url) return;
      setData((await API.get(url)).data as T)
    })()
  }, [url, reDo])

  return {
    data,
    refetch: () => setReDo(r => r+1)
  }
}