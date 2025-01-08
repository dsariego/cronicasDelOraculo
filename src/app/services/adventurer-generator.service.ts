import { inject, Injectable } from '@angular/core';
import { Adventurer, Aspect, Equipment, Item, Occupation, Partner, Skill } from '../models/adventure.module';
import { ConstantsService } from './constants.service';
import { CommonsService } from './commons.service';


@Injectable({
  providedIn: 'root',
})
export class AdventurerGeneratorService {
  private lastGeneratedAdventurer: Adventurer | null = null;
  _constants = inject(ConstantsService);
  _commonsService = inject(CommonsService);

  generateAdventurer(name: string, nickname: string, gender: 'male' | 'female', occupation: Occupation, items: Item[], occupations: Occupation[]): Adventurer {
    const aspects = this.generateAspects(occupation);
    const aspectsWithSkills = this.generateSkillsForAspects(aspects, occupation);
    const partners = this.generateRandomPartners(occupations, 3, false);
    const vigorValue = aspects.find(a => a.label === 'vigor')?.value ?? 0;
    const subterfugeValue = aspects.find(a => a.label === 'subterfuge')?.value ?? 0;
    const endurance = Math.floor((vigorValue + subterfugeValue) / 2) - 1;
    const primaryAspectInfo = this._constants.INFO_ASPECTS.find(
      (info) => info.aspect === occupation.primary.toLowerCase()
    );
    const secundaryAspectInfo = this._constants.INFO_ASPECTS.find(
      (info) => info.aspect === occupation.secondary.toLowerCase()
    );
    const description = gender == 'male' ?
    `Un aventurero ${occupation.name.toLowerCase()}. Se le conoce como ${nickname} y su principal aspecto es ${primaryAspectInfo?.label.toLowerCase()}, el secundario el ${primaryAspectInfo?.label.toLowerCase()}.`:
    `Una aventurera ${occupation.name.toLowerCase()}. Se la conoce como ${nickname} y su principal aspecto es ${primaryAspectInfo?.label.toLowerCase()}, el secundario el ${secundaryAspectInfo?.label.toLowerCase()}.`;

    const vigorAspect = aspectsWithSkills.aspects.find(aspect => aspect.label === "vigor");
    const vigorSubterfuge = aspectsWithSkills.aspects.find(aspect => aspect.label === "subterfuge");
    const vigorWisdom = aspectsWithSkills.aspects.find(aspect => aspect.label === "wisdom");
    const vigorCunning = aspectsWithSkills.aspects.find(aspect => aspect.label === "cunning");
    const damageValue = vigorAspect ? Math.max(1, Math.floor(vigorAspect.value / 2)) : 1;
    const armorValue = vigorSubterfuge ? Math.max(1, Math.floor(vigorSubterfuge.value / 2)) : 1;
    const epicValue = vigorWisdom && vigorCunning ? Math.max(1, Math.floor((vigorWisdom.value / 2) + ((vigorCunning.value / 2)))) : 1;
    const itemsConsumable = this._commonsService.getRandomItems(items.filter(item => item.type === "Consumible"), 2);
    const itemsTrinkets = this._commonsService.getRandomItems(items.filter(item => item.type === "Pertrecho"), 1);
    const itemsWeapon = this._commonsService.getRandomItems(items.filter(item => item.type === "Arma"), 1);
    const itemsArmor = this._commonsService.getRandomItems(items.filter(item => item.type === "Armadura"), 1);
    const itemsClothing = this._commonsService.getRandomItems(items.filter(item => item.type === "Vestimenta"), 1);

    const equipment: Equipment = {
      consumables: itemsConsumable,
      trinkets: itemsTrinkets,
      weapons: itemsWeapon,
      armor: itemsArmor,
      clothing: itemsClothing.length > 0 ? itemsClothing[0] : null,
      grimoire: [],
      backpack: [],
    };

    const adventurer: Adventurer = {
      id: this._commonsService.generateId(),
      name: name,
      nickname: nickname,
      gender: gender,
      description: description,
      virtue: 5,
      endurance,
      destiny: 1, // Placeholder
      experience: aspectsWithSkills.remainingPoints,
      armor: armorValue,
      damage: damageValue,
      status: 'none',
      coins: 50,
      epic: 1 + epicValue,
      //traits: [], // Placeholder
      occupation,
      //disorders: [], // Placeholder
      aspects: aspectsWithSkills.aspects as Aspect[],
      //talents: occupation.talents,
      equipment: equipment,
      partners: partners,
    };
    this.lastGeneratedAdventurer = adventurer;
    return adventurer;
  }

