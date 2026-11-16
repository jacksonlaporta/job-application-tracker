type Context = Record<string, unknown>;
type Level = "info" | "warn" | "error";

function now(): string {
  return new Date(performance.timeOrigin + performance.now()).toISOString();
}

function describeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      code: "code" in error ? String(error.code) : undefined,
      digest: "digest" in error ? String(error.digest) : undefined,
      stack: error.stack,
    };
  }

  return { message: String(error) };
}

function write(level: Level, event: string, context: Context = {}) {
  const { error, ...rest } = context;
  const entry = {
    time: new Date().toISOString(),
    level,
    event,
    ...rest,
    ...(error === undefined ? {} : { error: describeError(error) }),
  };

  let line: string;
  try {
    line = JSON.stringify(entry);
  } catch {
    line = JSON.stringify({
      time: now(),
      level,
      event,
      note: "The context could not be written as JSON",
    });
  }

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (event: string, context?: Context) => write("info", event, context),
  warn: (event: string, context?: Context) => write("warn", event, context),
  error: (event: string, context?: Context) => write("error", event, context),
};
