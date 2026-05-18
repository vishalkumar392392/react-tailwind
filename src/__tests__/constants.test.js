import { describe, it, expect } from "vitest";
import { SIZES, QTY, SHOE_LIST } from "../constants.js";

describe("constants", () => {
  it("exposes the available shoe sizes", () => {
    expect(SIZES).toEqual([41, 42, 43, 44, 45, 46, 47]);
  });

  it("exposes the available quantity options", () => {
    expect(QTY).toEqual([1, 2, 3, 4, 5]);
  });

  it("provides four shoes with the expected shape", () => {
    expect(SHOE_LIST).toHaveLength(4);
    for (const shoe of SHOE_LIST) {
      expect(shoe).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          src: expect.any(String),
          className: expect.any(String),
          title: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
        }),
      );
    }
  });

  it("uses unique ids for each shoe", () => {
    const ids = SHOE_LIST.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
