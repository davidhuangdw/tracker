import {useCallback, useEffect, useState} from "react";
import {useToast} from "@/lib/hooks/toast";
import API from "@/app/constants/api.ts";

export function useFetchData<T>(
  url: string,
  onError?: (error: Error) => void
): {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reDo, setReDo] = useState(0);
  const {showError} = useToast();

  useEffect(() => {
    (async () => {
      if (!url) {
        setData(undefined);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(url);
        setData(response.data as T);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        setError(error);

        if (onError) {
          onError(error)
        } else {
          showError(`Failed to fetch data: ${error.message}`)
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [url, reDo, onError, showError]);

  return {
    data,
    loading,
    error,
    refetch: () => setReDo(r => r + 1)
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncRun<T> = (...args: any[]) => Promise<T>;

export function useAsyncRun<T>(
  run: AsyncRun<T>,
  onError?: (error: Error) => void
): [AsyncRun<T>, boolean, Error | null] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {showError} = useToast();

  const wrapRun: AsyncRun<T> = useCallback(async (...args): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      return await run(...args);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);

      if (onError) {
        onError(error);
      } else {
        showError(`AsyncRun failed: ${error.message}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [run, onError, showError]);

  return [wrapRun, loading, error];
}
