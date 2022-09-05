import { TRPCClientErrorLike } from "@trpc/client";
import NextError from "next/error";
import type { AppRouter } from "../server/router/index";
import {
  QueryObserverIdleResult,
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
  UseQueryResult,
} from "react-query";

type JSXElementOrNull = JSX.Element | null;

type ErrorResult<TData, TError> =
  | QueryObserverLoadingErrorResult<TData, TError>
  | QueryObserverRefetchErrorResult<TData, TError>;

interface CreateQueryCellOptions<TError> {
  error: (query: ErrorResult<unknown, TError>) => JSXElementOrNull;
  loading: (
    query: QueryObserverLoadingResult<unknown, TError>
  ) => JSXElementOrNull;
  idle: (query: QueryObserverIdleResult<unknown, TError>) => JSXElementOrNull;
}

interface QueryCellOptions<TData, TError> {
  query: UseQueryResult<TData, TError>;
  error?: (query: ErrorResult<TData, TError>) => JSXElementOrNull;
  loading?: (
    query: QueryObserverLoadingResult<TData, TError>
  ) => JSXElementOrNull;
  idle?: (query: QueryObserverIdleResult<TData, TError>) => JSXElementOrNull;
}

interface QueryCellOptionsWithEmpty<TData, TError>
  extends QueryCellOptions<TData, TError> {
  success: (
    query: QueryObserverSuccessResult<NonNullable<TData>, TError>
  ) => JSXElementOrNull;
  empty: (query: QueryObserverSuccessResult<TData, TError>) => JSXElementOrNull;
}
interface QueryCellOptionsNoEmpty<TData, TError>
  extends QueryCellOptions<TData, TError> {
  success: (
    query: QueryObserverSuccessResult<TData, TError>
  ) => JSXElementOrNull;
}

function createQueryCell<TError>(
  queryCellOpts: CreateQueryCellOptions<TError>
) {
  function QueryCell<TData>(
    opts: QueryCellOptionsWithEmpty<TData, TError>
  ): JSXElementOrNull;
  function QueryCell<TData>(
    opts: QueryCellOptionsNoEmpty<TData, TError>
  ): JSXElementOrNull;
  function QueryCell<TData>(
    opts:
      | QueryCellOptionsNoEmpty<TData, TError>
      | QueryCellOptionsWithEmpty<TData, TError>
  ) {
    const { query } = opts;

    if (query.status === "success") {
      if (
        "empty" in opts &&
        (query.data == null ||
          (Array.isArray(query.data) && query.data.length === 0))
      ) {
        return opts.empty(query);
      }
      return opts.success(
        query as QueryObserverSuccessResult<NonNullable<TData>, TError>
      );
    }

    if (query.status === "error") {
      return opts.error?.(query) ?? queryCellOpts.error(query);
    }
    if (query.status === "loading") {
      return opts.loading?.(query) ?? queryCellOpts.loading(query);
    }
    if (query.status === "idle") {
      return opts.idle?.(query) ?? queryCellOpts.idle(query);
    }
    return null;
  }
  return QueryCell;
}

type TError = TRPCClientErrorLike<AppRouter>;

export const DefaultQueryCell = createQueryCell<TError>({
  error: (result) => (
    <NextError
      title={result.error.message}
      statusCode={result.error.data?.httpStatus ?? 500}
    />
  ),
  idle: () => <div>Loading...</div>,
  loading: () => <div>Loading...</div>,
});
