import { validateApplicationInput } from "./validation";

describe("validateApplicationInput", () => {
  it("accepts a company and a job title and returns them trimmed", () => {
    const raw = {
      title: "  Software Engineer ",
      company: " Google  ",
      url: null,
    };

    const result = validateApplicationInput(raw);

    expect(result).toEqual({
      ok: true,
      data: { title: "Software Engineer", company: "Google", url: null },
    });
  });

  it("rejects an empty company", () => {
    const result = validateApplicationInput({
      title: "Software Engineer",
      company: "",
      url: null,
    });

    expect(result).toEqual({
      ok: false,
      errors: { company: expect.any(String) },
    });
  });

  it("rejects a null company", () => {
    const result = validateApplicationInput({
      title: "Software Engineer",
      company: null,
      url: null,
    });

    expect(result).toEqual({
      ok: false,
      errors: { company: expect.any(String) },
    });
  });

  it("rejects a company made only of spaces", () => {
    const result = validateApplicationInput({
      title: "Software Engineer",
      company: "   ",
      url: null,
    });

    expect(result).toEqual({
      ok: false,
      errors: { company: expect.any(String) },
    });
  });

  it("rejects an empty job title", () => {
    const result = validateApplicationInput({
      title: "",
      company: "Google",
      url: null,
    });

    expect(result).toEqual({
      ok: false,
      errors: { title: expect.any(String) },
    });
  });

  it("rejects a null job title", () => {
    const result = validateApplicationInput({
      title: null,
      company: "Google",
      url: null,
    });

    expect(result).toEqual({
      ok: false,
      errors: { title: expect.any(String) },
    });
  });

  it("rejects a job title made only of spaces", () => {
    const result = validateApplicationInput({
      title: "   ",
      company: "Google",
      url: null,
    });

    expect(result).toEqual({
      ok: false,
      errors: { title: expect.any(String) },
    });
  });

  it("accepts a submission with no URL", () => {
    const result = validateApplicationInput({
      title: "Software Engineer",
      company: "Google",
      url: "",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        title: "Software Engineer",
        company: "Google",
        url: null,
      },
    });
  });

  it("reports every field that is wrong", () => {
    const result = validateApplicationInput({
      title: "",
      company: "",
      url: null,
    });

    expect(result).toEqual({
      ok: false,
      errors: {
        title: expect.any(String),
        company: expect.any(String),
      },
    });
  });

  it("accepts an http URL", () => {
    const result = validateApplicationInput({
      title: "Software Engineer",
      company: "Google",
      url: " http://www.google.co.uk ",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        title: "Software Engineer",
        company: "Google",
        url: "http://www.google.co.uk/",
      },
    });
  });

  it("accepts an https URL", () => {
    const result = validateApplicationInput({
      title: "Software Engineer",
      company: "Google",
      url: " https://www.google.co.uk ",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        title: "Software Engineer",
        company: "Google",
        url: "https://www.google.co.uk/",
      },
    });
  });

  it("rejects a URL with any other scheme", () => {
    const result = validateApplicationInput({
      title: "Software Engineer",
      company: "Google",
      url: " ftp://google.co.uk ",
    });

    expect(result).toEqual({
      ok: false,
      errors: { url: expect.any(String) },
    });
  });

  it("rejects text that is not a URL", () => {
    const result = validateApplicationInput({
      title: "Software Engineer",
      company: "Google",
      url: "google.co.uk",
    });

    expect(result).toEqual({
      ok: false,
      errors: { url: expect.any(String) },
    });
  });
});
