import type { ModuleContent } from "../../../types/ModuleContent";
import data from "../data/capaian.json";

const raw = data as any;

const normalizeKurikulum = (): ModuleContent["capaian"]["kurikulum"] => {
  if (Array.isArray(raw.kurikulum)) {
    return raw.kurikulum;
  }
  const cp: string[] = Array.isArray(raw.kurikulum?.capaian_pembelajaran)
    ? raw.kurikulum.capaian_pembelajaran
    : [];
  const atp: string[] = Array.isArray(raw.kurikulum?.alur_tujuan_pembelajaran)
    ? raw.kurikulum.alur_tujuan_pembelajaran
    : [];
  const result: string[] = [];
  if (cp.length) {
    result.push("Capaian Pembelajaran (CP):", ...cp);
  }
  if (atp.length) {
    result.push("Alur Tujuan Pembelajaran (ATP):", ...atp);
  }
  return result;
};

const capaian: ModuleContent["capaian"] = {
  title: raw.title,
  description: raw.description,
  image: raw.image,
  skkni: raw.skkni,
  kurikulum: normalizeKurikulum(),
  tujuan: raw.tujuan,
  modelUrl: raw.modelUrl,
};

export default capaian;