  getLastGeneratedAdventurer(): Adventurer | null {
    return this.lastGeneratedAdventurer;
  }

  generateRandomPartners(occupations: Occupation[], numOfPartners: number, extra: boolean): Partner[] {
    const partners: Partner[] = [];
    let extraUsed = false;
    for (let i = 0; i < numOfPartners; i++) {
      let life = 5;
      let plus = 1;
      let priSkill = 2;
      let secSkill = 0;
      let damage = 0;
      let armor = 0;
      let lvl = 1;
      const gender = i % 2 === 0 ? 'male' : 'female'
      const name = this._commonsService.generateRandomName('name', gender);
      const randomOccupation = this._commonsService.getRandomItem(occupations);
      const primaryAspect = randomOccupation.primary;
      const secondaryAspect = randomOccupation.secondary;
      damage = this._commonsService.getRandomNumber(3, 7);
      armor = 10 - damage;
      if (primaryAspect === 'widsom' || primaryAspect === 'subterfuge') {
        if (armor < damage) {
          [armor, damage] = [damage, armor];
        }
      }
      switch(primaryAspect) {
        case 'vigor':
          life += 2;
          break;
        case 'subterfuge':
          armor += 1;
          break;
        case 'wisdom':
          secSkill += 1;
          break;
        case 'cunning':
          plus += 1;
          break;
      }
      if(extra && !extraUsed){
        const randomAction = this._commonsService.getRandomNumber(1, 6);
        switch (randomAction) {
          case 1:
            life += 2;
            break;
          case 2:
            plus += 1;
            break;
          case 3:
            priSkill += 1;
            break;
          case 4:
            secSkill += 1;
            break;
          case 5:
            armor += 1;
            break;
          case 6:
            damage += 1;
            break;
        }
        extraUsed = true;
        lvl = 2;
      }
      const primarySkills = this.getRandomSkills(primaryAspect, priSkill);
      const secondarySkills = this.getRandomSkills(secondaryAspect, secSkill);
      const allSkills = [...primarySkills, ...secondarySkills];
      const partner: Partner = {
        name,
        gender,
        occupation: randomOccupation,
        skills: allSkills,
        life: life,
        wildCard: plus,
        damage: damage,
        armor: armor,
        lvl: lvl,
      };
      partners.push(partner);
    }
    return partners;
  }

  private getRandomSkills(aspect: string, count: number): Skill[] {
    const aspectKey = this._constants.ASPECT_TO_KEY_MAP[aspect];
    const skillsForAspect = [...(this._constants.SKILLS_MAP[aspectKey] || [])];
    const randomSkills: Skill[] = [];
    for (let i = 0; i < count; i++) {
      if (skillsForAspect.length === 0) {
        console.warn(`No hay suficientes habilidades disponibles para el aspecto: ${aspect}.`);
        break;
      }
      const randomIndex = this._commonsService.getRandomNumber(0, skillsForAspect.length - 1);
      const skillName = skillsForAspect.splice(randomIndex, 1)[0];
      const skillDescription = this._constants.SKILL_DESCRIPTION.find(desc => desc.label === skillName)?.description || 'Descripción no disponible';
      randomSkills.push({
        name: skillName,
        value: 1,
        description: skillDescription,
      });
    }
    return randomSkills;
  }

  private generateAspects(occupation: Occupation): Aspect[] {
    const MAX_ASPECT_VALUE = 8;
    const MIN_ASPECT_VALUE = 2;
    const TOTAL_POINTS = 18;
    const NUM_ASPECTS = 4;

    const aspectValues = this.generateAspectValues(MIN_ASPECT_VALUE, MAX_ASPECT_VALUE, TOTAL_POINTS, NUM_ASPECTS);

    // Ordenar los valores de mayor a menor
    const orderedValues = [...aspectValues].sort((a, b) => b - a);

    // Asignar valores a los aspectos según la ocupación
    const valueAspects = this.assignAspectValues(orderedValues, occupation);

    // Crear objetos de aspectos
    return this.createAspects(valueAspects);
  }

