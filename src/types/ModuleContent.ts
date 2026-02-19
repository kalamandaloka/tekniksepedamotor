export interface ModuleContent {
  id: string;
  title: string;
  capaian: {
    title: string;
    description: string;
    image?: string;
    skkni: (string | { kode: string; nama: string; catatan?: string })[];
    kurikulum: (string | { kode: string; nama: string; catatan?: string })[];
    tujuan: string[];
    modelUrl?: string;
  };
  teori: {
    title: string;
    content?: string;
    pages?: {
      title?: string;
      content: string;
      image?: string;
      contentL1?: string;
      contentL2?: string;
      contentL3?: string;
      subSections?: {
        title2: string;
        content2?: string;
        items?: {
          title3: string;
          content3?: string;
        }[];
      }[];
    }[];
    references?: string[];
  };
  komponen: {
    title: string;
    items: {
      id: string;
      name: string;
      description: string;
      function?: string;
      image?: string;
      modelType: "box" | "cylinder" | "torus" | "plane";
      modelPath?: string;
    }[];
  };
  system: {
    title: string;
    simulations: {
      id: string;
      title: string;
      description: string;
      image?: string;
      panelTitle?: string;
      status?: string;
      conditions?: {
        id: number;
        description: string;
        status?: string;
        image?: string;
      }[];
    }[];
  };
  evaluasi: {
    title: string;
    teori: {
      questions: {
        id: number;
        question: string;
        options: string[];
        correctAnswer: number;
      }[];
    };
    praktek: {
      modelUrl?: string;
      tasks: {
        id: number;
        question: string;
        targetMeshName: string; // Name of the mesh to click
      }[];
    };
  };
}
