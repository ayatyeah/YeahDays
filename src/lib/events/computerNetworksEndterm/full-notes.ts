import baseRu from "./notes.json";
import baseEn from "./notes-en.json";
import supplements from "./question-supplements.json";
import courseSupplements from "./course-supplements.json";

// The original notes remain the source snapshot for the published video season.
function combine(base: typeof baseRu, lang: "ru" | "en"): Record<string, string> {
  return Object.fromEntries(Object.entries(base).map(([module, text]) => [module,
    `${text}\n\n${supplements[module as keyof typeof supplements][lang]}\n\n${courseSupplements[module as keyof typeof courseSupplements][lang]}`,
  ]));
}
export const fullRu = combine(baseRu, "ru");
export const fullEn = combine(baseEn, "en");
