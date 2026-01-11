import { db } from "./index";
import { modules, lessons, exercises } from "./schema";

// ============================================
// SEED DATA - Initial content for the app
// ============================================

const SEED_MODULES = [
  {
    id: 1,
    title: "Fundamentos I",
    description: "Aprende las bases del español",
    position: "center",
    order: 1,
  },
  {
    id: 2,
    title: "Saludos",
    description: "Cómo saludar y presentarte",
    position: "right",
    order: 2,
  },
  {
    id: 3,
    title: "Viajes",
    description: "Vocabulario para viajar",
    position: "center",
    order: 3,
  },
  {
    id: 4,
    title: "Restaurantes",
    description: "Pedir comida y bebida",
    position: "left",
    order: 4,
  },
  {
    id: 5,
    title: "Familia",
    description: "Hablar sobre tu familia",
    position: "center",
    order: 5,
  },
] as const;

const SEED_LESSONS = [
  // Fundamentos I
  { id: 1, moduleId: 1, title: "Básicos", order: 1, xpReward: 10 },
  { id: 2, moduleId: 1, title: "Frases comunes", order: 2, xpReward: 10 },
  { id: 3, moduleId: 1, title: "Pronombres", order: 3, xpReward: 15 },
  // Saludos
  { id: 4, moduleId: 2, title: "Hola y adiós", order: 1, xpReward: 10 },
  { id: 5, moduleId: 2, title: "Presentaciones", order: 2, xpReward: 15 },
  // Viajes
  { id: 6, moduleId: 3, title: "En el aeropuerto", order: 1, xpReward: 15 },
  { id: 7, moduleId: 3, title: "En el hotel", order: 2, xpReward: 15 },
] as const;

const SEED_EXERCISES = [
  // Lesson 1: Básicos
  {
    lessonId: 1,
    type: "multiple_choice",
    question: "How do you say 'Hello' in Spanish?",
    options: ["Hola", "Adiós", "Gracias", "Por favor"],
    correctAnswer: "Hola",
    explanation: "'Hola' is the most common greeting in Spanish.",
    order: 1,
  },
  {
    lessonId: 1,
    type: "multiple_choice",
    question: "Which of these means 'Thank you'?",
    options: ["Hola", "Gracias", "De nada", "Perdón"],
    correctAnswer: "Gracias",
    explanation: "'Gracias' is used to express gratitude.",
    order: 2,
  },
  {
    lessonId: 1,
    type: "multiple_choice",
    question: "What does 'Por favor' mean?",
    options: ["Thank you", "Please", "Sorry", "Hello"],
    correctAnswer: "Please",
    explanation: "'Por favor' is used to make polite requests.",
    order: 3,
  },
  {
    lessonId: 1,
    type: "multiple_choice",
    question: "How do you say 'Goodbye'?",
    options: ["Hola", "Buenos días", "Adiós", "Gracias"],
    correctAnswer: "Adiós",
    explanation: "'Adiós' is the standard way to say goodbye.",
    order: 4,
  },
  // Lesson 2: Frases comunes
  {
    lessonId: 2,
    type: "multiple_choice",
    question: "What does 'Buenos días' mean?",
    options: ["Good night", "Good afternoon", "Good morning", "Goodbye"],
    correctAnswer: "Good morning",
    explanation: "'Buenos días' is used in the morning until around noon.",
    order: 1,
  },
  {
    lessonId: 2,
    type: "multiple_choice",
    question: "How do you say 'Good night'?",
    options: ["Buenas noches", "Buenos días", "Buenas tardes", "Buen viaje"],
    correctAnswer: "Buenas noches",
    explanation: "'Buenas noches' is used in the evening and when going to bed.",
    order: 2,
  },
  {
    lessonId: 2,
    type: "multiple_choice",
    question: "What does '¿Cómo estás?' mean?",
    options: ["What's your name?", "How are you?", "Where are you?", "Who are you?"],
    correctAnswer: "How are you?",
    explanation: "'¿Cómo estás?' is an informal way to ask how someone is doing.",
    order: 3,
  },
  // Lesson 4: Hola y adiós
  {
    lessonId: 4,
    type: "multiple_choice",
    question: "Which greeting is most formal?",
    options: ["¿Qué tal?", "Hola", "Buenos días", "¿Qué onda?"],
    correctAnswer: "Buenos días",
    explanation: "'Buenos días' is more formal than 'Hola' or '¿Qué tal?'.",
    order: 1,
  },
  {
    lessonId: 4,
    type: "multiple_choice",
    question: "What does 'Hasta luego' mean?",
    options: ["See you later", "Goodbye forever", "Good morning", "Nice to meet you"],
    correctAnswer: "See you later",
    explanation: "'Hasta luego' literally means 'until later'.",
    order: 2,
  },
] as const;

export async function seed() {
  console.log("🌱 Seeding database...");

  // Insert modules
  await db.insert(modules).values(SEED_MODULES).onConflictDoNothing();
  console.log("✅ Modules seeded");

  // Insert lessons
  await db.insert(lessons).values(SEED_LESSONS).onConflictDoNothing();
  console.log("✅ Lessons seeded");

  // Insert exercises
  await db.insert(exercises).values(SEED_EXERCISES).onConflictDoNothing();
  console.log("✅ Exercises seeded");

  console.log("🎉 Database seeded successfully!");
}

// Run if called directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Seed failed:", error);
      process.exit(1);
    });
}
