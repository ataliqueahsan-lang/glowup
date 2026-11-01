import assert from "node:assert/strict";
import test from "node:test";
import { AiError, parseJsonObject } from "../src/lib/ai.ts";

test("accepts a JSON object", () => {
  assert.deepEqual(parseJsonObject('{"improved":"hello"}'), { improved: "hello" });
});

test("rejects valid JSON that is not an object", () => {
  for (const raw of ["null", "[]", '"text"', "42", "true"]) {
    assert.throws(() => parseJsonObject(raw), (error) => {
      assert.ok(error instanceof AiError);
      assert.equal(error.kind, "bad_output");
      return true;
    });
  }
});

test("rejects malformed JSON with a safe error", () => {
  assert.throws(() => parseJsonObject("not json"), (error) => {
    assert.ok(error instanceof AiError);
    assert.equal(error.kind, "bad_output");
    assert.equal(error.message, "The AI reply could not be read.");
    return true;
  });
});
