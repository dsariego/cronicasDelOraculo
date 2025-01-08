export interface Adventurer {
  id: string; // Identificador único del aventurero
  name: string; // Nombre del aventurero
  avatar?: string; // Imagen
  nickname: string; // Alias
  gender: 'male' | 'female';
  description: string; // Descripción del aventurero
  virtue: number; // Valor de Virtud (0 a 10)
  endurance: number; // Aguante (1 a 10)
  destiny: number; // Puntos de destino
  experience: number; // Puntos de experiencia
  armor: number;
  damage: number;
  status: string;
  coins: number;
  epic: number;
  equipment: Equipment;
  partners: Partner[];
  traits?: Trait[]; // Lista de rasgos
  occupation: Occupation; // Ocupación del aventurero
  disorders?: Disorder[]; // Trastornos del aventurero
  aspects: Aspect[]; // Detalles de los cuatro aspectos
  talents?: Talent[]; // Lista de talentos del aventurero
}

// Cada aspecto contiene valores, habilidades y poderes
export interface Aspect {
  value: number; // Valor del aspecto (1 a 10)
  name: string; // Nomenclatura
  label: string; // Nombre español
  sum: string; // Contracción
  color: string; // Color poder
  description: string; // Descripción del aspecto
  power?: Power; // Poder especial asociado al aspecto
  skills?: Skill[]; // Lista de habilidades asociadas al aspecto
}

// Poder especial asociado a cada aspecto
export interface Power {
  name: string; // Nombre del poder
  description: string; // Descripción del poder
}

// Habilidades asociadas a un aspecto
export interface Skill {
  name: string; // Nombre de la habilidad
  value: number; // Valor de la habilidad (0 a 3)
  description: string; // Descripción de la habilidad
}

// Talentos del personaje
export interface Talent {
  name: string; // Nombre del talento
  description: string; // Descripción del talento
  type: 'combat' | 'magic' | 'exceptional'; // Tipo de talento -> Hay que relacionarlo con Aspects
}

// Rasgos del personaje: maniobras que conoce
export interface Trait {
  name: string; // Nombre del rasgo
  description: string; // Descripción del rasgo
}

// Ocupación del personaje
export interface Occupation {
  name: string; // Nombre de la ocupación
  traits?: Trait[]; // Rasgos relacionados con la ocupación
  talents?: Talent[]; // Talentos relacionados con la ocupación
  primary: string,
  secondary: string
}

// Trastornos del personaje
export interface Disorder {
  name: string; // Nombre del trastorno
  description: string; // Descripción del trastorno
}

// EQUIPO, no en BBDD
export interface Equipment {
  consumables: Item[];
  trinkets: Item[];
  weapons: Item[] | null;
  armor: Item[] | null;
  clothing : Item | null;
  backpack: Item[] | null;
  grimoire: Item[] | null;
  [key: string]: Item[] | Item | null;
}

// OBJETOS, en BBDD
export interface Item {
  //id: string;
  label: string;
  name: string;
  type: 'Consumible' | 'Pertrecho' | 'Arma' | 'Armadura' | 'Vestimenta';
  subtype?: 'A mano' | 'Arma seundaria' | 'A 2 manos' | 'Cuerpo' | 'Casco' | 'Escudo' | 'Cinturón' | 'Calzado' | 'Guantes' | 'Capa';
  description: string;
  aspectName: string;
  skillName: string;
  itemValue: number;
  cost: number;
  bonus: number;
  special?: ('Mágico' | 'Habilidad')[];
}

// PNJ, en BBDD
export interface Partner {
  //id: string;
  name: string;
  gender: 'male' | 'female';
  occupation: Occupation;
  skills: Skill[];
  life: number;
  wildCard: number;
  lvl: number;
  damage: number;
  armor: number;
}

