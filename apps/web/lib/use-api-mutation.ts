import { useState, useTransition } from "react";

export function useApiMutation(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const mutate = async (
    fn: () => Promise<any>,
    successMsg: string
  ) => {
    startTransition(async () => {
      setMessage(null);
      try {
        await fn();
        setMessage(successMsg);
        onSuccess?.();
      } catch (error) {
        let msg = "An unexpected error occurred.";
        if (error instanceof Error) {
          if (error.message.includes("timed out")) {
             msg = "Request timed out. Please check your connection.";
          } else if (error.message.includes("failed")) {
             msg = error.message;
          } else {
             msg = error.message;
          }
        }
        setMessage(`Error: ${msg}`);
        onError?.(error as Error);
      }
    });
  };

  return { mutate, isPending, message, setMessage };
}
