export type NewApplication = {
  title: string;
  company: string;
  url: string | null;
};

export type ApplicationInputErrors = {
  title?: string;
  company?: string;
  url?: string;
};

export type ApplicationInputResult =
  | { ok: true; data: NewApplication }
  | { ok: false; errors: ApplicationInputErrors };

export type RawApplicationInput = {
  title: unknown;
  company: unknown;
  url: unknown;
};

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function isHttpUrl(input: string) {
  const ALLOWED = new Set(["http:", "https:"]);
  let url;

  try {
    url = new URL(input);
  } catch {
    return false;
  }

  return ALLOWED.has(url.protocol);
}

export function validateApplicationInput(
  raw: RawApplicationInput,
): ApplicationInputResult {
  const errors: ApplicationInputErrors = {};
  const title = cleanText(raw.title);
  const company = cleanText(raw.company);
  const urlText = cleanText(raw.url);
  let url: string | null = null;

  if (title === null) {
    errors.title = "Enter the job title";
  }

  if (company === null) {
    errors.company = "Enter the company's name";
  }

  if (urlText !== null) {
    if (isHttpUrl(urlText)) {
      url = new URL(urlText).href;
    } else {
      errors.url =
        "Enter a URL that starts with http:// or https://, such as https://example.com/jobs/123";
    }
  }

  if (title === null || company === null || errors.url !== undefined) {
    return { ok: false, errors };
  }

  return { ok: true, data: { title, company, url } };
}
