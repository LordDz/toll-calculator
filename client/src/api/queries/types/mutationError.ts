import type { DefaultError } from "@tanstack/react-query";

export type MutationError = DefaultError & {
  mutationKey?: string[];
  detail?: string;
};
