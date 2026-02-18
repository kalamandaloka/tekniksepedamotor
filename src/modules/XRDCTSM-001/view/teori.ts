import type { ModuleContent } from "../../../types/ModuleContent";
import data from "../data/teori.json";

const raw = data as ModuleContent["teori"];

const parseHeadings = (text: string) => {
  const lines = text.split(/\r?\n/);
  let idx = 0;
  let heading: string | undefined;
  let subheading: string | undefined;
  const hMatch = lines[idx]?.match(/^#{1,6}\s*(.+)$/);
  if (hMatch) {
    heading = hMatch[1].trim();
    idx += 1;
  }
  const shMatch = lines[idx]?.match(/^#{2,6}\s*(.+)$/);
  if (shMatch) {
    subheading = shMatch[1].trim();
    idx += 1;
  }
  const body = lines.slice(idx).join("\n");
  return { heading, subheading, body };
};

const teori: ModuleContent["teori"] = {
  title: raw.title,
  content: raw.content,
  pages: (raw.pages ?? []).map((p) => {
    const parsed = parseHeadings(p.content);
    const title =
      p.title ??
      (parsed.heading && parsed.subheading
        ? `${parsed.heading} : ${parsed.subheading}`
        : parsed.heading ?? undefined);
    return {
      title,
      content: parsed.body,
      image: p.image,
      contentL1: p.contentL1,
      contentL2: p.contentL2,
      contentL3: p.contentL3,
      contentL4: (p as any).contentL4,
      contentL5: (p as any).contentL5,
      contentL6: (p as any).contentL6,
      contentL7: (p as any).contentL7,
      contentL8: (p as any).contentL8,
      contentL9: (p as any).contentL9,
      subSections: p.subSections,
    };
  }),
  references: raw.references,
};

export default teori;
