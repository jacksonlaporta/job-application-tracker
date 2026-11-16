"use server";

import { refresh } from "next/cache";
import {
  validateApplicationInput,
  type ApplicationInputErrors,
} from "./validation";
import { saveApplication } from "./applications";
import { logger } from "./logger";

export type ApplicationFormState = {
  errors: ApplicationInputErrors;
  message: string | null;
  values: { title: string; company: string; url: string };
};

function textOf(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export async function createApplication(
  previousState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const raw = {
    title: formData.get("title"),
    company: formData.get("company"),
    url: formData.get("url"),
  };

  const values = {
    title: textOf(raw.title),
    company: textOf(raw.company),
    url: textOf(raw.url),
  };

  const result = validateApplicationInput(raw);
  if (!result.ok) {
    return { errors: result.errors, message: null, values };
  }

  try {
    await saveApplication(result.data);
  } catch (error) {
    logger.error("application.create.failed", { error });
    return {
      errors: {},
      message: "The application could not be saved. Please try again.",
      values,
    };
  }

  refresh();

  return {
    errors: {},
    message: null,
    values: { title: "", company: "", url: "" },
  };
}
