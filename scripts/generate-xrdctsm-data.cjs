const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const modulesDir = path.join(rootDir, "src", "modules");

const capaianTemplate = JSON.stringify(
  {
    title: "Capaian Pembelajaran",
    description:
      "Deskripsi umum capaian pembelajaran modul ini. Silakan sesuaikan dengan kompetensi spesifik.",
    skkni: [],
    kurikulum: [],
    tujuan: [],
  },
  null,
  2
);

const teoriTemplate = JSON.stringify(
  {
    title: "Teori Modul",
    content: "",
    pages: [],
  },
  null,
  2
);

const komponenTemplate = JSON.stringify(
  {
    title: "Komponen",
    items: [],
  },
  null,
  2
);

const sistemTemplate = JSON.stringify(
  {
    title: "Sistem dan Simulasi",
    simulations: [],
  },
  null,
  2
);

const evaluasiTemplate = JSON.stringify(
  {
    title: "Evaluasi",
    teori: {
      questions: [],
    },
    praktek: {
      tasks: [],
    },
  },
  null,
  2
);

const perawatanTemplate = JSON.stringify(
  {
    title: "Perawatan",
    content: "",
  },
  null,
  2
);

const capaianViewTs = [
  'import type { ModuleContent } from "../../../types/ModuleContent";',
  'import data from "../data/capaian.json";',
  "",
  'const capaian = data as ModuleContent["capaian"];',
  "",
  "export default capaian;",
  "",
].join("\n");

const teoriViewTs = [
  'import type { ModuleContent } from "../../../types/ModuleContent";',
  'import data from "../data/teori.json";',
  "",
  'const teori = data as ModuleContent["teori"];',
  "",
  "export default teori;",
  "",
].join("\n");

const komponenViewTs = [
  'import type { ModuleContent } from "../../../types/ModuleContent";',
  'import data from "../data/komponen.json";',
  "",
  'export const items = data.items as ModuleContent["komponen"]["items"];',
  "",
].join("\n");

const sistemViewTs = [
  'import type { ModuleContent } from "../../../types/ModuleContent";',
  'import data from "../data/sistem.json";',
  "",
  'const simulations = data.simulations as ModuleContent["system"]["simulations"];',
  "",
  "export default simulations;",
  "",
].join("\n");

const evaluasiViewTs = [
  'import type { ModuleContent } from "../../../types/ModuleContent";',
  'import data from "../data/evaluasi.json";',
  "",
  'const evaluasi = data as ModuleContent["evaluasi"];',
  "",
  "export default evaluasi;",
  "",
].join("\n");

const perawatanViewTs = [
  'import data from "../data/perawatan.json";',
  "",
  "const perawatan = data;",
  "",
  "export default perawatan;",
  "",
].join("\n");

for (let i = 2; i <= 50; i++) {
  const id = `XRDCTSM-${String(i).padStart(3, "0")}`;
  const moduleDir = path.join(modulesDir, id);
  if (!fs.existsSync(moduleDir)) {
    continue;
  }

  const dataDir = path.join(moduleDir, "data");
  const viewDir = path.join(moduleDir, "view");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(viewDir)) fs.mkdirSync(viewDir, { recursive: true });

  const files = [
    { path: path.join(dataDir, "capaian.json"), content: capaianTemplate },
    { path: path.join(dataDir, "teori.json"), content: teoriTemplate },
    { path: path.join(dataDir, "komponen.json"), content: komponenTemplate },
    { path: path.join(dataDir, "sistem.json"), content: sistemTemplate },
    { path: path.join(dataDir, "evaluasi.json"), content: evaluasiTemplate },
    { path: path.join(dataDir, "perawatan.json"), content: perawatanTemplate },
    { path: path.join(viewDir, "capaian.ts"), content: capaianViewTs },
    { path: path.join(viewDir, "teori.ts"), content: teoriViewTs },
    { path: path.join(viewDir, "komponen.ts"), content: komponenViewTs },
    { path: path.join(viewDir, "sistem.ts"), content: sistemViewTs },
    { path: path.join(viewDir, "evaluasi.ts"), content: evaluasiViewTs },
    { path: path.join(viewDir, "perawatan.ts"), content: perawatanViewTs },
  ];

  for (const file of files) {
    if (!fs.existsSync(file.path)) {
      fs.writeFileSync(file.path, file.content, "utf8");
    }
  }
}

