import { Aspect } from "./adventure.module";
import { Enemy } from "./game.module";

export enum UserRole {
  ADMIN = 'ADMIN',
  //EDITOR = 'EDITOR',
  //VIEWER = 'VIEWER',
  REGISTERED = 'REGISTERED'
}

export interface User {
  name: string;
  password: string;
  role: UserRole;
  needHelp: boolean;
  needSounds: boolean;
}

export interface Option {
  text: string;
  skill: string | undefined;
  aspect: string | undefined;
  value: number;
  type: 'Enfrentamiento' | 'Decisión' | 'Desafío';
  enemy: Enemy | undefined;
  willcardItem: string | undefined;
  special?: string;
}
