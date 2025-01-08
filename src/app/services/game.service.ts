import { inject, Injectable } from '@angular/core';
import { AdventurerGeneratorService } from './adventurer-generator.service';
import { Adventurer, Aspect, Item, Occupation, Power } from '../models/adventure.module';
import { FetchDataService } from './fetchData.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { Act, Challenge, Chronicle, Deck, Enemy, EnemyType, EnvironmentType, Event, GameSettings, Objective, Scene, SceneType, Test } from '../models/game.module';
import { CommonsService } from './commons.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // Datos de ocupaciones
  private remainingOccupations: Occupation[] = [];
  private remainingOccupationsSubject = new BehaviorSubject<Occupation[]>([]);
  remainingOccupations$ = this.remainingOccupationsSubject.asObservable();
  // Datos de objetivos
  private objectives: Objective[] = [];
  private objectivesSubject = new BehaviorSubject<any[]>([]);
  objectives$ = this.objectivesSubject.asObservable();
  // Datos de tipos de enemigos
  private enemyTypes: EnemyType[] = [];
  private enemyTypesSubject = new BehaviorSubject<any[]>([]);
  enemyTypes$ = this.enemyTypesSubject.asObservable();
  // Datos de enemigos
  private enemies: Enemy[] = [];
  private enemiesSubject = new BehaviorSubject<any[]>([]);
  enemies$ = this.enemyTypesSubject.asObservable();
  // Datos de tipos de escenas
  private sceneTypes: SceneType[] = [];
  private sceneTypesSubject = new BehaviorSubject<any[]>([]);
  sceneTypes$ = this.sceneTypesSubject.asObservable();
  // Datos de tipos de entornos
  private environmentTypes: EnvironmentType[] = [];
  private environmentTypesSubject = new BehaviorSubject<any[]>([]);
  environmentTypes$ = this.environmentTypesSubject.asObservable();
  // Datos de tipos de semillas de historia
  private challenge: Challenge[] = [];
  private challengeSubject = new BehaviorSubject<any[]>([]);
  challenge$ = this.challengeSubject.asObservable();
  // Datos de tipos Ocupaciones
  private occupation: Occupation[] = [];
  private occupationSubject = new BehaviorSubject<any[]>([]);
  occupation$ = this.occupationSubject.asObservable();
  // Datos de tipos de Equipo
  private items: Item[] = [];
  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();

  private _constants = inject(ConstantsService);
  private selectedAdventurerKey = 'selectedAdventurer';
  private selectedChronicleKey = 'selectedChronicle';
  private selectedGameSettings = 'selectedGameSettings';


  constructor(
    private adventurerGeneratorService: AdventurerGeneratorService,
    private _services: CommonsService,
    private fetchData: FetchDataService) { }



  getDatabaseInfoChronicle(numberOfChronicles: number): Observable<Chronicle[]>{
    return new Observable<Chronicle[]>((observer) => {

        this.fetchData.getAllData().subscribe(({
          objectives,
          enemies,
          enemyTypes,
          sceneTypes,
          environmentTypes,
          seedHistory
        }) => {
          // Almacenar los datos en las propiedades del servicio
          this.sceneTypes = [...sceneTypes];
          this.environmentTypes = [...environmentTypes];
          this.enemies = [...enemies];
          this.enemyTypes = [...enemyTypes];
          this.objectives = [...objectives];
          this.challenge = [...seedHistory];

          // Emitir los nuevos datos a través de los Subjects
          this.sceneTypesSubject.next(this.sceneTypes);
          this.environmentTypesSubject.next(this.environmentTypes);
          this.enemiesSubject.next(this.enemies);
          this.enemyTypesSubject.next(this.enemyTypes);
          this.objectivesSubject.next(this.objectives);
          this.challengeSubject.next(this.challenge);

          // Generar las ubicaciones una vez que los datos estén listos
          const chronicle = this.generateChronicles(numberOfChronicles);
          observer.next(chronicle);
          observer.complete();
        });

    });
  }

  private generateChronicles(numberOfChronicles: number): Chronicle[] {
    let uniqueEnvironmentTypes = [...this.environmentTypes];
    let uniqueChallenges = [...this.challenge];
    let uniqueEnemies = [...this.enemies];

    const chronicles: Chronicle[] = [];
    for (let i = 0; i < numberOfChronicles; i++) {
      if (uniqueEnvironmentTypes.length === 0) {
        uniqueEnvironmentTypes = [...this.environmentTypes];
      }
      if (uniqueChallenges.length === 0) {
        uniqueChallenges = [...this.challenge];
      }
      if (uniqueEnemies.length === 0) {
        uniqueEnemies = [...this.enemies];
      }
      const acts = [];
      const randomChallenge = this._services.getRandomItem(uniqueChallenges);
      for (let i = 0; i < 3; i++) {
        const randomEnvironmentType = this._services.getRandomItem(uniqueEnvironmentTypes);
        const powerLevel1Enemies = uniqueEnemies.filter(enemy => enemy.powerLevel === 1);
        const powerLevel2Enemies = uniqueEnemies.filter(enemy => enemy.powerLevel === 2);
        const powerLevel3Enemies = uniqueEnemies.filter(enemy => enemy.powerLevel === 3);
        const randomEnemies = [
          ...this._services.getRandomItems(powerLevel1Enemies, 3),
          ...this._services.getRandomItems(powerLevel2Enemies, 2),
          ...this._services.getRandomItems(powerLevel3Enemies, 1)
        ];
        const act = this.generateActsAndScenes(randomChallenge, randomEnvironmentType, randomEnemies, i);
        acts.push(act);
      }
      const chronicle: Chronicle = {
        title: 'Una aventura de ' + randomChallenge.label,
        description: randomChallenge.initialEvent || 'Pronto descubriremos de qué trata esta aventura, adéntrate en el misterio...',
        challenge: randomChallenge,
        acts: acts,
      };
      chronicles.push(chronicle);
    }
    return chronicles;
  }

  generateActsAndScenes(challenge: Challenge, environmentType: EnvironmentType, enemies: Enemy[], index: number): Act {
    let progressIndex = 0;
    const act: Act = {
      title: this._constants.ACT_TITLES[index],
      subtitle: this._constants.ACT_SUBTITLES[index],
      environmentType: environmentType,
      enemies: [...enemies],
      scenes: [],
    };
    for (let j = 0; j < this._constants.SCENE_NAMES[index].length; j++) {
      const scene: Scene = {
        name: this._constants.SCENE_NAMES[index][j],
        description: challenge.progress[progressIndex] || 'Descripción no disponible',
        plotPoints: this._constants.PLOT_POINTS[index][j],
        event: this.generateTestsForAct(index, this._constants.PLOT_POINTS[index][j], enemies),
        isOptional: false,
      };
      act.scenes.push(scene);
      progressIndex++;
    }
    return act;
  }

  private generateTestsForAct(actIndex: number, plotPoints: number, enemies: Enemy[]): Event[] {
    const events: Event[] = [];

    for (let i = 0; i < plotPoints; i++) {
      let numberOfTests: number;
      let lvlvOfConfrontation: number[];
      switch (actIndex) {
        case 0: // Acto I
          numberOfTests = Math.floor(Math.random() * 2) + 3;
          lvlvOfConfrontation = [1,1,1,1,2];
          break;
        case 1: // Acto II
          numberOfTests = Math.floor(Math.random() * 3) + 2;
          lvlvOfConfrontation = [1,1,2,2,3];
          break;
        case 2: // Acto III
          numberOfTests = Math.floor(Math.random() * 2) + 2;
          lvlvOfConfrontation = [1,2,2,3,3];
          break;
        default:
          numberOfTests = 3;
          lvlvOfConfrontation = [1,1,2,2,3];
          break;
      }
      const currentNameProbabilities = this._constants.NAME_PROBABILITIES[actIndex];
      const randomName = this.getRandomElementWithProbability(Object.keys(this._constants.NAME_SUBNAME_MAP), currentNameProbabilities);

      if(randomName === 'Enfrentamiento'){
        const randomLvlvOfConfrontation = this.getRandomElement(lvlvOfConfrontation);
        const enemyConfrontation = this.getRandomElement(enemies.filter(enemy => enemy.powerLevel === randomLvlvOfConfrontation));
        events.push(this.generateEvent(numberOfTests, actIndex, randomName, enemyConfrontation));
      }else if(randomName === 'Decisión'){
        events.push(this.generateEvent(numberOfTests, actIndex, randomName, undefined));
      }else{
        events.push(this.generateEvent(numberOfTests, actIndex, randomName, undefined));
      }
    }
    return events;
  }

  private generateEvent(count: number, actIndex: number, randomName: string, enemy?: Enemy): Event{
    const currentSubNameProbabilities = this._constants.SUBNAME_PROBABILITIES[randomName][actIndex];
    const randomSubName = this.getRandomElementWithProbability(this._constants.NAME_SUBNAME_MAP[randomName], currentSubNameProbabilities);
    let test;
    if(randomName === 'Desafío'){
      test = this.generateTests(count, actIndex);
    }
    return {
      name: randomName,
      subName: randomSubName,
      description: `${randomName} tipo ${randomSubName}`,
      tests: test ?? undefined,
      enemy: enemy ?? undefined,
    };
  }

  private generateTests(count: number, actIndex: number): Test[] {
    const tests: Test[] = [];
    let minRange = 8;
    let maxRange = 13;
    if (count === 2) {
      minRange = 10;
    } else if (count === 3) {
      minRange = 9;
    }

    const aspectProbabilities = [
      { aspect: 'vigor', probability: 20 },
      { aspect: 'subterfugio', probability: 20 },
      { aspect: 'sabiduria', probability: 30 },
      { aspect: 'astucia', probability: 30 },
    ];
    const skillsToTest: { [key: string]: string[] } = {
      vigor: ['Resistencia', 'Acrobacias', 'Atletismo'],
      subterfugio: ['Sigilo', 'Juego de manos', 'Ocultar'],
      sabiduria: ['Percepción', 'Concentración', 'Supervivencia', 'Deducción', 'Medicina', 'Arcano'],
      astucia: ['Intimidar', 'Intuición', 'Alerta', 'Entereza', 'Persuadir', 'Liderazgo'],
    };

    for (let i = 0; i < count; i++) {
      const randomAspect = this.getRandomAspectBasedOnProbability(aspectProbabilities);
      const skills = skillsToTest[randomAspect];
      const randomSkill = this.getRandomElement(skills);
      const skillDescription = this._constants.SKILL_DESCRIPTION.find(skill => skill.label === randomSkill)?.description || `Test de ${randomSkill}`;

      tests.push({
        description: skillDescription,
        value: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange + (actIndex + 1),
        aspect: randomAspect,
        skill: randomSkill,
      });
    }

    return tests;
  }

  private getRandomAspectBasedOnProbability(aspectProbabilities: { aspect: string, probability: number }[]): string {
    const randomValue = Math.random() * 100;
    let cumulativeProbability = 0;
    for (const { aspect, probability } of aspectProbabilities) {
      cumulativeProbability += probability;
      if (randomValue <= cumulativeProbability) {
        return aspect;
      }
    }
    throw new Error('Probabilidades no suman 100%');
  }

  getDatabaseInfoAdventurers(numberOfAdventurers: number): Observable<Adventurer[]>{
    return new Observable<Adventurer[]>((observer) => {

      this.fetchData.getAllData().subscribe(({
        occupations,
        items
      }) => {
        // Almacenar los datos en las propiedades del servicio
        this.occupation = [...occupations];
        this.items = [...items];

        // Emitir los nuevos datos a través de los Subjects
        this.occupationSubject.next(this.occupation);
        this.itemsSubject.next(this.items);

        // Generar las ubicaciones una vez que los datos estén listos
        const adventurer = this.generateMultipleAdventurers(numberOfAdventurers);
        observer.next(adventurer);
        observer.complete();
      });

    });
  }

  generateMultipleAdventurers(numberOfAdventurers: number): Adventurer[] {
    let uniqueOccupation = [...this.occupation];
    let uniqueItems = [...this.items];
    const adventurers: Adventurer[] = [];

    for (let i = 0; i < numberOfAdventurers; i++) {
      if (uniqueOccupation.length === 0) {
        uniqueOccupation = [...this.occupation];
      }
      if (uniqueItems.length === 0) {
        uniqueItems = [...this.items];
      }
      const gender = i % 2 === 0 ? 'male' : 'female'
      const name = this._services.generateRandomName('name', gender);
      const nickName = this._services.generateRandomName('nickName', gender);
      const randomOccupation = this._services.getRandomItem(uniqueOccupation);

      const adventurer = this.adventurerGeneratorService.generateAdventurer(name, nickName, gender, randomOccupation, uniqueItems, uniqueOccupation);
      adventurers.push(adventurer);
    }

    return adventurers;
  }

  /*generateAdventurer(name: string, nickName: string, gender: 'male' | 'female', occupation: Occupation, items: Item[]): Adventurer {
    return this.adventurerGeneratorService.generateAdventurer(name, nickName, gender, occupation, items);
  }

  generateMultipleAdventurers(numberOfAdventurers: number): Observable<Adventurer[]> {
    return new Observable<Adventurer[]>((observer) => {
      // Asegurarse de que las ocupaciones están disponibles antes de continuar
      if (this.remainingOccupations.length === 0) {
        this.fetchData.getOccupations().subscribe((data: Occupation[]) => {
          this.remainingOccupations = [...data];
          this.remainingOccupationsSubject.next(this.remainingOccupations); // Actualiza el Observable

          const adventurers: Adventurer[] = [];
          for (let i = 0; i < numberOfAdventurers; i++) {
            const gender = i % 2 === 0 ? 'male' : 'female'
            const name = this._services.generateRandomName('name', gender);
            const nickName = this._services.generateRandomName('nickName', gender);
            const occupation = this.getRandomOccupation();
            const adventure = this.generateAdventurer(name, nickName, gender, occupation);
            adventurers.push(adventure);
          }
          observer.next(adventurers);
          observer.complete()
        });
      } else {
        // Si las ocupaciones ya están cargadas, generamos los aventureros inmediatamente
        const adventurers: Adventurer[] = [];
        for (let i = 0; i < numberOfAdventurers; i++) {
          const gender = i % 2 === 0 ? 'male' : 'female'
          const name = this._services.generateRandomName('name', gender);
          const nickName = this._services.generateRandomName('nickName', gender);
          const occupation = this.getRandomOccupation();
          adventurers.push(this.generateAdventurer(name, nickName, gender, occupation));
        }
        observer.next(adventurers);
        observer.complete();
      }
    });
  }*/


  getRandomOccupation(): Occupation {
    if (this.remainingOccupations.length === 0) {
      // Si no hay ocupaciones, recargar y reiniciar
      this.fetchData.getOccupations().subscribe((data: Occupation[]) => {
        this.remainingOccupations = [...data];
        this.remainingOccupationsSubject.next(this.remainingOccupations); // Actualiza el Observable
      });
    }

    const randomIndex = Math.floor(Math.random() * this.remainingOccupations.length);
    const selectedOccupation = this.remainingOccupations[randomIndex];
    this.remainingOccupations.splice(randomIndex, 1); // Eliminar la ocupación seleccionada
    this.remainingOccupationsSubject.next(this.remainingOccupations); // Actualizar el Observable
    return selectedOccupation;
  }

  getSelectedAdventurer(): Adventurer | null {
    if (typeof window !== 'undefined' && localStorage) {
      const selectedAdventurer = localStorage.getItem(this.selectedAdventurerKey);
      return selectedAdventurer ? JSON.parse(selectedAdventurer) : null;
    }
    return null;
  }

  getPrimaryColor(primary: string): string {
    const aspect = this._constants.INFO_ASPECTS.find(item => item.aspect === primary);
    return aspect ? aspect.color : '#333';
  }

  generatePrompt(gameSettings: GameSettings, chronicle: Chronicle, adventurer: Adventurer): string{
    console.log('Tipo evento: '
      +JSON.stringify(chronicle.acts?.[gameSettings.actPoints]?.scenes?.[gameSettings.scenePoints]?.event?.[gameSettings.plotPoints]?.name)+ ' de '
      +JSON.stringify(chronicle.acts?.[gameSettings.actPoints]?.scenes?.[gameSettings.scenePoints]?.event?.[gameSettings.plotPoints]?.subName)
    );
    console.log('PUNTOS: ' +gameSettings.actPoints+', '+gameSettings.scenePoints+', '+gameSettings.plotPoints);
    let textPrompt;
    const scenesChronicle = chronicle.acts?.[gameSettings.actPoints]?.scenes;
    const evenType = scenesChronicle?.[gameSettings.scenePoints]?.event?.[gameSettings.plotPoints];
    const tests = evenType?.tests;
    const enemy = evenType?.enemy;
    if (tests && Array.isArray(tests)) {
      console.log('tests >>');
      tests.forEach((test, index) => {
        console.log(`${index + 1}. ${JSON.stringify(test)}`);
      });
    } else {
      console.log('No se encontraron tests: ' +JSON.stringify(chronicle.acts?.[gameSettings.actPoints]?.scenes?.[gameSettings.scenePoints]?.event?.[gameSettings.plotPoints]?.name));
    }
    const skillDescriptions = tests?.map(test => {
      const skillData = this._constants.SKILL_DESCRIPTION.find(s => s.label === test.skill);
      return skillData ? `${test.skill}: ${skillData.description}` : '';
    }).filter(description => description !== '') || [];
    let context = '';
    let numPar = '3';
    if(gameSettings.actPoints === 0 && gameSettings.scenePoints === 0 && gameSettings.plotPoints === 0){
      context = this._constants.PROMPT_INI0 + this._constants.PROMPT_INI1 + this._constants.PROMPT_INI2;
    }else{
      if (gameSettings.currentResult.startsWith('Nuevo') || gameSettings.currentResult.startsWith('Nueva')) {
        numPar = '3';
      } else {
        numPar = '2';
      }
      const formattedPrePrompt = gameSettings.prePrompt.map((item, index) => `${index + 1}. ${item}`).join('\n');
      context = `Sucesos previos:\n${formattedPrePrompt}\nExplica el resultado del último suceso y enlaza con la siguiente trama/acto. No hagas descripción del entorno, aventurero ni de la ubicación, haz que parezca natural cómo continúa la acción a razón de las acciones previas descritas y el contexto de la escena: ${gameSettings.currentResult}`;
    }
    if(evenType?.name === 'Desafío'){
      textPrompt = `Habilidades para las pruebas: ${skillDescriptions}
      ${this._constants.PROMPT_POS0.replace('{{scene}}', evenType?.description ?? 'Evento').replace('{{numPar}}', numPar)}. ${this._constants.PROMPT_POS1.replace('{{numOpc}}', skillDescriptions.length.toString())}. ${this._constants.PROMPT_POS2}. ${this._constants.PROMPT_POS3}
      `;
    }else if(evenType?.name === 'Decisión'){
      textPrompt = `Decisión de tipo ${evenType?.subName}. ${this._constants.PROMPT_POS0.replace('{{scene}}', evenType?.description ?? 'Evento').replace('{{numPar}}', numPar)}. `;
    }else if(evenType?.name === 'Enfrentamiento'){
      textPrompt = `Enfrentamiento contra un ${enemy?.name}, ${enemy?.description}. ${this._constants.PROMPT_POS0.replace('{{scene}}', evenType?.description ?? 'Evento').replace('{{numPar}}', numPar)}. `;
    }
    const partnersNames = adventurer.partners.map((partner) => partner.name).join(', ');
    return `Contexto: ${context}
    Aventurero: ${this._constants.PROMPT_ADV0.replace('{{name}}', adventurer.name).replace('{{occupation}}', adventurer.occupation.name).replace('{{partners}}', partnersNames)}
    Semilla de la aventura: ${chronicle.title}, has sido contratado para ayudar al protagonista, ${chronicle.description}.
    ${chronicle.acts?.[gameSettings.actPoints]?.title}: ${chronicle.acts?.[gameSettings.actPoints]?.subtitle}.
    Escena: ${scenesChronicle?.[gameSettings.scenePoints]?.name}, ${scenesChronicle?.[gameSettings.scenePoints]?.description}.
    Ubicación actual (entorno): una zona de ${chronicle.acts?.[gameSettings.actPoints]?.environmentType?.label}, ${chronicle.acts?.[gameSettings.actPoints]?.environmentType?.description}.
    ${textPrompt}`;
  }

  setSelectedItem(item: any | null, flag: 'adv' | 'chr' | 'dif'): void {
    if (typeof window === 'undefined' || !localStorage) {
      return;
    }
    const storageKeys = {
      adv: this.selectedAdventurerKey,
      chr: this.selectedChronicleKey,
      dif: this.selectedGameSettings
    };
    const key = storageKeys[flag];
    if (!key) {
      console.warn(`Invalid flag provided: ${flag}`);
      return;
    }
    if (item) {
      localStorage.setItem(key, JSON.stringify(item));
    } else {
      localStorage.removeItem(key);
    }
  }

  clearSelectedItem(flag: string): void {
    if (typeof window !== 'undefined' && localStorage && flag == 'adv') {
      localStorage.removeItem(this.selectedAdventurerKey);
    } else if (typeof window !== 'undefined' && localStorage && flag == 'chr') {
      localStorage.removeItem(this.selectedChronicleKey);
    } else if (typeof window !== 'undefined' && localStorage && flag == 'dif') {
      localStorage.removeItem(this.selectedGameSettings);
    } else if (typeof window !== 'undefined' && localStorage && flag == 'all') {
      localStorage.removeItem(this.selectedChronicleKey);
      localStorage.removeItem(this.selectedAdventurerKey);
      localStorage.removeItem(this.selectedGameSettings);
    }
  }

  generateRandomAspects() {
    const infoAspects = this._constants.INFO_ASPECTS;
    const randomAspect = this.getRandomElement(infoAspects);
    const randomValue = this.generateGaussianValue(8, 18, 12); // Genera un valor con distribución gaussiana
    return {
      aspect: randomAspect.aspect,
      value: randomValue,
    };
  }

  private generateGaussianValue(min: number, max: number, mean: number): number {
    let value: number;
    do {
      // Suma de valores aleatorios para aproximar una distribución normal
      const sum = Array.from({ length: 6 }, () => Math.random()).reduce((a, b) => a + b, 0);
      value = Math.round((sum / 6) * (max - min) + min);
    } while (value < min || value > max); // Aseguramos que esté en el rango

    return value;
  }

  private getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  private getRandomElementWithProbability<T>(array: T[], probabilities: number[]): T {
    const totalProbability = probabilities.reduce((sum, prob) => sum + prob, 0);
    const randomNum = Math.random() * totalProbability;
    let cumulativeProbability = 0;
    for (let i = 0; i < array.length; i++) {
        cumulativeProbability += probabilities[i];
        if (randomNum <= cumulativeProbability) {
            return array[i];
        }
    }
    return array[array.length - 1];
  }

  generateAspects(): Aspect[] {
    const aspects: Aspect[] = [];
    this._constants.INFO_ASPECTS.forEach(aspectInfo => {
      const aspect = this.generateAspect(aspectInfo.aspect);
      aspects.push(aspect);
    });
    return aspects;
  }

  private generateAspect(aspectName: string): Aspect {
    // Genera un valor aleatorio entre 1 y 10
    const value = Math.floor(Math.random() * 10) + 1;

    // Encuentra la información relacionada con el aspecto
    const aspectInfo = this._constants.INFO_ASPECTS.find(info => info.aspect.toLowerCase() === aspectName.toLowerCase());

    return {
      value: value,  // El valor generado aleatoriamente
      label: aspectInfo ? aspectInfo.label : 'No definida',
      name: aspectName,  // El nombre del aspecto (pasado como parámetro)
      sum: aspectInfo ? aspectInfo.sum : aspectName.substring(0, 3).toUpperCase(),  // Si no se encuentra info, toma las primeras 3 letras
      color: aspectInfo ? aspectInfo.color : '#CCC',
      description: aspectInfo ? aspectInfo.description : `Descripción de ${aspectName}`,  // Usamos la descripción de INFO_ASPECTS si está disponible
      //power: this.generateRandomPower(),  // Asigna un poder aleatorio
    };
  }

  generateRandomPower(): Power {
    const powers: Power[] = [
      { name: 'Fuerza bruta', description: 'Aumenta la fuerza física del enemigo.' },
      { name: 'Agilidad extrema', description: 'Mejora la capacidad de esquivar y moverse rápidamente.' },
      { name: 'Resistencia mental', description: 'Resistencia a efectos mentales o hechizos.' },
    ];
    return powers[Math.floor(Math.random() * powers.length)];
  }

  /*getRandomItemFromSkills() {
    const selectedSkill = this._services.getRandomItemFromMap(this._constants.SKILLS_MAP, 3);
    if (typeof window !== 'undefined' && localStorage) {
      let selectedGameSettings = JSON.parse(localStorage.getItem('selectedGameSettings') || '{}');
      selectedGameSettings.nextCheckups = selectedSkill;
      localStorage.setItem('selectedGameSettings', JSON.stringify(selectedGameSettings));
    }

  }*/

  getSkillValueByAspect(aspectLabel: string, skillName: string, adventurer: Adventurer): number | undefined {
    const aspect = adventurer.aspects.find(a => a.name.toLocaleLowerCase() === aspectLabel.toLocaleLowerCase());
    if (aspect && aspect.skills) {
      const skill = aspect.skills.find(s => s.name.toLocaleLowerCase() === skillName.toLocaleLowerCase());
      if (skill) {
        return skill.value;
      }
    }
    return undefined;
  }

  // DECK
  initializeGameSettings(dif: string, difV: number, isP: boolean): void {
    const initialSettings: GameSettings = {
      difficulty: dif,
      difficultyValue: difV,
      isPlaying: isP,
      prePrompt: [],
      currentResult: '',
      shuffleDeck: [],
      discardDeck: [],
      actPoints: 0,
      scenePoints: 0,
      plotPoints: 0,
    };
    this._services.saveToLocalStorage('selectedGameSettings', initialSettings);
    this.createDeck();
  }

  createDeck(): void {
    const newDeck: Deck[] = [];
    for (const aspect of this._constants.ASPECTS_ARRAY) {
      for (let value = 1; value <= 10; value++) {
        newDeck.push({ aspect, value, isFlipped: false });
      }
    }
    this.shuffleArray(newDeck);
    const gameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings');
    if (!gameSettings) {
      console.error('No se encontraron configuraciones de juego en el localStorage.');
      return;
    }
    gameSettings.shuffleDeck = newDeck;
    gameSettings.discardDeck = [];
    this._services.saveToLocalStorage('selectedGameSettings', gameSettings);
  }

  drawCards(count: number): Deck[] {
    const gameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings');
    if (!gameSettings) {
      console.error('No se encontraron configuraciones de juego en el localStorage.');
      return [];
    }

    if (!gameSettings.shuffleDeck || gameSettings.shuffleDeck.length === 0) {
      if (gameSettings.discardDeck && gameSettings.discardDeck.length > 0) {
        console.log('El mazo está vacío, barajando el descarte...');
        gameSettings.shuffleDeck = [...gameSettings.discardDeck];
        gameSettings.discardDeck = [];
        this.shuffleArray(gameSettings.shuffleDeck);
      } else {
        console.error('El mazo y el descarte están vacíos. No se puede continuar.');
        return [];
      }
    }

    const drawnCards: Deck[] = [];
    let cardsLeft = count;

    while (cardsLeft > 0 && gameSettings.shuffleDeck.length > 0) {
      const drawnCard = gameSettings.shuffleDeck.shift();
      if (drawnCard) {
        drawnCards.push(drawnCard);
        cardsLeft--;
      }
    }

    if (cardsLeft > 0 && gameSettings.discardDeck && gameSettings.discardDeck.length > 0) {
      console.log('El mazo se agotó. Barajando el descarte nuevamente...');
      gameSettings.shuffleDeck = [...gameSettings.discardDeck];
      gameSettings.discardDeck = [];
      this.shuffleArray(gameSettings.shuffleDeck);

      while (cardsLeft > 0 && gameSettings.shuffleDeck.length > 0) {
        const drawnCard = gameSettings.shuffleDeck.shift();
        if (drawnCard) {
          drawnCards.push(drawnCard);
          cardsLeft--;
        }
      }
    }

    if (cardsLeft > 0) {
      console.warn('No hay suficientes cartas para completar la extracción solicitada.');
    }

    gameSettings.discardDeck = [...(gameSettings.discardDeck || []), ...drawnCards];
    this._services.saveToLocalStorage('selectedGameSettings', gameSettings);

    console.log('Cartas extraídas:', drawnCards);
    return drawnCards;
  }

  shuffleDeck(): void {
    const gameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings');
    if (!gameSettings || !gameSettings.shuffleDeck) {
      console.error('No se encontraron cartas para barajar.');
      return;
    }
    let currentIndex = gameSettings.shuffleDeck.length;
    let randomIndex, tempValue;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      tempValue = gameSettings.shuffleDeck[currentIndex];
      gameSettings.shuffleDeck[currentIndex] = gameSettings.shuffleDeck[randomIndex];
      gameSettings.shuffleDeck[randomIndex] = tempValue;
    }
    this._services.saveToLocalStorage('selectedGameSettings', gameSettings);
  }

  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
    }
  }

  getDeckState(): { deck: Deck[]; discardDeck: Deck[]; eliminateDeck: Deck[] } {
    const gameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings');
    return {
      deck: gameSettings?.shuffleDeck || [],
      discardDeck: gameSettings?.discardDeck || [],
      eliminateDeck: gameSettings?.eliminateDeck || [],
    };
  }

  resetDeck(): void {
    const gameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings');
    if (!gameSettings) {
      console.error('No se encontraron configuraciones de juego en el localStorage.');
      return;
    }
    if (gameSettings.discardDeck && gameSettings.discardDeck.length > 0) {
      // Barajar las cartas del descarte y añadirlas al mazo
      gameSettings.shuffleDeck = [...gameSettings.discardDeck];
      gameSettings.discardDeck = [];
      // Barajar el mazo
      this.shuffleDeck();
    } else {
      console.error('No hay cartas en el descarte para barajar.');
    }
    this._services.saveToLocalStorage('selectedGameSettings', gameSettings);
  }

  getAspectForSkill(skill: string): string {
    const normalizedSkill = skill.toLowerCase();
    for (const aspect in this._constants.SKILLS_MAP) {
      if (this._constants.SKILLS_MAP[aspect].some(s => s.toLowerCase() === normalizedSkill)) {
        return aspect;
      }
    }
    throw new Error(`Habilidad no encontrada: ${skill}`);
  }

  ensurePath<T>(obj: any, path: (string | number)[], defaultValue: any = {}): T {
    return path.reduce((acc, key, index) => {
      if (!acc[key]) {
        acc[key] = index === path.length - 1 ? defaultValue : {};
      }
      return acc[key];
    }, obj) as T;
  }
}
