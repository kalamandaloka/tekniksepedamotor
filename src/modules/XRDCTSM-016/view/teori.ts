import type { ModuleContent } from "../../../types/ModuleContent";
import data from "../data/teori.json";

const raw = data as any;

const teori: ModuleContent["teori"] = {
  title: raw.title,
  content: raw.content,
  pages: (raw.pages ?? []).map((p: any) => ({
    title: p.title,
    content: p.content ?? "",
    image: p.image,
    contentL1: p.contentL1,
    contentL2: p.contentL2,
    contentL3: p.contentL3,
    subSections: Array.isArray(p.subSections)
      ? p.subSections.map((s: any) => ({
          title2: s.title2,
          content2: s.content2,
          content2Parts: s.content2Parts,
          items: Array.isArray(s.items)
            ? s.items.map((it: any) => ({
                title3: it.title3,
                content3: it.content3,
              }))
            : [],
        }))
      : undefined,
  })),
  references: raw.references,
};

export default teori;
