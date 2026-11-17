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
});
