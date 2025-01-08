import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Adventurer, Equipment, Partner } from '../../models/adventure.module';
import { ConstantsService } from '../../services/constants.service';
import { CommonsService } from '../../services/commons.service';
import { UserService } from '../../services/user.service';
import { Chronicle, Deck, Enemy, GameSettings } from '../../models/game.module';
import { IaDescriptionService } from '../../services/ia-description.service';
import { FormsModule } from '@angular/forms';
import { Option } from '../../models/commons.module';
import { CanDeactivateGuard } from '../../guards/can-deactivate.guard';
import { ModalService } from '../../services/modal.service';
import { CapitalizeFirstLetterPipe } from '../../pipe/capitalize-first-letter.pipe';

@Component({
  selector: 'app-the-feat',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizeFirstLetterPipe],
  templateUrl: './the-feat.component.html',
  styleUrl: './the-feat.component.scss'
})
export class TheFeatComponent implements OnInit, OnDestroy {
  isChronicle: boolean = false;
  isAdventurer: boolean = false;
  isDifficulty: boolean = false;
  isGameplay: boolean = false; // false
  isLoadingCro: boolean = false;
  isLoadingAdv: boolean = false;
  isLoading: boolean = false;
  urlScene: string = "/assets/images/cover_location_";
  adventurers$: Observable<Adventurer[]> = new Observable();
  chronicles$: Observable<Chronicle[]> = new Observable();
  labelTitle: string = '';
  selectedAdventurer: Adventurer | null = null;
  selectedChronicle: Chronicle | null = null;
  selectedGameSettings: GameSettings | null = null;
  _constants = inject(ConstantsService);
  _services = inject(CommonsService);

  userNeedHelp?: boolean;
  userNeedSounds?: boolean;

  userInput: string = '';
  messages: { role: 'system' | 'user' | 'assistant'; content: string;}[] = [];
  response = signal<string>('');
  isLoadingAI = signal<boolean>(false);
  paragraphs: string[] = [];
  optionsTest: Option[] = [];
  optionsCombatAspects: Option[] = [];
  optionsCombatArmour: Option[] = [];
  optionsCombat: Option[] = [];
  //skillsToTest?: string[] = [];
  visibleParagraphs: string[] = [];
  currentParagraphIndex: number = 0;

  showCards: boolean = false;
  skillValue?: number;
  selectedOption?: Option;
  deckLife: number = 0;

  equipmentTypes: any[] = [];
  specialTypes: any[] = [];
  testAction?: string;
  combatFinish: boolean = false;
  willcardPNJ: Partner[] = [];

  constructor(
    private _modalService: ModalService,
    private _gameService: GameService,
    private _user: UserService,
    private chatGptService: IaDescriptionService
  ){}

  ngOnInit(): void {;
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
    this.initializeSettings();
    this.initializeChronicleAndAdventurers();
    this.checkLoadingStatus();
  }

  private initializeSettings(): void {
    this.deckLife = this.obtainLifeCharacter();
    this.checkForWeaponInBackpack();
    this.isLoading = true;
    const userObject = this._user.getUserObject();
    this.userNeedHelp = userObject?.needHelp ?? true;
    this.userNeedSounds = userObject?.needSounds ?? true;
    this._constants.isHelpChecked = userObject?.needHelp ?? true;
    this._constants.isSoundsChecked = userObject?.needSounds ?? true;
    this.selectedGameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings'); //this.loadFromLocalStorage('selectedGameSettings');
  }

  private initializeChronicleAndAdventurers(): void {
    if (this.selectedGameSettings?.isPlaying) {
      this.selectedAdventurer = this._services.getFromLocalStorage<Adventurer>('selectedAdventurer'); //this.loadFromLocalStorage('selectedAdventurer');
      this.selectedChronicle = this._services.getFromLocalStorage<Chronicle>('selectedChronicle'); // this.loadFromLocalStorage('selectedChronicle');
      this.labelTitle = this._constants.SELECT_PLO;
      this.initialGameplay();
      return;
    }
    this.isChronicle = true;
    this.labelTitle = this._constants.SELECT_CHR;
    this._gameService.clearSelectedItem('all');
    // Solo cargamos los observables si no están ya en localStorage
    if (!this.selectedGameSettings) {
      this.initializeObservables();
    }
  }

  private initializeObservables(): void{
    /*this.chronicles$ = this._gameService.getDatabaseInfoChronicle(3).pipe(
      map(chronicles => {
        const selectedChronicle = this._services.getFromLocalStorage<Chronicle>('selectedChronicle'); // this.loadFromLocalStorage('selectedChronicle');
        if (selectedChronicle) {
          this.selectedChronicle = selectedChronicle;
          return [selectedChronicle, ...chronicles];
        }
        return chronicles;
      })
    );
    this.chronicles$.subscribe(() => {
      this.isLoadingCro = true;
    });
    this.adventurers$ = this._gameService.getDatabaseInfoAdventurers(6).pipe(
      map(adventurers => {
        const selectedAdventurer = this._services.getFromLocalStorage<Adventurer>('selectedAdventurer'); //this.loadFromLocalStorage('selectedAdventurer');
        if (selectedAdventurer) {
          this.selectedAdventurer = selectedAdventurer;
          return [selectedAdventurer, ...adventurers];
        }
        return adventurers;
      })
    );
    this.adventurers$.subscribe(() => {
      this.isLoadingAdv = false;
      this.createElementTypes();
    });*/
    this.chronicles$ = this._gameService.getDatabaseInfoChronicle(3).pipe(
      map(chronicles => this.prependSelectedChronicle(chronicles))
    );
    this.adventurers$ = this._gameService.getDatabaseInfoAdventurers(6).pipe(
      map(adventurers => this.prependSelectedAdventurer(adventurers))
    );
  }

