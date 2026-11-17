import { validateStageChange } from "./stage-input";

describe("validateStageChange", () => {
  it.each(["Saved", "Applied", "Interview", "Closed"])(
    "accepts the stage %s",
    (stage) => {
      const result = validateStageChange({ id: "12", stage });

      expect(result).toEqual({ ok: true, data: { id: 12, stage } });
    },
  );

  it("rejects a stage outside the list", () => {
    const result = validateStageChange({ id: "12", stage: "Archived" });

    expect(result).toEqual({
      ok: false,
      errors: { stage: expect.any(String) },
    });
  });

  it("rejects a stage written in another case", () => {
    const result = validateStageChange({ id: "12", stage: "applied" });

    expect(result).toEqual({
      ok: false,
      errors: { stage: expect.any(String) },
    });
  });

  it("rejects a missing id and a missing stage, and reports both", () => {
    const result = validateStageChange({ id: null, stage: null });

    expect(result).toEqual({
      ok: false,
      errors: { id: expect.any(String), stage: expect.any(String) },
    });
  });

  it.each(["abc", "1.5", "-3", ""])("rejects the id %s", (id) => {
    const result = validateStageChange({ id, stage: "Applied" });

    expect(result).toEqual({
      ok: false,
      errors: { id: expect.any(String) },
    });
  });

  it("rejects the id 0", () => {
    const result = validateStageChange({ id: "0", stage: "Applied" });

    expect(result).toEqual({
      ok: false,
      errors: { id: expect.any(String) },
    });
  });

  it("accepts the largest id that a PostgreSQL integer holds", () => {
    const id = "2147483647";
    const stage = "Applied";
    const result = validateStageChange({ id, stage });

    expect(result).toEqual({ ok: true, data: { id: 2147483647, stage } });
  });

  it("rejects the first id above the largest", () => {
    const id = "2147483648";
    const stage = "Applied";
    const result = validateStageChange({ id, stage });

    expect(result).toEqual({
      ok: false,
      errors: { id: expect.any(String) },
    });
  });

  it("rejects an id that is not text", () => {
    const result = validateStageChange({ id: 12, stage: "Applied" });

    expect(result).toEqual({
      ok: false,
      errors: { id: expect.any(String) },
    });
  });
});
