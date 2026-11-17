"use server";

import { refresh } from "next/cache";
import {
  validateApplicationInput,
  type ApplicationInputErrors,
} from "./validation";
import { saveApplication, setApplicationStage } from "./applications";
import { validateStageChange } from "./stage-input";
import { logger } from "./logger";

export type ApplicationFormState = {
  errors: ApplicationInputErrors;
  message: string | null;
  values: { title: string; company: string; url: string };
};

export type StageFormState = {
  message: string | null;
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

export async function changeApplicationStage(
  previousState: StageFormState,
  formData: FormData,
): Promise<StageFormState> {
  const result = validateStageChange({
    id: formData.get("id"),
    stage: formData.get("stage"),
  });

  if (!result.ok) {
    return { message: result.errors.stage ?? result.errors.id ?? null };
  }

  const { id, stage } = result.data;
  let found: boolean;

  try {
    found = await setApplicationStage(id, stage);
  } catch (error) {
    logger.error("application.stage.failed", { error, applicationId: id });
    return { message: "The stage could not be saved. Please try again." };
  }

  if (!found) {
    return {
      message: "This application could not be found. It may have been removed.",
    };
  }

  refresh();

  return { message: null };
}
