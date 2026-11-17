import { parseLoginAttempt } from "./login-attempt";

describe("parseLoginAttempt", () => {
  it("returns the state and the code verifier of a valid cookie", () => {
    const value = JSON.stringify({ state: "abc", codeVerifier: "xyz" });

    expect(parseLoginAttempt(value)).toEqual({
      state: "abc",
      codeVerifier: "xyz",
    });
  });

  it("leaves out any other field", () => {
    const value = JSON.stringify({
      state: "abc",
      codeVerifier: "xyz",
      admin: true,
    });

    expect(parseLoginAttempt(value)).toEqual({
      state: "abc",
      codeVerifier: "xyz",
    });
  });

  it.each([
    ["a missing cookie", undefined],
    ["an empty cookie", ""],
    ["text that is not JSON", "not json"],
    ["a number", "42"],
    ["null", "null"],
    ["a missing state", JSON.stringify({ codeVerifier: "xyz" })],
    ["a missing code verifier", JSON.stringify({ state: "abc" })],
    [
      "a state that is not text",
      JSON.stringify({ state: 1, codeVerifier: "xyz" }),
    ],
    ["an empty state", JSON.stringify({ state: "", codeVerifier: "xyz" })],
    [
      "an empty code verifier",
      JSON.stringify({ state: "abc", codeVerifier: "" }),
    ],
  ])("returns null for %s", (_name, value) => {
    expect(parseLoginAttempt(value)).toEqual(null);
  });
});
