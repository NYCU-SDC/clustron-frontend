import { describe, expect, it } from "vitest";
import en from "@/locales/en.json";
import zh from "@/locales/zh.json";

type Locale = { [key: string]: string | Locale };

function flatten(obj: Locale, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out[path] = value;
    else Object.assign(out, flatten(value, path));
  }
  return out;
}

const locales = {
  "en.json": flatten(en as Locale),
  "zh.json": flatten(zh as Locale),
};

describe("locales", () => {
  it("defines the same keys in every locale", () => {
    const enKeys = Object.keys(locales["en.json"]);
    const zhKeys = Object.keys(locales["zh.json"]);
    expect(
      enKeys.filter((k) => !zhKeys.includes(k)),
      "missing from zh.json",
    ).toEqual([]);
    expect(
      zhKeys.filter((k) => !enKeys.includes(k)),
      "missing from en.json",
    ).toEqual([]);
  });

  // Generic UI text (Save, Cancel, Loading...) belongs in the shared `common`
  // namespace so it is translated once. Re-declaring it inside a page namespace
  // is how en/zh drifted apart before -- three concepts had ended up with two
  // different zh translations each.
  describe.each(Object.entries(locales))("%s", (_name, entries) => {
    it("does not re-define a common value in a page namespace", () => {
      const common = Object.entries(entries).filter(([key]) =>
        key.startsWith("common."),
      );

      const offenders = Object.entries(entries)
        .filter(([key]) => !key.startsWith("common."))
        .flatMap(([key, value]) => {
          const shared = common.find(([, v]) => v.trim() === value.trim());
          return shared
            ? [
                `"${key}" duplicates ${shared[0]} ("${value}") — use t("${shared[0]}")`,
              ]
            : [];
        });

      expect(offenders).toEqual([]);
    });

    it("has no empty values", () => {
      const empty = Object.entries(entries)
        .filter(([, value]) => value.trim() === "")
        .map(([key]) => key);
      expect(empty).toEqual([]);
    });
  });
});
