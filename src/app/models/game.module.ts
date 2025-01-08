// CRÓNICA, no en BBDD
export interface Chronicle {
  title: string;
  description: string;
  challenge: Challenge;
  acts?: Act[];
}

// DESAFÍOS, si en BBDD
export interface Challenge {
  id: string;
  name: string;
  label: string;
  description: string;
  //reward: string;
  progress: string[];
  type: 'Senda de aventura' | 'Senda secundaria' | 'Camino del héroe'
  initialEvent?: string;
  finalEventVictory?: string;
  finalEventDefeat?: string;
}

// ACTOS, no en BBDD
export interface Act {
  title: string;
  subtitle: string;
  environmentType: EnvironmentType;
  enemies: Enemy[];
  scenes: Scene[];
  extraScenes?: Scene[];
}

// TIPO DE ENTORNOS, si en BBDD
export interface EnvironmentType {
  //id: string;
  name: string;
  label: string;
  description: string;
  enemyType: EnemyType[];
  color: string;
  //lootType: ObjectType[];
}

// ENEMIGO, si en BBDD
export interface Enemy {
  //id: string;
  name: string;
  label: string;
  description: string;
  enemyType: EnemyType;
  //enemyRole: RoleType; //Agente,
  environmentType: EnvironmentType;
  aspects: AspectTest[];
  experience: number;
  powerLevel: number;
  minions?: Enemy[];
  powers?: Power[];
  life: number;
  combat: number;
  armor: number;
  damage: number;
  weaknesses?: Weakness[];
  abilities?: Abilitie[]; // Pueden hacer realizar un test a un personaje
  loot?: Object[];
  improvements?: Improvement[];
}

// Test ASPECTOS, no en BBDD
export interface AspectTest {
  name: string,
  label: string,
  value: number,
}

// ESCENAS, no en BBDD
export interface Scene {
  name: string;
  //type: SceneType;
  description: string;
  plotPoints: number;
  event: Event[];
  result?: Results[];
  isOptional: boolean;
}

// PRUEBAS, no en BBDD
export interface Event {
  name: string;
  subName: string;
  description: string;
  tests: Test[] | undefined;
  enemy: Enemy | undefined;
}

// TEST, no en BBDD
export interface Test {
  value: number;
  aspect: string;
  skill: string;
  description: string;
}

export interface GameSettings {
  difficulty: string;
  difficultyValue: number;
  isPlaying: boolean;
  currentResult: string;
  prePrompt: string[];
  nextCheckups?: string[];
  shuffleDeck?: Deck[];
  discardDeck?: Deck[];
  eliminateDeck?: Deck[];
  actPoints: number,
  scenePoints: number;
  plotPoints: number;
}

// DECK
export interface Deck {
  aspect: string;
  value: number;
  isFlipped: boolean;
}

// ESCENARIO
export interface Location {
  //id: string;
  name: string;
  description: string;
  objective: Objective[];
  enemies: Enemy[];
  scenes: Scene[]; // pruebas y objetivos
  environmentType: EnvironmentType;
  createdAt: Date;
  //updatedAt?: Date;
  isCompleted: boolean;
}

// Objetivos, tanto principales como secundarios
export interface Objective{
  id: string;
  name: string;
  description: string;
  //result?: Results[];
  type: 'principal' | 'secundaria' | 'personal'
}





// RECOMPENSAS / CASTIGOS
export interface Results {
  id: string;
  name: string;
  description: string;
  ObjectType?: ObjectType;
  value?: number;
  loot?: Object[];
}



// HABILIDADES
export interface Abilitie {
  name: string;
  description: string;
  value: number;
  aspect: string;
}

// PODERES
export interface Power {
  apiName: string;
  label: string;
  description?: string;
}

// TIPO DE ENEMIGO
export interface EnemyType {
  name: string;
  label: string; //No Muerto, Bestia, Etc...
  description?: string;
  powers?: Power[];
  abilities?: Abilitie[];
  weaknesses?: Weakness[];
  enemies: string[];
}

// TIPO DE ROL: Antagonista, Agente, Esbirro, Errante
export interface RoleType {
  apiName: string;
  label: string;
  description?: string;
}

// DEBILIDADES
export interface Weakness {
  apiName: string;
  label: string;
  description?: string;
}

// MEJORAS/PODERES
export interface Improvement {
  apiName: string;
  label: string;
  description?: string;
}

// TIPO DE ESCENARIO: Final, preludio, intermedio
export interface SceneType {
  name: string;
  label: string;
  description: string;
}

// OBJETOS
export interface Object {
  type: 'Experience' | 'Item' | 'Currency';
  description: string;
  value: number;
  objectType: ObjectType;
  values: number[]; // Modificadores numéricos
  aspects: string[]; // Posición 1 a 4 para Aspectos, luego se añaden skills
}

// TIPO DE OBJETO
export interface ObjectType {
  apiName: string;
  label: string;
  description?: string;
}

// PRUEBA
export interface Test {
  //id: string;
  description: string;
  value: number;
  aspect: string;
  skill: string;
}

export interface Modifiers {
  values: number[]; // Modificadores numéricos
  aspects: string[]; // Posición 1 a 4 para Aspectos, luego se añaden skills
  type: 'Active' | 'Pasive';
}
