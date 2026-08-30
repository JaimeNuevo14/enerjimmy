export const DIAS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
] as const;

export type Dia = (typeof DIAS)[number];

export const DIA_LABEL: Record<Dia, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

// JS getDay(): 0 = domingo, 1 = lunes, ... 6 = sabado
export function hoyDia(): Dia {
  const jsDay = new Date().getDay();
  const map: Dia[] = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  return map[jsDay];
}

export const MUSCLE_GROUPS = [
  "pecho",
  "espalda",
  "hombros",
  "biceps",
  "triceps",
  "cuadriceps",
  "isquiotibiales",
  "gluteos",
  "gemelos",
  "abdomen",
  "cardio",
  "cuerpo_completo",
] as const;

export const EQUIPMENT = [
  "barra",
  "mancuerna",
  "maquina",
  "peso_corporal",
  "polea",
  "kettlebell",
  "banda",
] as const;

export const MUSCLE_LABEL: Record<string, string> = {
  pecho: "Pecho",
  espalda: "Espalda",
  hombros: "Hombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  cuadriceps: "Cuádriceps",
  isquiotibiales: "Isquiotibiales",
  gluteos: "Glúteos",
  gemelos: "Gemelos",
  abdomen: "Abdomen",
  cardio: "Cardio",
  cuerpo_completo: "Cuerpo completo",
};

export const EQUIPMENT_LABEL: Record<string, string> = {
  barra: "Barra",
  mancuerna: "Mancuerna",
  maquina: "Máquina",
  peso_corporal: "Peso corporal",
  polea: "Polea",
  kettlebell: "Kettlebell",
  banda: "Banda",
};
