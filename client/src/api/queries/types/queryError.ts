import type { DefaultError } from "@tanstack/react-query";

export type QueryError = DefaultError & {
  detail?: string;
};
