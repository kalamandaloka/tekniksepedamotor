import { type ModuleContent } from "../../types/ModuleContent";
import capaian from "./view/capaian";
import teori from "./view/teori";
import komponenData from "./data/komponen.json";
import sistemData from "./data/sistem.json";
import evaluasi from "./view/evaluasi";

const content: ModuleContent = {
  id: "XRDCTSM-001",
  title: "K3 Bengkel Sepeda Motor",
  capaian,
  teori,
  komponen: {
    title: komponenData.title,
    items: komponenData.items as ModuleContent["komponen"]["items"],
  },
  system: {
    title: sistemData.title,
    simulations: sistemData.simulations as ModuleContent["system"]["simulations"],
  },
  evaluasi,
};

export default content;
