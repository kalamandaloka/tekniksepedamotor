export interface ModuleData {
  id: string;
  title: string;
  description: string;
  category: string;
}

const titles: Record<string, string> = {
  "XRDCTSM-001": "K3 Bengkel Sepeda Motor",
  "XRDCTSM-002": "Alat Ukur & SST",
  "XRDCTSM-003": "Prinsip Kerja Mesin 4 Tak",
  "XRDCTSM-004": "Struktur Mesin & Komponen Utama",
  "XRDCTSM-005": "Mekanisme Katup & Timing",
  "XRDCTSM-006": "Sistem Intake–Exhaust & Emisi",
  "XRDCTSM-007": "Sistem Pelumasan Mesin",
  "XRDCTSM-008": "Sistem Pendinginan Mesin",
  "XRDCTSM-009": "Pembakaran & AFR",
  "XRDCTSM-010": "Sistem Bahan Bakar Karburator",
  "XRDCTSM-011": "Sistem Bahan Bakar Injeksi (EFI)",
  "XRDCTSM-012": "Sistem Pengapian",
  "XRDCTSM-013": "Sistem Kelistrikan (Aki–Sekring–Relay–Ground)",
  "XRDCTSM-014": "Wiring Diagram & Rangkaian",
  "XRDCTSM-015": "Sistem Starter",
  "XRDCTSM-016": "Sistem Pengisian (Charging)",
  "XRDCTSM-017": "Sistem Penerangan & Sinyal",
  "XRDCTSM-018": "Diagnostik Engine & Kelistrikan + QC",
};

export const modules: ModuleData[] = Array.from({ length: 50 }, (_, i) => {
  const idNumber = i + 1;
  const id = `XRDCTSM-${String(idNumber).padStart(3, "0")}`;
  const title = titles[id] ?? `Modul ${id}`;

  let category: string;
  if (idNumber >= 1 && idNumber <= 18) {
    category = "Teknik Sepeda Motor Jilid 1 : Mesin Dasar dan Kelistrikan";
  } else if (idNumber >= 19 && idNumber <= 35) {
    category = "Teknik Sepeda Motor Jilid 2 : Sistem Penggerak dan Sasis";
  } else {
    category = "Teknik Sepeda Motor Jilid 3 : Sepeda Motor Listrik";
  }

  return {
    id,
    title,
    category,
    description: `Modul ${title} dalam paket ${category}.`,
  };
});
