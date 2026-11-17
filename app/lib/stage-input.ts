import { Stage } from "../generated/prisma/enums";

export type StageChange = {
  id: number;
  stage: Stage;
};

export type StageChangeErrors = {
  id?: string;
  stage?: string;
};

export type StageChangeResult =
  | { ok: true; data: StageChange }
  | { ok: false; errors: StageChangeErrors };

export type RawStageChange = {
  id: unknown;
  stage: unknown;
};

const stages: readonly string[] = Object.values(Stage);
const MAX_ID = 2147483647;

function isApplicationStage(value: unknown): value is Stage {
  return typeof value === "string" && stages.includes(value);
}

function parseId(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return id >= 1 && id <= MAX_ID ? id : null;
}

export function validateStageChange(raw: RawStageChange): StageChangeResult {
  const errors: StageChangeErrors = {};
  const id = parseId(raw.id);

  if (id === null) {
    errors.id =
      "This application could not be identified. Reload the page and try again";
  }

  if (!isApplicationStage(raw.stage)) {
    errors.stage = "Choose one of the stages in the list";
  }

  if (id === null || !isApplicationStage(raw.stage)) {
    return { ok: false, errors };
  }

  return { ok: true, data: { id, stage: raw.stage } };
}
