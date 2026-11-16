import type { Instrumentation } from "next";
import { logger } from "./app/lib/logger";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  logger.error("request.failed", {
    error,
    method: request.method,
    path: request.path,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
