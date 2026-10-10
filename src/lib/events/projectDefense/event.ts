import type { StudyEvent } from "../types";
import { block1 as pd1 } from "./block1";
import { block2 as pd2 } from "./block2";
import { block3 as pd3 } from "./block3";
import { block4 as pd4 } from "./block4";
import { block5 as pd5 } from "./block5";
import { block6 as pd6 } from "./block6";
import { block7 as pd7 } from "./block7";
import { cheatSheet as pdCheatSheet, glossary as pdGlossary } from "./extras";

// Ивент одной команды: защита своего проекта по их же отчёту. Только по
// ссылке — в общем списке его нет (см. StudyEvent.unlisted).
/** Ивент целиком: грузится отдельным чанком (см. lib/events/client.ts). */
export const event: StudyEvent = {
  id: "yeahtrack-defense",
  title: "Подготовка к защите проекта",
  course: "Project Management · YeahTrack",
  description:
    "Не теория ради теории, а ваш проект: что написано в отчёте, какая идея из лекций за этим стоит, как сказать это на защите по-английски и что может спросить комиссия — со слабыми местами и честными ответами. Семь блоков по разделам отчёта, после каждой части — квиз на 15 вопросов, карточки «вопрос комиссии → ответ» и шпаргалка с цифрами проекта.",
  lectures: [pd1, pd2, pd3, pd4, pd5, pd6, pd7],
  counts: { part: 15, lecture: 20, final: 40 },
  glossary: pdGlossary,
  cheatSheet: pdCheatSheet,
  cards: "questions",
  unlisted: true,
};