  private prependSelectedChronicle(chronicles: any[]): any[] {
    const selectedChronicle = this._services.getFromLocalStorage<Chronicle>('selectedChronicle');
    if (selectedChronicle) {
      this.selectedChronicle = selectedChronicle;
      return [selectedChronicle, ...chronicles];
    }
    return chronicles;
  }

  private prependSelectedAdventurer(adventurers: any[]): any[] {
    const selectedAdventurer = this._services.getFromLocalStorage<Adventurer>('selectedAdventurer');
    if (selectedAdventurer) {
      this.selectedAdventurer = selectedAdventurer;
      return [selectedAdventurer, ...adventurers];
    }
    return adventurers;
  }

  private checkLoadingStatus(): void {
    if (this.isLoadingCro && this.isLoadingAdv) {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
  }

  sendMessage(): void {
    this.isLoadingAI.set(true);

    this.messages = [];
    this.optionsTest = [];
    this.optionsCombat = [];
    this.paragraphs = [];
    this.visibleParagraphs = [];
    this.currentParagraphIndex = 0;

    this.messages = [
      { role: 'user', content: this.userInput }
    ];
    this.chatGptService.sendMessage(this.messages).then(response => {
      const responseText = response?.choices[0]?.message?.content || 'No hay respuesta';
      this.optionsTest = this.extractOptionsTest(responseText);
      const cleanedText = this.cleanOptionsFromText(responseText, this.optionsTest);
      this.alliesHelpOption();
      this.optionsCombat = this.generateOptionsCombat();
      this.paragraphs = this.splitIntoParagraphs(cleanedText);
      this.visibleParagraphs = [this.paragraphs[0]];
      this.currentParagraphIndex = 1;
      this.response.set(responseText);
    }).catch(error => {
      console.error('Error:', error);
      this.response.set('Hubo un error al obtener la respuesta. Intenta de nuevo.');
    }).finally(() => {
      this.isLoadingAI.set(false);
    });

  }

  alliesHelpOption(): void {
    const newOptions: Option[] = [];
    this.willcardPNJ = [];
    this.optionsTest.forEach(option => {
      const skill = option.skill;
      this.selectedAdventurer?.partners.forEach(partner => {
        const isMatch = partner.skills.some(partnerSkill => partnerSkill.name === skill);

        if (isMatch && partner.wildCard > 0) {
          const helpText = `${option.text} ${partner.name} aprovecha su ${skill} para ayudar a superar la prueba.`;
          const newOption : Option = {
            text: helpText,
            skill: skill,
            aspect: option.aspect,
            value: (option.value - 10) < 0 ? 2 : option.value - 10,
            type: 'Desafío',
            enemy: undefined,
            willcardItem: partner.name,
          };
          if (!newOptions.some(existingOption => existingOption.text === newOption.text)) {
            newOptions.push(newOption);
            this.willcardPNJ.push(partner);
          }
        }
      });
    });
    if (newOptions.length > 0) {
      this.optionsTest.unshift(...newOptions);
    }
    console.log('willcardPNJ ' +JSON.stringify(this.willcardPNJ));
  }

  generateOptionsCombat(): Option[] {
    const options: Option[] = [];
    if(
      this.selectedGameSettings &&
      this.selectedChronicle &&
      this.selectedAdventurer &&
      this.selectedChronicle.acts &&
      this.selectedChronicle.acts[this.selectedGameSettings.actPoints]?.scenes &&
      this.selectedChronicle.acts[this.selectedGameSettings.actPoints].scenes[this.selectedGameSettings.scenePoints]?.event &&
      this.selectedChronicle.acts[this.selectedGameSettings.actPoints].scenes[this.selectedGameSettings.scenePoints].event[this.selectedGameSettings.plotPoints]?.enemy
    ) {
      const enemy = this.selectedChronicle.acts[this.selectedGameSettings.actPoints]
      .scenes[this.selectedGameSettings.scenePoints]
      .event[this.selectedGameSettings.plotPoints]
      .enemy;
      const actPowerLevel = this.selectedGameSettings.actPoints + 1;
      if (enemy != undefined) {
        const powerDif = Math.abs(actPowerLevel - enemy.powerLevel);
        if (enemy.powerLevel < actPowerLevel) {
          let combatPoints = powerDif;
          if (combatPoints === 2) {
            enemy.damage += 1;
            enemy.armor += 1;
          } else if (combatPoints === 1) {
            const randomChoice = Math.random() < 0.5;
            if (randomChoice) {
              enemy.damage += 1;
            } else {
              enemy.armor += 1;
            }
          }
          enemy.combat += powerDif;
          enemy.life += powerDif * 2;
          enemy.experience += powerDif * 5;
        } else if (enemy.powerLevel > actPowerLevel) {
          let combatPoints = powerDif;
          if (combatPoints === 2) {
            enemy.damage -= 1;
            enemy.armor -= 1;
          } else if (combatPoints === 1) {
            const randomChoice = Math.random() < 0.5;
            if (randomChoice) {
              enemy.damage -= 1;
            } else {
              enemy.armor -= 1;
            }
          }
          enemy.combat -= powerDif;
          enemy.life -= powerDif * 2;
          enemy.experience -= powerDif * 5;
        }
      }
      this.enemyCombat = enemy;
      const grimoire = this.selectedAdventurer?.equipment.grimoire ?? [];
      const partners = this.selectedAdventurer.partners ?? [];
      const optionText = `Combatir a ${this.enemyCombat?.name}`;
      const valueCombat = this.enemyCombat?.combat ?? 12;
      options.push({ text: optionText, skill: undefined, aspect: undefined, value: valueCombat, type: 'Enfrentamiento', enemy: this.enemyCombat, willcardItem: undefined });
      if(grimoire.length > 0) {
        grimoire.forEach((item, index) => {
          console.log(`Item ${index + 1}: ${item.name}, Type: ${item.type}, Special: ${item.special?.join(', ') || 'None'}`);
          const optionText = `Atacar con ${item.name}`;
          const valueCombat = this.enemyCombat?.combat ?? 12;
          options.push({ text: optionText, skill: undefined, aspect: undefined, value: valueCombat, type: 'Enfrentamiento', enemy: this.enemyCombat, willcardItem: undefined , special: `grimoire ${index} `});
        });
      }
      if(partners.length > 0){
        partners.forEach((item, index) => {
          console.log('Partners: ' +item.name);
          const optionText = `Ataque de ${item.name}`;
          const valueCombat = Math.max(1, item.damage - (this.enemyCombat?.armor || 0));
          options.push({ text: optionText, skill: undefined, aspect: undefined, value: valueCombat, type: 'Enfrentamiento', enemy: this.enemyCombat, willcardItem: undefined , special: `partners ${index} `});
        })
      }
      /*
      const optionText = `Maniobra de esquiva`;
          const valueManeuver = this.enemyCombat?.aspects.find(aspect => aspect.label.toLocaleLowerCase() === this._constants.ASPECTS_ARRAY[1].toLocaleLowerCase())?.value ?? 5;
          const subterfugeSkills = this._constants.SKILLS_MAP[this._constants.ASPECTS_ARRAY[1].toLocaleLowerCase()];
          const randomSkillSub = subterfugeSkills.slice(0, 3)[Math.floor(Math.random() * 3)];
          options.push({ text: optionText, skill: randomSkillSub, aspect: 'subterfuge', value: valueManeuver*2, type: 'Enfrentamiento', enemy: this.enemyCombat, willcardItem: undefined });
      */
    }
    return options;
  }

  extractOptionsTest(text: string): Option[] {
    const options: Option[] = [];
    const optionRegex = /\*Opción \d+\:\* (.+?)(?=\*Opción|\n|$)/g;
    let match;
    let index = 0;
    while ((match = optionRegex.exec(text)) !== null) {
      const optionText = match[1].trim();
      if(this.selectedChronicle && this.selectedGameSettings){
        const testIndex = this.selectedChronicle.acts?.[this.selectedGameSettings.actPoints]
        ?.scenes?.[this.selectedGameSettings.scenePoints]
        ?.event?.[this.selectedGameSettings.plotPoints]
        ?.tests?.[index];
        if (!testIndex) {
          return options;
        }
        const skill = testIndex?.skill;
        const aspect = testIndex?.aspect;
        const value = testIndex?.value ?? 12;
        options.push({ text: optionText, skill, aspect, value, type: 'Desafío', enemy: undefined, willcardItem: undefined });
      }
      index++;
    }
    return options;
  }

  cleanOptionsFromText(text: string, options: Option[]): string {
    if (!options || options.length === 0) {
      return text;
    }
    options.forEach((option, index) => {
      const optionRegex = new RegExp(`\\*Opción ${index + 1}:\\s*[^\\n]*`, 'g');
      text = text.replace(optionRegex, '').trim();
    });
    return text;
  }

  splitIntoParagraphs(text: string): string[] {
    return text.split('\n').map(paragraph => paragraph.trim()).filter(paragraph => paragraph);
  }


  showNextParagraph() {
    if (this.currentParagraphIndex < this.paragraphs.length) {
      this.visibleParagraphs.push(this.paragraphs[this.currentParagraphIndex]);
      this.currentParagraphIndex++;

      // Desplaza el contenedor hacia abajo para mostrar el nuevo contenido
      setTimeout(() => {
        const container = document.getElementById('text-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100); // Pequeño retraso para garantizar que el nuevo párrafo se haya renderizado.
    }
  }

  onSwitchChange(service: string): void {
    this._user.onSwitchChange(service);
  }

  onItemClickItem() {
    this._services.playClickSoundItem();
  }

  onMouseEnter(event: MouseEvent) {
    this._services.playHoverSound();
  }

  getGenderIcon(gender: string): string {
    return gender.toLowerCase() === 'female'
      ? 'assets/icons/knight.png'
      : 'assets/icons/swordsman.png';
  }

  getSkillIcon(nameInput: string): string {
    return 'assets/icons/' + nameInput.toLowerCase() + '.png';
}

  hasSelectedAdventurer(): boolean {
    return this.selectedAdventurer !== null;
  }

  hasSelectedChronicle(): boolean {
    return this.selectedChronicle !== null;
  }

  hasSelectedDifficulty(): boolean {
    return !!this.selectedGameSettings?.difficulty;
  }

  getPrimaryColor(primary: string){
    return this._gameService.getPrimaryColor(primary);
  }

  isAdventurerSelected(adventurer: Adventurer): boolean {
    return this.selectedAdventurer?.name === adventurer.name;
  }

  goTo(label: string): void {
    this.resetState();
    switch (label) {
      case this._constants.SELECT_CHR:
        this.labelTitle = this._constants.SELECT_CHR;
        this.isChronicle = true;
        this.isAdventurer = false;
        this.isDifficulty = false;
        break;

      case this._constants.SELECT_ADV:
        this.labelTitle = this._constants.SELECT_ADV;
        this.isChronicle = false;
        this.isAdventurer = true;
        this.isDifficulty = false;
        break;

      case this._constants.SELECT_LVL:
        this.labelTitle = this._constants.SELECT_LVL;
        this.isChronicle = false;
        this.isAdventurer = false;
        this.isDifficulty = true;
        //this._gameService.getRandomItemFromSkills();
        /*this.selectedGameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings');
        this.skillsToTest = this.selectedGameSettings?.nextCheckups;
        const skillDescriptions = this.skillsToTest?.map(skill => {
          const skillData = this._constants.SKILL_DESCRIPTION.find(s => s.label === skill);
          return skillData ? `${skill}: ${skillData.description}` : '';
        }).filter(description => description !== '') || [];
        console.log('skillDescriptions > ' + skillDescriptions);*/
        break;

      case this._constants.SELECT_INI:
        this.isChronicle = false;
        this.isAdventurer = false;
        this.isDifficulty = false;
        this.isGameplay = true;
        this.initialGameplay();
        //this._gameService.getRandomItemFromSkills();
        break;

      case this._constants.SELECT_PLO:
        let infoAdv = '';
        let item = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings'); // this.loadFromLocalStorage('selectedGameSettings');
        if (
          item &&
          typeof item.plotPoints === 'number' &&
          this.selectedChronicle &&
          Array.isArray(this.selectedChronicle.acts) &&
          this.selectedChronicle.acts[item.actPoints] &&
          Array.isArray(this.selectedChronicle.acts[item.actPoints].scenes) &&
          this.selectedChronicle.acts[item.actPoints].scenes[item.scenePoints]
        ) {
          const maxPlotPoints = this.selectedChronicle.acts[item.actPoints].scenes[item.scenePoints].plotPoints - 1;
          if (item.plotPoints < maxPlotPoints) {
            item.plotPoints += 1;
            infoAdv = 'Continua una nueva trama de la escena.'
          } else if (item.scenePoints < 2) {
            item.plotPoints = 0;
            item.scenePoints += 1;
            infoAdv = 'Nueva escena: ' +this.selectedChronicle.acts[item.actPoints].scenes[item.scenePoints].description;
          } else if (item.actPoints < 2) {
            item.plotPoints = 0;
            item.scenePoints = 0;
            item.actPoints += 1;
            infoAdv = 'Nuevo acto: ' +this.selectedChronicle.acts[item.actPoints].title+ ': ' +this.selectedChronicle.acts[item.actPoints].subtitle+'. Escena: '+this.selectedChronicle.acts[item.actPoints].scenes[item.scenePoints].description;
          }else {
            console.log('Fin de partida OK');
          }
        } else {
          console.error('No se pudo actualizar plotPoints porque el objeto es nulo o plotPoints no es un número.');
        }
        console.log('this.testAction > ' +this.testAction);
        if (item && Array.isArray(item.prePrompt) && this.selectedOption && this.testAction){
          item.currentResult = infoAdv;
          const prePrompt = this.selectedOption.text + ' Resultado: ' + this.testAction;
          item.prePrompt.push(prePrompt);
        }
        this._services.saveToLocalStorage('selectedGameSettings', item);
        this.selectedGameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings'); // this.loadFromLocalStorage('selectedGameSettings');
        this.initialGameplay();
        this.visibleParagraphs.splice(0, this.visibleParagraphs.length); //Borrado array
        this._gameService.setSelectedItem(item, 'dif');

        break;

      default:
        console.warn('Label no reconocido:', label);
        break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private initialGameplay(): void {
    this.isChronicle = false;
    this.isAdventurer = false;
    this.isDifficulty = false;
    this.isGameplay = true;
    this.showCards = false;
    this.response.set('');
    this.drawnCards = [];
    this.generatePrompt();
    this.sendMessage();
    this.deckLife = this.obtainLifeCharacter();
    this.createElementTypes();
    this.result = '';
    this.testAction = '';
    this.selectedOption = undefined;
    this.resultCombatTurn = '';
    this.extraPerform = '';
  }

  private generatePrompt(): void {
    if (this.selectedGameSettings && this.selectedChronicle && this.selectedAdventurer) {
      this.userInput = this._gameService.generatePrompt(this.selectedGameSettings, this.selectedChronicle, this.selectedAdventurer);
    } else {
      console.error('Faltan valores para generar el prompt:', {
        selectedGameSettings: this.selectedGameSettings,
        selectedChronicle: this.selectedChronicle,
        selectedAdventurer: this.selectedAdventurer
      });
    }
    console.log('Prompt: ' +this.userInput);
  }

  private resetState() {
    this.isChronicle = false;
    this.isAdventurer = false;
    this.isDifficulty = false;
    this.isGameplay = false; //false;
    this.response.set('');
    this.combatFinish = false;
  }

  onClick(item: any | null, flag: string): void {
    this.onItemClickItem();
    if (item != null && flag === 'adv') {
      if (this.selectedAdventurer === item) {
        this.selectedAdventurer = null;
        this._gameService.clearSelectedItem(flag);
        localStorage.removeItem('selectedAdventurer');
      } else {
        this.selectedAdventurer = item;
        this._gameService.setSelectedItem(item, flag);
        this._services.saveToLocalStorage('selectedAdventurer', item);
      }
    }
    if (item != null && flag == 'chr') {
      if (this.selectedChronicle === item) {
        this.selectedChronicle = null;
        this._gameService.clearSelectedItem(flag);
        localStorage.removeItem('selectedChronicle');
      } else {
        this.selectedChronicle = item;
        this._gameService.setSelectedItem(item, flag);
        this._services.saveToLocalStorage('selectedChronicle', item);
      }
    }
    if (item != null && flag == 'dif') {
      if (this.selectedGameSettings?.difficulty === item.name) {
        this.selectedGameSettings = null;
        this._gameService.clearSelectedItem(flag);
        localStorage.removeItem('selectedGameSettings');
      } else {
        this._gameService.initializeGameSettings(item.name, item.value, true);
        this.selectedGameSettings = this._services.getFromLocalStorage<GameSettings>('selectedGameSettings'); //this.loadFromLocalStorage('selectedGameSettings');
      }
    }
  }

  numCardsToDraw: number = this._constants.MINIMUN_NUMBER_CARDS;
  drawnCards: Deck[] = [];
  testCondition: string = 'ninguna'; // puede ser: ventaja, desventaja o ninguna
  statusTest?: string;
  extraPerform?: string;
  resultCombatTurn?: string;

  drawCards(): void {
    this.numCardsToDraw = this._constants.MINIMUN_NUMBER_CARDS;
    if(this.skillValue){
      this.numCardsToDraw += this.skillValue;
    }
    if(this.numCardsToDraw === this._constants.MINIMUN_NUMBER_CARDS && this.testCondition !== 'ninguna'){
      this.numCardsToDraw += 1;
    }else if(this.testCondition === 'ventaja' && this.numCardsToDraw < this._constants.MAXIMUN_NUMBER_CARDS){
      this.numCardsToDraw += 1;
    }
    const drawnCards = this._gameService.drawCards(this.numCardsToDraw);
    this.deckLife = this.obtainLifeCharacter();
    if (drawnCards.length > 0) {
      this.drawnCards = drawnCards;
    } else {
      console.error('No se pudieron extraer cartas.');
    }
  }

  getCardColor(aspect: string): string {
    const aspectInfo = this._constants.INFO_ASPECTS.find(info => {
      return info.label.toLocaleLowerCase() === aspect.toLocaleLowerCase();
    });
    return aspectInfo ? aspectInfo.color : '#CCCCCC';
  }

  getAspectLabel(aspect: string): string {
    const aspectInfo = this._constants.INFO_ASPECTS.find(info => {
      return info.label.toLocaleLowerCase() === aspect.toLocaleLowerCase();
    });
    return aspectInfo ? aspectInfo.label : 'Desconocido';
  }

  // Variables a subir
  aspectTest: string = "";
  levelSkill: number = 0;
  testDifficulty: number = 12;
  skillCharacter: number = 2;
  result: string | null = null;
  resultValue?: number;

  getAspectValue(aspectTest: string): number {
    const aspecto = this.selectedAdventurer?.aspects.find(a => {
      return a.name.toLowerCase() === aspectTest.toLowerCase()
    });
    return aspecto ? aspecto.value : 0; // Devolver 0 si no se encuentra el aspecto
  }

  adjustCardsByAspect(cards: Deck[], aspectTest: string, levelSkill: number): number[] {
    return cards.map(card => {
      if (card.aspect.toLowerCase() === aspectTest.toLowerCase() && card.value < levelSkill) {
        return levelSkill;
      }
      return card.value;
    });
  }

  obtainLifeCharacter(): number{
    return this._gameService.getDeckState().deck.length + this._gameService.getDeckState().discardDeck.length
  }

  removeNextCard(): number {
    let nextCard = null;
    const deckState = this._gameService.getDeckState();
    if(deckState.deck.length > 0){
      nextCard = deckState.deck.shift();
    }else if(deckState.deck.length == 0 && deckState.discardDeck.length > 0){
      nextCard = deckState.discardDeck.shift();
    }else{
      console.log('No hay cartas que eliminar, fin de la partida');
    }
    if (nextCard) {
      deckState.eliminateDeck.push(nextCard);
    }
    const updatedSettings = {
      ...this.selectedGameSettings,
      shuffleDeck: deckState.deck,
      discardDeck: deckState.discardDeck,
      eliminateDeck: deckState.eliminateDeck,
    };
    this._services.saveToLocalStorage('selectedGameSettings', updatedSettings);
    this.deckLife = this.obtainLifeCharacter();
    console.log('Carta eliminada:', nextCard);
    return nextCard?.value || 0;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  flipCardsSequentially() {
    this.drawnCards.forEach((card, index) => {
      setTimeout(() => {
        card.isFlipped = true;
      }, index * 100);
    });
  }

  onOptionClick(option: Option): void {
    this.selectedOption = option;
    this.showCards = true;
    console.log('Dificultad test: ' +option.value);
    console.log('Habilidad: ' +option.skill);
    console.log('Aspecto: ' +option.aspect);
    if(option.aspect && option.skill && this.selectedAdventurer){
      this.skillValue = this._gameService.getSkillValueByAspect(option.aspect, option.skill, this.selectedAdventurer);
      console.log('skillValue: ' +this.skillValue);
    }
    if(
      this.selectedGameSettings &&
      this.selectedChronicle &&
      this.selectedChronicle.acts &&
      this.selectedChronicle.acts[this.selectedGameSettings.actPoints]?.scenes &&
      this.selectedChronicle.acts[this.selectedGameSettings.actPoints].scenes[this.selectedGameSettings.scenePoints]?.event &&
      this.selectedChronicle.acts[this.selectedGameSettings.actPoints].scenes[this.selectedGameSettings.scenePoints].event[this.selectedGameSettings.plotPoints]?.enemy
    ) {
      const enemy = this.selectedChronicle.acts[this.selectedGameSettings.actPoints]
      .scenes[this.selectedGameSettings.scenePoints]
      .event[this.selectedGameSettings.plotPoints]
      .enemy;
      this.enemyCombat = JSON.parse(JSON.stringify(enemy));
    }
  }

  performTest(aspect: string, bonus: number, willcardItem: string): void {
    const malus = this.selectedGameSettings?.actPoints ? this.selectedGameSettings.actPoints : 0;
    const sumBonus = bonus - malus;
    this.levelSkill = this.getAspectValue(aspect);
    let valoresAjustados: number[];
    let criticalValuesFailure = [3,2,1];
    let criticalValuesSuccess = [8,9,10];
    if(this.skillValue != null && this.selectedOption && this.selectedGameSettings){
      const valueTest = this.selectedOption.value + this.selectedGameSettings.difficultyValue;
      this.drawCards();
      const selectedPartner = this.selectedAdventurer?.partners.find(partner => partner.name === willcardItem);
      if (selectedPartner) {
        selectedPartner.wildCard = Math.max(0, selectedPartner.wildCard - 1);
        this._services.saveToLocalStorage('selectedAdventurer', this.selectedAdventurer);
        this.selectedAdventurer = this._services.getFromLocalStorage<Adventurer>('selectedAdventurer');
      }
      // VENTAJA-DESVENTAJA
      const newDeck = [...this.drawnCards];
      if(this.testCondition != 'ninguna' && this.testCondition != null){
        this.statusTest = `Modificaciones de la tirada: ${this.testCondition}`
        if(this.testCondition == 'desventaja') {
          const maxValue = Math.max(...newDeck.map(card => card.value));
          const indexToRemove = newDeck.findIndex(card => card.value === maxValue);
          const valueToRemove = maxValue;
          if (indexToRemove !== -1) {
            newDeck.splice(indexToRemove, 1);
          }
          this.statusTest = this.statusTest + ` (valor eliminado: ${valueToRemove})`;
        }
      }
      const naturalValues = newDeck.map(card => card.value).sort((a, b) => b - a);
      valoresAjustados = this.adjustCardsByAspect(newDeck, aspect, this.levelSkill);
      const valoresOrdenados = valoresAjustados.sort((a, b) => b - a);
      const valoresSeleccionados = valoresOrdenados.slice(0, 2);
      const suma = valoresSeleccionados.reduce((acc, valor) => acc + valor, 0) + sumBonus;
      this.resultValue = suma - valueTest;
      if(bonus > 0 || malus > 0){
        this.extraPerform = `Valor estra de ${sumBonus}. Bonus de +${bonus} y malus de -${malus}`;
      }
      if (suma > valueTest || (naturalValues[0] === naturalValues[1] && naturalValues[0] == 10)) {
        if ( (naturalValues[0] === naturalValues[1] && criticalValuesSuccess.includes(naturalValues[0])) || (naturalValues[0] === naturalValues[1] && naturalValues[0] == 10) ){
          this.testAction = 'Éxito crítico';
        } else {
          this.testAction = 'Éxito';
        }
        this.result = `El valor ${suma} es superior a la dificultad ${valueTest}: +${this.resultValue} - ${this.testAction}`;
      } else if(suma == valueTest){
        this.testAction = 'Éxito comprometido';
        this.result = `El valor ${suma} es igual a la dificultad ${valueTest} - ${this.testAction}`;
      } else if (suma < valueTest || (naturalValues[0] === naturalValues[1] && naturalValues[0] == 1)){
        if ( (naturalValues[0] === naturalValues[1] && criticalValuesFailure.includes(naturalValues[0])) || (naturalValues[0] === naturalValues[1] && naturalValues[0] == 1)){
          this.testAction = 'Fallo crítico';
        } else {
          this.testAction = 'Fallo';
        }
        this.result = `El valor ${suma} es menor a la dificultad ${valueTest}: ${this.resultValue} - ${this.testAction}`;
      }
    }
  }

  enemyCombat?: Enemy;
  performCombat(aspect: string, bonus: number): void {
    this.performTest(aspect, bonus, '');
    let totalDamage = 0;
    let receivedDamage = 0;
    let count = 0;
    let extraExp = 0;
    if(this.selectedAdventurer && this.enemyCombat){
      switch (this.testAction) {
        case 'Éxito crítico':
          console.log('Éxito crítico');
          totalDamage = (this.resultValue ?? 0) + this.getAspectValue('vigor') + this.selectedAdventurer.damage*2;
          extraExp += 1 * this.enemyCombat.powerLevel;
          break;
        case 'Éxito':
          console.log('Éxito');
          totalDamage = (this.resultValue ?? 0) + this.selectedAdventurer.damage - this.enemyCombat.armor;
          totalDamage = totalDamage < this.selectedAdventurer.damage ? this.selectedAdventurer.damage: totalDamage;
          break;
        case 'Éxito comprometido':
          console.log('Éxito comprometido');
          totalDamage = this.selectedAdventurer.damage;
          receivedDamage = this.enemyCombat.damage;
          break;
        case 'Fallo':
          console.log('Fallo');
          receivedDamage = Math.abs((this.resultValue ?? 0)) + this.enemyCombat.damage - this.selectedAdventurer.armor;
          receivedDamage = receivedDamage < this.enemyCombat.damage ? this.enemyCombat.damage : receivedDamage;
          break;
        case 'Fallo crítico':
          console.log('Fallo crítico');
          receivedDamage = Math.abs((this.resultValue ?? 0)) + this.enemyCombat.damage*2;
          break;
      }
      console.log('Resultado combate: Daño realizado es ' +totalDamage+ ', mientras que el daño recibido es ' +receivedDamage);
      if(receivedDamage) {
        let damageLost = receivedDamage;
        count = 0;
        while(damageLost > 0){
          damageLost = damageLost - this.removeNextCard();
          count++;
        }
      }
      this.resultCombatTurn = `Resultado del asalto: daño realizado total de <strong>${totalDamage}</strong>, mientras que el daño recibido es de <strong>${receivedDamage}</strong> (has perdido ${count}pv).`;
      if(totalDamage > 0) {
        if (this.enemyCombat && typeof this.enemyCombat.life === 'number' && this.enemyCombat.life > 0 && totalDamage > 0) {
          this.enemyCombat.life -= totalDamage;
          const totalExp = this.enemyCombat.experience + extraExp;
          if(this.enemyCombat.life <= 0){
            const cointLoot = this._services.getRandomNumber(3,9)*this.enemyCombat.powerLevel;
            this.resultCombatTurn = this.resultCombatTurn + `<br>Enemigo eliminado, has obtenido <strong>${totalExp}px</strong> y <strong>${cointLoot} monedas</strong>.`
            if (this.selectedAdventurer){
              this.selectedAdventurer.coins = this.selectedAdventurer.coins + cointLoot;
              this.selectedAdventurer.experience = this.selectedAdventurer.experience + totalExp;
              this._services.saveToLocalStorage('selectedAdventurer', this.selectedAdventurer);
              this.selectedAdventurer = this._services.getFromLocalStorage<Adventurer>('selectedAdventurer'); //this.loadFromLocalStorage('selectedAdventurer');
            }
            this.combatFinish = true;
          }
        }
      }
    }
  }

  handleAttackClick(option: Option): void {
    console.log('OPTION: ' +JSON.stringify(option));
    if(this.selectedAdventurer?.equipment.weapons){
      const weapon = this.selectedAdventurer?.equipment.weapons[0];
      this.skillValue = this._gameService.getSkillValueByAspect(weapon.aspectName, weapon.skillName, this.selectedAdventurer);
    }
    this.selectedOption = option;
    if(option.special && option.special.includes('partner') && this.enemyCombat){
      this.extraPerform = '';
      const partnerIndex = option.special.split(' ')[1];
      const selectedPartner = this.selectedAdventurer?.partners[parseInt(partnerIndex)];
      console.log('ENEMIGO ATAQUE: ' +this.enemyCombat.damage+ ' - DEFENSA: ' +this.enemyCombat.armor+ ' - VIDA: ' +this.enemyCombat.life);
      console.log('PNJ ATAQUE: ' +selectedPartner?.damage+ ' - DEFENSA: ' +selectedPartner?.armor+ ' - VIDA: ' +selectedPartner?.life)
      const pnjAttack = Math.max((selectedPartner?.damage ?? 1) - this.enemyCombat.armor, 1);
      const enemyAttack = Math.max(this.enemyCombat.damage - (selectedPartner?.armor ?? 0), 1);
      console.log('ENEMIGO RECIBE ' +pnjAttack);
      console.log('PNJ RECIBE ' +enemyAttack);
      this.enemyCombat.life -= pnjAttack;

      this.result = `Asalto de cambate entre ${selectedPartner?.name} y ${this.enemyCombat.name}`;
      this.resultCombatTurn = `El enemigo recibe <strong style="color: green;">${pnjAttack}</strong> puntos de daño, el aliado recibe <strong style="color: red;">${enemyAttack}</strong> puntos de daño.`;
      if (selectedPartner?.life !== undefined) {
        selectedPartner.life -= enemyAttack;
        this.resultCombatTurn += `<br>La vida actual del enemigo es ${this.enemyCombat.life}, mientras que la del aliado es ${selectedPartner.life}`;
        this._services.saveToLocalStorage('selectedAdventurer', this.selectedAdventurer);
        this.selectedAdventurer = this._services.getFromLocalStorage<Adventurer>('selectedAdventurer');
        if(selectedPartner.life <= 0 && this.selectedAdventurer) {
          this.resultCombatTurn += `<br>El aliado ${selectedPartner?.name} ha sido derrotado.`;
          const partnerIndexNum = parseInt(partnerIndex); // Convertir a número
          if (!isNaN(partnerIndexNum) && partnerIndexNum >= 0 && partnerIndexNum < this.selectedAdventurer.partners.length) {
            this.selectedAdventurer.partners.splice(partnerIndexNum, 1); // Eliminar el aliado
          }
          this._services.saveToLocalStorage('selectedAdventurer', this.selectedAdventurer);
          this.selectedAdventurer = this._services.getFromLocalStorage<Adventurer>('selectedAdventurer');
          const optionIndex = this.optionsCombat.findIndex(opt => opt === option);
          if (optionIndex !== -1) {
            this.optionsCombat.splice(optionIndex, 1);
          }
        }
      }
      if(this.enemyCombat.life <= 0){
        this.resultCombatTurn += `<br>El enemigo ${this.enemyCombat.name} ha sido derrotado.`;
        this.combatFinish = true;
      }
      if (selectedPartner) {
        selectedPartner.life = Math.max(0, selectedPartner.wildCard - 1);
        this._services.saveToLocalStorage('selectedAdventurer', this.selectedAdventurer);
        this.selectedAdventurer = this._services.getFromLocalStorage<Adventurer>('selectedAdventurer');
      }
    } else {
      this.performCombat(
        this.selectedAdventurer?.equipment?.weapons?.[0]?.aspectName || '',
        this.selectedAdventurer?.equipment?.weapons?.[0]?.bonus || 0
      );
    }
  }


  // ESCAPE DE PANTALLA
  isDataSaved: boolean = false; // Cambia esto dependiendo de si los datos están guardados
  confirmNavigation: boolean = false;
  private handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    event.preventDefault();
    this._modalService.confirm('¿Seguro que quieres salir? Perderás el progreso de tu partida.')
      .then((confirmed) => {
        if (!confirmed) {
          event.preventDefault();
        }
      });
  };

  canDeactivate(): Promise<boolean> {
    if (!this.isDataSaved) {
      return this._modalService.confirm('¿Seguro que quieres salir? Perderás el progreso de tu partida.');
    }
    return Promise.resolve(true);
  }

  getStatusClass(): string {
    switch (this.selectedAdventurer?.status) {
      case 'envenenado':
        return 'status-poisoned';
      case 'aturdido':
        return 'status-stunned';
      case 'inspirado':
        return 'status-inspired';
      case 'desangrado':
        return 'status-bled';
      case 'maldecido':
        return 'status-cursed';
      default:
        return 'status-default';
    }
  }

  hasWeaponSingleInBackpack: boolean = false;
  hasWeaponDoubleInBackpack: boolean = false;
  hasWeaponSecundaryInBackpack: boolean = false;
  hasArmorBodyInBackpack: boolean = false;
  hasArmorHemletInBackpack: boolean = false;
  hasArmorShieldInBackpack: boolean = false;
  hasArmorBeltInBackpack: boolean = false;
  hasClothingInBackpack: boolean = false;

  checkForWeaponInBackpack(): void {
    if(this.selectedAdventurer?.equipment?.backpack) {
      this.hasWeaponSingleInBackpack = this.selectedAdventurer.equipment.backpack.some(item => item.type === 'Arma' && item.subtype === 'A mano') ? true : false;
      this.hasWeaponDoubleInBackpack = this.selectedAdventurer.equipment.backpack.some(item => item.type === 'Arma' && item.subtype === 'A 2 manos') ? true : false;
      this.hasWeaponSecundaryInBackpack = this.selectedAdventurer.equipment.backpack.some(item => item.type === 'Arma' && item.subtype === 'Arma seundaria') ? true : false;
      this.hasArmorBodyInBackpack = this.selectedAdventurer.equipment.backpack.some(item => item.type === 'Armadura' && item.subtype === 'Cuerpo') ? true : false;
      this.hasArmorHemletInBackpack = this.selectedAdventurer.equipment.backpack.some(item => item.type === 'Armadura' && item.subtype === 'Casco') ? true : false;
      this.hasArmorShieldInBackpack = this.selectedAdventurer.equipment.backpack.some(item => item.type === 'Armadura' && item.subtype === 'Escudo') ? true : false;
      this.hasArmorBeltInBackpack = this.selectedAdventurer.equipment.backpack.some(item => item.type === 'Armadura' && item.subtype === 'Cinturón') ? true : false;
      this.hasClothingInBackpack = this.selectedAdventurer.equipment.backpack.some(item => item.type === 'Vestimenta') ? true : false;
    }
  }

  //PLANTILLA PARA MOSTRAR EQUIPO
  createElementTypes(): void {
    if (this.selectedAdventurer) {
      this.equipmentTypes = [
        {
          title: 'Consumibles',
          targetId: 'collapseConsumables',
          isExpanded: false,
          items: this.selectedAdventurer.equipment.consumables,
          actionText: 'Utilizar',
          noItemsText: 'Consumibles',
          action: 'consumables'
        },
        {
          title: 'Pertrechos',
          targetId: 'collapseTrinkets',
          isExpanded: false,
          items: this.selectedAdventurer.equipment.trinkets,
          actionText: 'Retirar',
          noItemsText: 'Pertrechos',
          action: 'trinkets'
        },
        {
          title: 'Armas',
          targetId: 'collapseWeapons',
          isExpanded: false,
          items: this.selectedAdventurer.equipment.weapons,
          actionText: 'Sustituir',
          noItemsText: 'Armas',
          action: 'weapons'
        },
        {
          title: 'Armaduras',
          targetId: 'collapseArmor',
          isExpanded: false,
          items: this.selectedAdventurer.equipment.armor,
          actionText: 'Sustituir',
          noItemsText: 'Armaduras',
          action: 'armor'
        },
        {
          title: 'Vestimenta',
          targetId: 'collapseClothing',
          isExpanded: false,
          items: this.selectedAdventurer.equipment.clothing ? [this.selectedAdventurer.equipment.clothing] : [],
          actionText: 'Sustituir',
          noItemsText: 'Vestimentas',
          action: 'clothing'
        },
        {
          title: 'Mochila',
          targetId: 'collapseBackpack',
          isExpanded: false,
          items: this.selectedAdventurer.equipment.backpack,
          actionText: 'Equipar',
          noItemsText: 'Elementos en la mochila',
          action: 'backpack'
        }
      ];
      this.specialTypes = [
        {
          title: 'Grimorio',
          targetId: 'collapseGrimoire',
          isExpanded: false,
          items: this.selectedAdventurer.equipment.grimoire,
          actionText: 'Equipar',
          noItemsText: 'Grimorio',
          action: 'grimoire'
        }
      ]
    } else {
      this.equipmentTypes = [];
      this.specialTypes = [];
    }
  }

  toggleCollapse(element: any): void {
    element.isExpanded = !element.isExpanded;
  }

  replaceEquipment(type: keyof Equipment): void {
    const equipmentToReplace = this.selectedAdventurer?.equipment[type];
    const backpack = this.selectedAdventurer?.equipment.backpack;
    if (Array.isArray(equipmentToReplace)) {
      for (const item of equipmentToReplace) {
        const equipmentInBackpack = backpack?.find(backpackItem =>
          backpackItem.type === item.type || backpackItem.subtype === item.subtype
        );

        if (!equipmentInBackpack) {
          this.showNoBackupEquipmentModal();
          return;
        }
      }
      console.log('Sustituyendo equipo...');
    } else if (equipmentToReplace) {
      // Si equipmentToReplace es un solo item, verificamos directamente
      const equipmentInBackpack = backpack?.find(item =>
        item.type === equipmentToReplace.type || item.subtype === equipmentToReplace.subtype
      );

      if (!equipmentInBackpack) {
        this.showNoBackupEquipmentModal();
      } else {
        console.log('Sustituyendo equipo...');
      }
    }
  }

  showNoBackupEquipmentModal(): void {
    this._modalService.open({
      title: 'No hay equipo de reserva',
      message: 'No hay elementos en la mochila que puedan sustituir este equipo.',
      buttons: [{ label: 'Cerrar', action: () => this._modalService.close() }]
    });
  }

  translateAspect(aspect: string): string {
    return this._constants.ASPECT_TO_KEY_MAP[aspect] || aspect;
  }

}


