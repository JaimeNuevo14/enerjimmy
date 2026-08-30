import { prisma } from "../lib/prisma";

// Grupos musculares: pecho, espalda, hombros, biceps, triceps, cuadriceps,
// isquiotibiales, gluteos, gemelos, abdomen, cardio, cuerpo_completo
// Equipamiento: barra, mancuerna, maquina, peso_corporal, polea, kettlebell, banda
// Categoria: compuesto, aislamiento

type Ex = {
  name: string;
  muscleGroup: string;
  equipment: string;
  category: string;
};

const exercises: Ex[] = [
  // ---------------- PECHO ----------------
  { name: "Press de banca con barra", muscleGroup: "pecho", equipment: "barra", category: "compuesto" },
  { name: "Press de banca inclinado con barra", muscleGroup: "pecho", equipment: "barra", category: "compuesto" },
  { name: "Press de banca declinado con barra", muscleGroup: "pecho", equipment: "barra", category: "compuesto" },
  { name: "Press de banca con mancuernas", muscleGroup: "pecho", equipment: "mancuerna", category: "compuesto" },
  { name: "Press inclinado con mancuernas", muscleGroup: "pecho", equipment: "mancuerna", category: "compuesto" },
  { name: "Press declinado con mancuernas", muscleGroup: "pecho", equipment: "mancuerna", category: "compuesto" },
  { name: "Aperturas con mancuernas", muscleGroup: "pecho", equipment: "mancuerna", category: "aislamiento" },
  { name: "Aperturas inclinadas con mancuernas", muscleGroup: "pecho", equipment: "mancuerna", category: "aislamiento" },
  { name: "Press de pecho en maquina", muscleGroup: "pecho", equipment: "maquina", category: "compuesto" },
  { name: "Press de pecho inclinado en maquina", muscleGroup: "pecho", equipment: "maquina", category: "compuesto" },
  { name: "Contractor de pecho (pec deck)", muscleGroup: "pecho", equipment: "maquina", category: "aislamiento" },
  { name: "Cruce de poleas (crossover)", muscleGroup: "pecho", equipment: "polea", category: "aislamiento" },
  { name: "Cruce de poleas bajo a alto", muscleGroup: "pecho", equipment: "polea", category: "aislamiento" },
  { name: "Press en polea desde el suelo", muscleGroup: "pecho", equipment: "polea", category: "compuesto" },
  { name: "Fondos en paralelas (pecho)", muscleGroup: "pecho", equipment: "peso_corporal", category: "compuesto" },
  { name: "Flexiones de brazos", muscleGroup: "pecho", equipment: "peso_corporal", category: "compuesto" },
  { name: "Flexiones inclinadas (pies elevados)", muscleGroup: "pecho", equipment: "peso_corporal", category: "compuesto" },
  { name: "Flexiones declinadas (manos elevadas)", muscleGroup: "pecho", equipment: "peso_corporal", category: "compuesto" },
  { name: "Flexiones con banda de resistencia", muscleGroup: "pecho", equipment: "banda", category: "compuesto" },
  { name: "Press de pecho con banda", muscleGroup: "pecho", equipment: "banda", category: "compuesto" },
  { name: "Pullover con mancuerna", muscleGroup: "pecho", equipment: "mancuerna", category: "aislamiento" },

  // ---------------- ESPALDA ----------------
  { name: "Dominadas", muscleGroup: "espalda", equipment: "peso_corporal", category: "compuesto" },
  { name: "Dominadas supinas (chin-up)", muscleGroup: "espalda", equipment: "peso_corporal", category: "compuesto" },
  { name: "Jalon al pecho en polea", muscleGroup: "espalda", equipment: "polea", category: "compuesto" },
  { name: "Jalon tras nuca en polea", muscleGroup: "espalda", equipment: "polea", category: "compuesto" },
  { name: "Jalon con agarre cerrado en polea", muscleGroup: "espalda", equipment: "polea", category: "compuesto" },
  { name: "Remo con barra", muscleGroup: "espalda", equipment: "barra", category: "compuesto" },
  { name: "Remo Pendlay", muscleGroup: "espalda", equipment: "barra", category: "compuesto" },
  { name: "Remo con mancuerna a un brazo", muscleGroup: "espalda", equipment: "mancuerna", category: "compuesto" },
  { name: "Remo con dos mancuernas", muscleGroup: "espalda", equipment: "mancuerna", category: "compuesto" },
  { name: "Remo en maquina sentado", muscleGroup: "espalda", equipment: "maquina", category: "compuesto" },
  { name: "Remo en polea baja sentado", muscleGroup: "espalda", equipment: "polea", category: "compuesto" },
  { name: "Remo en T con barra", muscleGroup: "espalda", equipment: "barra", category: "compuesto" },
  { name: "Peso muerto convencional", muscleGroup: "espalda", equipment: "barra", category: "compuesto" },
  { name: "Peso muerto sumo", muscleGroup: "espalda", equipment: "barra", category: "compuesto" },
  { name: "Peso muerto rumano con barra", muscleGroup: "espalda", equipment: "barra", category: "compuesto" },
  { name: "Peso muerto rumano con mancuernas", muscleGroup: "espalda", equipment: "mancuerna", category: "compuesto" },
  { name: "Hiperextensiones lumbares", muscleGroup: "espalda", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Pull-over en polea alta", muscleGroup: "espalda", equipment: "polea", category: "aislamiento" },
  { name: "Face pull en polea", muscleGroup: "espalda", equipment: "polea", category: "aislamiento" },
  { name: "Remo invertido (australian pull-up)", muscleGroup: "espalda", equipment: "peso_corporal", category: "compuesto" },
  { name: "Remo con banda de resistencia", muscleGroup: "espalda", equipment: "banda", category: "compuesto" },
  { name: "Peso muerto con kettlebell", muscleGroup: "espalda", equipment: "kettlebell", category: "compuesto" },
  { name: "Encogimientos de trapecio con barra", muscleGroup: "espalda", equipment: "barra", category: "aislamiento" },
  { name: "Encogimientos de trapecio con mancuernas", muscleGroup: "espalda", equipment: "mancuerna", category: "aislamiento" },

  // ---------------- HOMBROS ----------------
  { name: "Press militar con barra", muscleGroup: "hombros", equipment: "barra", category: "compuesto" },
  { name: "Press militar con mancuernas", muscleGroup: "hombros", equipment: "mancuerna", category: "compuesto" },
  { name: "Press Arnold", muscleGroup: "hombros", equipment: "mancuerna", category: "compuesto" },
  { name: "Press de hombros en maquina", muscleGroup: "hombros", equipment: "maquina", category: "compuesto" },
  { name: "Elevaciones laterales con mancuernas", muscleGroup: "hombros", equipment: "mancuerna", category: "aislamiento" },
  { name: "Elevaciones laterales en polea", muscleGroup: "hombros", equipment: "polea", category: "aislamiento" },
  { name: "Elevaciones frontales con mancuernas", muscleGroup: "hombros", equipment: "mancuerna", category: "aislamiento" },
  { name: "Elevaciones frontales con barra", muscleGroup: "hombros", equipment: "barra", category: "aislamiento" },
  { name: "Pajaros (elevaciones posteriores) con mancuernas", muscleGroup: "hombros", equipment: "mancuerna", category: "aislamiento" },
  { name: "Elevaciones posteriores en maquina (peck deck inverso)", muscleGroup: "hombros", equipment: "maquina", category: "aislamiento" },
  { name: "Remo al menton con barra", muscleGroup: "hombros", equipment: "barra", category: "compuesto" },
  { name: "Press de hombros con banda", muscleGroup: "hombros", equipment: "banda", category: "compuesto" },
  { name: "Elevaciones laterales con banda", muscleGroup: "hombros", equipment: "banda", category: "aislamiento" },
  { name: "Press de kettlebell a un brazo", muscleGroup: "hombros", equipment: "kettlebell", category: "compuesto" },
  { name: "Face pull con banda", muscleGroup: "hombros", equipment: "banda", category: "aislamiento" },
  { name: "Flexiones pike (pino)", muscleGroup: "hombros", equipment: "peso_corporal", category: "compuesto" },

  // ---------------- BICEPS ----------------
  { name: "Curl de biceps con barra", muscleGroup: "biceps", equipment: "barra", category: "aislamiento" },
  { name: "Curl de biceps con barra Z", muscleGroup: "biceps", equipment: "barra", category: "aislamiento" },
  { name: "Curl de biceps con mancuernas", muscleGroup: "biceps", equipment: "mancuerna", category: "aislamiento" },
  { name: "Curl martillo con mancuernas", muscleGroup: "biceps", equipment: "mancuerna", category: "aislamiento" },
  { name: "Curl concentrado con mancuerna", muscleGroup: "biceps", equipment: "mancuerna", category: "aislamiento" },
  { name: "Curl en banco Scott con barra Z", muscleGroup: "biceps", equipment: "barra", category: "aislamiento" },
  { name: "Curl en banco Scott con mancuerna", muscleGroup: "biceps", equipment: "mancuerna", category: "aislamiento" },
  { name: "Curl de biceps en polea baja", muscleGroup: "biceps", equipment: "polea", category: "aislamiento" },
  { name: "Curl de biceps en maquina", muscleGroup: "biceps", equipment: "maquina", category: "aislamiento" },
  { name: "Curl de biceps con banda", muscleGroup: "biceps", equipment: "banda", category: "aislamiento" },
  { name: "Curl inverso con barra", muscleGroup: "biceps", equipment: "barra", category: "aislamiento" },
  { name: "Curl de biceps con kettlebell", muscleGroup: "biceps", equipment: "kettlebell", category: "aislamiento" },

  // ---------------- TRICEPS ----------------
  { name: "Press frances con barra Z", muscleGroup: "triceps", equipment: "barra", category: "aislamiento" },
  { name: "Press frances con mancuerna", muscleGroup: "triceps", equipment: "mancuerna", category: "aislamiento" },
  { name: "Extension de triceps en polea (cuerda)", muscleGroup: "triceps", equipment: "polea", category: "aislamiento" },
  { name: "Extension de triceps en polea (barra)", muscleGroup: "triceps", equipment: "polea", category: "aislamiento" },
  { name: "Patada de triceps con mancuerna", muscleGroup: "triceps", equipment: "mancuerna", category: "aislamiento" },
  { name: "Extension de triceps sobre la cabeza con mancuerna", muscleGroup: "triceps", equipment: "mancuerna", category: "aislamiento" },
  { name: "Extension de triceps en polea alta a un brazo", muscleGroup: "triceps", equipment: "polea", category: "aislamiento" },
  { name: "Fondos en banco (triceps)", muscleGroup: "triceps", equipment: "peso_corporal", category: "compuesto" },
  { name: "Fondos en paralelas (triceps)", muscleGroup: "triceps", equipment: "peso_corporal", category: "compuesto" },
  { name: "Press cerrado con barra", muscleGroup: "triceps", equipment: "barra", category: "compuesto" },
  { name: "Press de triceps en maquina", muscleGroup: "triceps", equipment: "maquina", category: "aislamiento" },
  { name: "Extension de triceps con banda", muscleGroup: "triceps", equipment: "banda", category: "aislamiento" },

  // ---------------- CUADRICEPS ----------------
  { name: "Sentadilla trasera con barra", muscleGroup: "cuadriceps", equipment: "barra", category: "compuesto" },
  { name: "Sentadilla frontal con barra", muscleGroup: "cuadriceps", equipment: "barra", category: "compuesto" },
  { name: "Sentadilla goblet con mancuerna", muscleGroup: "cuadriceps", equipment: "mancuerna", category: "compuesto" },
  { name: "Sentadilla bulgara con mancuernas", muscleGroup: "cuadriceps", equipment: "mancuerna", category: "compuesto" },
  { name: "Prensa de piernas", muscleGroup: "cuadriceps", equipment: "maquina", category: "compuesto" },
  { name: "Extension de cuadriceps en maquina", muscleGroup: "cuadriceps", equipment: "maquina", category: "aislamiento" },
  { name: "Zancadas caminando con mancuernas", muscleGroup: "cuadriceps", equipment: "mancuerna", category: "compuesto" },
  { name: "Zancadas caminando con barra", muscleGroup: "cuadriceps", equipment: "barra", category: "compuesto" },
  { name: "Zancadas estaticas con mancuernas", muscleGroup: "cuadriceps", equipment: "mancuerna", category: "compuesto" },
  { name: "Sentadilla hack en maquina", muscleGroup: "cuadriceps", equipment: "maquina", category: "compuesto" },
  { name: "Sentadilla sissy", muscleGroup: "cuadriceps", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Sentadilla con salto", muscleGroup: "cuadriceps", equipment: "peso_corporal", category: "compuesto" },
  { name: "Sentadilla con kettlebell (goblet)", muscleGroup: "cuadriceps", equipment: "kettlebell", category: "compuesto" },
  { name: "Zancadas con banda", muscleGroup: "cuadriceps", equipment: "banda", category: "compuesto" },
  { name: "Step-up con mancuernas", muscleGroup: "cuadriceps", equipment: "mancuerna", category: "compuesto" },
  { name: "Sentadilla en multipower (Smith)", muscleGroup: "cuadriceps", equipment: "maquina", category: "compuesto" },

  // ---------------- ISQUIOTIBIALES ----------------
  { name: "Peso muerto rumano con barra (isquios)", muscleGroup: "isquiotibiales", equipment: "barra", category: "compuesto" },
  { name: "Peso muerto piernas rigidas con mancuernas", muscleGroup: "isquiotibiales", equipment: "mancuerna", category: "compuesto" },
  { name: "Curl femoral tumbado en maquina", muscleGroup: "isquiotibiales", equipment: "maquina", category: "aislamiento" },
  { name: "Curl femoral sentado en maquina", muscleGroup: "isquiotibiales", equipment: "maquina", category: "aislamiento" },
  { name: "Curl femoral de pie en maquina", muscleGroup: "isquiotibiales", equipment: "maquina", category: "aislamiento" },
  { name: "Buenos dias con barra", muscleGroup: "isquiotibiales", equipment: "barra", category: "compuesto" },
  { name: "Peso muerto a una pierna con mancuerna", muscleGroup: "isquiotibiales", equipment: "mancuerna", category: "compuesto" },
  { name: "Puente de gluteo-isquios con balon (nordic curl asistido)", muscleGroup: "isquiotibiales", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Curl nordico", muscleGroup: "isquiotibiales", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Curl femoral con banda", muscleGroup: "isquiotibiales", equipment: "banda", category: "aislamiento" },
  { name: "Peso muerto rumano con kettlebell", muscleGroup: "isquiotibiales", equipment: "kettlebell", category: "compuesto" },

  // ---------------- GLUTEOS ----------------
  { name: "Hip thrust con barra", muscleGroup: "gluteos", equipment: "barra", category: "compuesto" },
  { name: "Puente de gluteos en el suelo", muscleGroup: "gluteos", equipment: "peso_corporal", category: "compuesto" },
  { name: "Puente de gluteos con mancuerna", muscleGroup: "gluteos", equipment: "mancuerna", category: "compuesto" },
  { name: "Patada de gluteo en polea", muscleGroup: "gluteos", equipment: "polea", category: "aislamiento" },
  { name: "Patada de gluteo en maquina", muscleGroup: "gluteos", equipment: "maquina", category: "aislamiento" },
  { name: "Abduccion de cadera en maquina", muscleGroup: "gluteos", equipment: "maquina", category: "aislamiento" },
  { name: "Abduccion de cadera con banda", muscleGroup: "gluteos", equipment: "banda", category: "aislamiento" },
  { name: "Sentadilla sumo con mancuerna", muscleGroup: "gluteos", equipment: "mancuerna", category: "compuesto" },
  { name: "Sentadilla sumo con barra", muscleGroup: "gluteos", equipment: "barra", category: "compuesto" },
  { name: "Peso muerto sumo con kettlebell", muscleGroup: "gluteos", equipment: "kettlebell", category: "compuesto" },
  { name: "Zancada inversa con mancuernas", muscleGroup: "gluteos", equipment: "mancuerna", category: "compuesto" },
  { name: "Patada de burro (donkey kick)", muscleGroup: "gluteos", equipment: "peso_corporal", category: "aislamiento" },

  // ---------------- GEMELOS ----------------
  { name: "Elevacion de talones de pie en maquina", muscleGroup: "gemelos", equipment: "maquina", category: "aislamiento" },
  { name: "Elevacion de talones sentado en maquina", muscleGroup: "gemelos", equipment: "maquina", category: "aislamiento" },
  { name: "Elevacion de talones con mancuernas", muscleGroup: "gemelos", equipment: "mancuerna", category: "aislamiento" },
  { name: "Elevacion de talones con barra", muscleGroup: "gemelos", equipment: "barra", category: "aislamiento" },
  { name: "Elevacion de talones a una pierna (peso corporal)", muscleGroup: "gemelos", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Elevacion de talones en prensa de piernas", muscleGroup: "gemelos", equipment: "maquina", category: "aislamiento" },
  { name: "Saltos de cuerda (gemelos)", muscleGroup: "gemelos", equipment: "peso_corporal", category: "aislamiento" },

  // ---------------- ABDOMEN ----------------
  { name: "Plancha abdominal", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Plancha lateral", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Encogimientos abdominales (crunch)", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Crunch en polea alta (de rodillas)", muscleGroup: "abdomen", equipment: "polea", category: "aislamiento" },
  { name: "Elevacion de piernas colgado", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Elevacion de rodillas colgado", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Rueda abdominal (ab wheel)", muscleGroup: "abdomen", equipment: "peso_corporal", category: "compuesto" },
  { name: "Giros rusos con mancuerna", muscleGroup: "abdomen", equipment: "mancuerna", category: "aislamiento" },
  { name: "Giros rusos con kettlebell", muscleGroup: "abdomen", equipment: "kettlebell", category: "aislamiento" },
  { name: "Encogimientos abdominales en maquina", muscleGroup: "abdomen", equipment: "maquina", category: "aislamiento" },
  { name: "Elevacion de piernas tumbado", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Abdominales bicicleta", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Plancha con toque de hombro", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Pallof press en polea", muscleGroup: "abdomen", equipment: "polea", category: "aislamiento" },
  { name: "Pallof press con banda", muscleGroup: "abdomen", equipment: "banda", category: "aislamiento" },
  { name: "Crunch abdominal con banda", muscleGroup: "abdomen", equipment: "banda", category: "aislamiento" },
  { name: "Dead bug", muscleGroup: "abdomen", equipment: "peso_corporal", category: "aislamiento" },

  // ---------------- CARDIO ----------------
  { name: "Carrera en cinta", muscleGroup: "cardio", equipment: "maquina", category: "aislamiento" },
  { name: "Bicicleta estatica", muscleGroup: "cardio", equipment: "maquina", category: "aislamiento" },
  { name: "Eliptica", muscleGroup: "cardio", equipment: "maquina", category: "aislamiento" },
  { name: "Remo en maquina (cardio)", muscleGroup: "cardio", equipment: "maquina", category: "aislamiento" },
  { name: "Escaladora (stair climber)", muscleGroup: "cardio", equipment: "maquina", category: "aislamiento" },
  { name: "Saltos de cuerda", muscleGroup: "cardio", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Burpees", muscleGroup: "cardio", equipment: "peso_corporal", category: "compuesto" },
  { name: "Mountain climbers", muscleGroup: "cardio", equipment: "peso_corporal", category: "compuesto" },
  { name: "Jumping jacks", muscleGroup: "cardio", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Sprints en cinta", muscleGroup: "cardio", equipment: "maquina", category: "aislamiento" },
  { name: "Boxeo con saco (cardio)", muscleGroup: "cardio", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Battle ropes (cuerdas de batalla)", muscleGroup: "cardio", equipment: "peso_corporal", category: "aislamiento" },
  { name: "Swing con kettlebell", muscleGroup: "cardio", equipment: "kettlebell", category: "compuesto" },
  { name: "Assault bike", muscleGroup: "cardio", equipment: "maquina", category: "aislamiento" },

  // ---------------- CUERPO COMPLETO ----------------
  { name: "Clean and press con barra", muscleGroup: "cuerpo_completo", equipment: "barra", category: "compuesto" },
  { name: "Arrancada (snatch) con barra", muscleGroup: "cuerpo_completo", equipment: "barra", category: "compuesto" },
  { name: "Cargada de potencia (power clean)", muscleGroup: "cuerpo_completo", equipment: "barra", category: "compuesto" },
  { name: "Thruster con barra", muscleGroup: "cuerpo_completo", equipment: "barra", category: "compuesto" },
  { name: "Thruster con mancuernas", muscleGroup: "cuerpo_completo", equipment: "mancuerna", category: "compuesto" },
  { name: "Turkish get-up con kettlebell", muscleGroup: "cuerpo_completo", equipment: "kettlebell", category: "compuesto" },
  { name: "Swing a dos manos con kettlebell", muscleGroup: "cuerpo_completo", equipment: "kettlebell", category: "compuesto" },
  { name: "Man maker con mancuernas", muscleGroup: "cuerpo_completo", equipment: "mancuerna", category: "compuesto" },
  { name: "Burpee con press de mancuernas", muscleGroup: "cuerpo_completo", equipment: "mancuerna", category: "compuesto" },
  { name: "Wall ball (lanzamiento a pared)", muscleGroup: "cuerpo_completo", equipment: "peso_corporal", category: "compuesto" },
  { name: "Arrastre de trineo (sled push/pull)", muscleGroup: "cuerpo_completo", equipment: "peso_corporal", category: "compuesto" },
  { name: "Farmer's walk con mancuernas", muscleGroup: "cuerpo_completo", equipment: "mancuerna", category: "compuesto" },
  { name: "Farmer's walk con kettlebells", muscleGroup: "cuerpo_completo", equipment: "kettlebell", category: "compuesto" },
  { name: "Devil press con mancuernas", muscleGroup: "cuerpo_completo", equipment: "mancuerna", category: "compuesto" },
  { name: "Circuito de bandas cuerpo completo", muscleGroup: "cuerpo_completo", equipment: "banda", category: "compuesto" },
];

async function main() {
  // Deduplicate by name just in case
  const seen = new Set<string>();
  const unique = exercises.filter((e) => {
    if (seen.has(e.name)) return false;
    seen.add(e.name);
    return true;
  });

  console.log(`Sembrando ${unique.length} ejercicios...`);

  for (const ex of unique) {
    await prisma.exercise.upsert({
      where: { name: ex.name },
      update: {},
      create: {
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        equipment: ex.equipment,
        category: ex.category,
        isCustom: false,
      },
    });
  }

  const count = await prisma.exercise.count();
  console.log(`Total de ejercicios en la base de datos: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
