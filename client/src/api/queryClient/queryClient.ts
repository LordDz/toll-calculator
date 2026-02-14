import { TOAST_DURATION } from "@/constants/toast";
import { firstUpperCase } from "@/utils/text/firstUpperCase";
import { getMinutes } from "@/utils/time/time";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MutationError } from "../queries/types/mutationError";
import { QueryError } from "../queries/types/queryError";

export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: getMinutes(5),
        gcTime: getMinutes(10),
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: async (error, query) => {
        console.log("Network request failed", {
          error: error,
          query: query,
        });
  
        // Handle 401 errors
  
          const errorTyped = error as QueryError;
          toast.error(
            query.queryKey.length > 0
              ? firstUpperCase(query.queryKey[0] as string)
              : (errorTyped.detail ?? errorTyped.message),
            {
              duration: TOAST_DURATION,
              icon: "NetworkRequestFailure",
              id:
                query.queryKey.length > 0
                  ? (query.queryKey[0] as string)
                  : "query",
            },
          );
      },
    }),
    mutationCache: new MutationCache({
      onError: async (error, variables, context, mutation) => {
        console.log("Network push failed to send", {
          error: error,
          variables: variables,
          context: context,
          mutation: mutation,
        });
  
  
          const errorTyped = error as MutationError;
          toast.error(
            mutation.options.mutationKey &&
              mutation.options.mutationKey.length > 0
              ? (mutation.options.mutationKey[0] as string)
              : (errorTyped.detail ?? errorTyped.message),
            {
              duration: TOAST_DURATION,
              icon: "NetworkPushFailure",
              id: `${mutation.mutationId}`,
            },
          );
      },
    }),
  });
  