  // Generar valores aleatorios para los aspectos
  private generateAspectValues(min: number, max: number, totalPoints: number, numAspects: number): number[] {
    const values = Array(numAspects).fill(min);
    let remaining = totalPoints - min * numAspects;

    while (remaining > 0) {
      const randomIndex = Math.floor(Math.random() * values.length);
      if (values[randomIndex] < max) {
        values[randomIndex]++;
        remaining--;
      }
    }

    return values;
  }

  // Asignar valores a los aspectos según la ocupación
  private assignAspectValues(orderedValues: number[], occupation: Occupation): number[] {
    const aspectIndices = this._constants.INFO_ASPECTS.reduce((map, aspect, index) => {
      map[aspect.aspect] = index;
      return map;
    }, {} as Record<string, number>);
    const valueAspects = Array(4).fill(0);

    const primaryIndex = aspectIndices[occupation.primary.toLowerCase()];
    const secondaryIndex = aspectIndices[occupation.secondary.toLowerCase()];

    // Asignar valores principales
    const occupiedIndices = new Set<number>();
    valueAspects[primaryIndex] = orderedValues[0];
    occupiedIndices.add(primaryIndex);

    // Asignar valores secundarios
    valueAspects[secondaryIndex] = orderedValues[1];
    occupiedIndices.add(secondaryIndex);

    // Asignar los valores restantes a los índices no ocupados
    const remainingIndices = [0, 1, 2, 3].filter((index) => !occupiedIndices.has(index));
    const remainingValues = orderedValues.slice(2);

    remainingIndices.forEach((index, i) => {
      valueAspects[index] = remainingValues[i];
    });

    return valueAspects;
  }

  // Crear objetos de aspectos
  private createAspects(valueAspects: number[]): Aspect[] {
    const aspectKeys = ['vigor', 'subterfuge', 'wisdom', 'cunning'];
    return aspectKeys.map((key, index) =>
      this.createAspect(valueAspects[index], key)
    );
  }

  // Crear un aspecto individual
  private createAspect(value: number, aspectKey: string): Aspect {
    const aspectInfo = this._constants.INFO_ASPECTS.find(
      (info) => info.aspect === aspectKey.toLowerCase()
    );

    if (!aspectInfo) {
      throw new Error(`Aspecto no encontrado: ${aspectKey}`);
    }

    return {
      value: value,
      label: aspectInfo.aspect,
      name: aspectInfo.label,
      sum: aspectInfo.sum,
      color: aspectInfo.color,
      description: aspectInfo.description,
      skills: [],
    };
  }

  private generateSkillsForAspects(aspects: Aspect[], occupation: Occupation): { aspects: Aspect[]; remainingPoints: number } {
    let remainingPoints = 0;
    const MAX_SKILL_VALUE = 3;
    const FACTOR_POINTS_VALUE = 2;

    const skillCost = this._constants.SKILL_COST;
    const primaryAspect = occupation.primary;
    const secondaryAspect = occupation.secondary;
    const skillsMap = this._constants.SKILLS_MAP;

    for (const aspect of aspects) {
      const skillPoints = aspect.value * FACTOR_POINTS_VALUE + remainingPoints;
      const aspectKey = aspect.name.toLowerCase();
      const aspectSkills = skillsMap[aspectKey as keyof typeof skillsMap];

      if (!Array.isArray(aspectSkills)) {
        console.error(`No skills found for aspect: ${aspectKey}`);
        continue;
      }

      const skills = this._commonsService.shuffleArray(aspectSkills.map((name) => ({ name, value: 0, description: '' })));
      let remaining = skillPoints;

      const costType =
        aspectKey === primaryAspect
          ? 'principalSkill'
          : aspectKey === secondaryAspect
          ? 'secondarySkill'
          : 'otherSkill';

      const currentCostArray = skillCost[costType];

      for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        let skillLevel = skill.value;
        while (skillLevel < MAX_SKILL_VALUE && remaining >= currentCostArray[skillLevel]) {
          remaining -= currentCostArray[skillLevel];
          skillLevel++;
        }
        skill.value = skillLevel;
      }

      remainingPoints = remaining;
      aspect.skills = skills;
    }

    return { aspects, remainingPoints };
  }


}
