import { type ModuleContent } from "../types/ModuleContent";

export const createDummyContent = (id: string, title: string): ModuleContent => {
  return {
    id,
    title,
    capaian: {
      title: "Capaian Pembelajaran",
      description: `Deskripsi umum mengenai capaian pembelajaran untuk modul ${title}. Peserta diharapkan dapat menguasai kompetensi dasar dan menerapkannya dalam praktik lapangan.`,
      skkni: [
        `Mengikuti standar kompetensi terkait ${title}.`,
        `Menerapkan K3 dalam kegiatan ${title}.`,
      ],
      kurikulum: [
        `Memahami konsep ${title} dalam kurikulum vokasi.`,
      ],
      tujuan: [
        `Mampu mengidentifikasi kebutuhan ${title}.`,
        `Mampu melaksanakan prosedur ${title}.`,
      ],
    },
    teori: {
      title: `Teori Dasar ${title}`,
      content:
        `# ${title}\n\nPengantar tentang konsep dan praktik ${title} dalam budidaya tanaman.\n\n## Prinsip\nEfisiensi, Keberlanjutan, dan Presisi.\n\n## Faktor\nLingkungan, jenis tanaman, teknologi.`,
      references: ["Modul Pelatihan Pertanian", "Jurnal Agronomi"],
    },
    komponen: {
      title: "Komponen Utama",
      items: [
        {
          id: "alat-standar",
          name: "Peralatan Standar",
          description: "Alat pendukung kegiatan utama.",
          modelType: "box",
        },
        {
          id: "bahan-baku",
          name: "Bahan Baku",
          description: "Material utama pada proses.",
          modelType: "cylinder",
        },
        {
          id: "apd",
          name: "APD",
          description: "Alat Pelindung Diri.",
          modelType: "torus",
        },
      ],
    },
    system: {
      title: "Simulasi",
      simulations: [
        {
          id: "sim-1",
          title: "Simulasi Tahap 1",
          description: "Persiapan alat dan area kerja.",
        },
        {
          id: "sim-2",
          title: "Simulasi Tahap 2",
          description: "Pelaksanaan inti dengan K3.",
        },
      ],
    },
    evaluasi: {
      title: "Evaluasi",
      teori: {
        questions: [
          {
            id: 1,
            question: `Tujuan utama ${title} adalah:`,
            options: ["Meningkatkan biaya", "Mengoptimalkan produksi", "Mengurangi hasil", "Merusak lingkungan"],
            correctAnswer: 1,
          },
          {
            id: 2,
            question: "Yang bukan prinsip utama:",
            options: ["Efisiensi", "Keberlanjutan", "Presisi", "Pemborosan"],
            correctAnswer: 3,
          },
        ],
      },
      praktek: {
        tasks: [
          {
            id: 1,
            question: "Klik bagian pada traktor: Body",
            targetMeshName: "Body",
          },
          {
            id: 2,
            question: "Klik bagian pada traktor: Wheel_Front_Left",
            targetMeshName: "Wheel_Front_Left",
          },
        ],
      },
    },
  };
};
