import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  colorGold: string = '#DAA520';
  colorDarkRed: string = '#8B0000';
  catacombs: string = 'catacombs';
  chronicles: string = 'chronicles';
  forging: string = 'forging';
  codex: string = 'codex';
  home: string = 'home';
  oracle: string = 'oracle';
  adventure: string = 'adventure';
  saga: string = 'saga';

  isHelpChecked: boolean = true;
  isSoundsChecked: boolean = true;

  //HERMIT
  tooltipsHermitDialogue0: string = 'En la penumbra del camino emerge una figura encorvada y cubierta por una capa raída: <i>"Bienvenido, aventurero. He estado observando vuestros pasos desde las sombras. Mi nombre no importa; aquí me conocen como el <strong>Ermitaño</strong>. Seré vuestro <strong>guía</strong> en esta travesía. A cada paso, os susurraré los secretos de lo que podéis o no podéis hacer. No temáis acercaros, pues estoy aquí para ayudaros a cumplir los designios de los dioses. Aunque la senda esté envuelta en misterio, mi consejo os alumbrará en la oscuridad"</i>';
  tooltipsHermitDialogue1: string = '<strong>El Ermitaño</strong> te mira con ojos sabios y, con una leve sonrisa en el rostro, te dice: <i>"¿Ves algo que te intriga, joven aventurero? Pregúntame lo que desees sobre lo que tienes ante tus ojos, y con gusto te responderé. Nada de lo que ves es un misterio para mí, y todo tiene su razón de ser. No dudes en preguntar."</i>';
  tooltipsHermitDialogue2: string = '<i>"Bienvenidos, viajeros. He estado observando vuestros pasos desde las sombras. Mi nombre no importa; aquí me conocen como el <strong>Ermitaño</strong> o el Encapuchado"</i>';
  tooltipsHermitDialogue3: string = '<i>"He recorrido senderos olvidados y escuchado los susurros de leyendas que se ocultan en la penumbra de este mundo. Aquí, esperanza y temor se entrelazan en una danza eterna, y cada <strong>elección</strong> puede abrir puertas hacia lo desconocido o sellar caminos para siempre."</i>';
  tooltipsHermitDialogue4: string = '<i>"Seré vuestro <strong>guía</strong> en esta travesía. A cada paso, os susurraré los secretos de lo que podéis o no podéis hacer. No temáis acercaros, pues estoy aquí para ayudaros a cumplir los designios de los dioses. Aunque la senda esté envuelta en misterio, mi consejo os alumbrará en la oscuridad"</i>';


  //MENU INFO LINKS
  menuItemsCatacombs = [
    { label: 'Personajes', link: 'characters', description: '<strong>PERSONAJES</strong>: Explora las historias del pasado y desentraña los misterios. Empieza a jugar una partida.' },
    { label: 'Equipo', link: 'equipment', description: '<strong>EQUIPO</strong>: Descubre los secretos de la creación y el poder de la transformación. Puedes crear contenidos custom para el juego.' },
    { label: 'Armería', link: 'armory', description: '<strong>ARMERÍA</strong>: Adéntrate en las profundidades y enfréntate a tus miedos. Puedes ver los contenidos del juego.' },
    { label: 'Reliquias', link: 'relics', description: '<strong>RELIQUIAS</strong>: Es el conocimiento arcano. Puedes consultar el manual de juego.' },
    { label: 'Grimorio', link: 'grimoire', description: '<strong>GRIMORIO</strong>: Explora las historias del pasado y desentraña los misterios. Empieza a jugar una partida.' },
    { label: 'Bestiario', link: 'bestiary', description: '<strong>BESTIARIO</strong>: Descubre los secretos de la creación y el poder de la transformación. Puedes crear contenidos custom para el juego.' },
    { label: 'Hazañas', link: 'feats', description: '<strong>HAZAÑAS</strong>: Adéntrate en las profundidades y enfréntate a tus miedos. Puedes ver los contenidos del juego.' },
    { label: 'Sagas', link: 'saga', description: '<strong>SAGAS</strong>: Es el conocimiento arcano. Puedes consultar el manual de juego.' },
    { label: 'Cónclave', link: 'conclave', description: '<strong>CÓNCLAVE</strong>: Es el conocimiento arcano. Puedes consultar el manual de juego.', role: true }
  ];

  menuItemsHome = [
    { label: 'Crónicas', link: 'chronicles', description: '<strong>CRÓNICAS</strong>: Explora las historias del pasado y desentraña los misterios. Empieza a <span class="highlight-text">jugar</span> una partida.' },
    { label: 'Forja', link: 'forging', description: '<strong>FORJA</strong>: Descubre los secretos de la creación y el poder de la transformación. Puedes <span class="highlight-text">crear contenidos</span> custom para el juego.' },
    { label: 'Catacumbas', link: 'catacombs', description: '<strong>CATACUMBAS</strong>: Adéntrate en las profundidades y enfréntate a tus miedos. Puedes <span class="highlight-text">ver los contenidos</span> del juego.' },
    { label: 'Códice', link: 'codex', description: '<strong>CÓDICE</strong>: Es el conocimiento arcano. Puedes consultar el <span class="highlight-text">manual de juego</span>.' },
    { label: 'Oráculo', link: 'oracle', description: '<strong>ORÁCULO</strong>: Te daré respuestas en las visiones y profecías del Oráculo. Te mantenemos informado con las <span class="highlight-text">novedades</span>.' },
    //{ label: 'El Aventurero', link: 'adventure', description: '<strong>EL JURAMENTO</strong>: Realiza un pacto sagrado que te vinculará a esta aventura. Crea una cuenta de usuario y accede a más funciones.' },
  ];

  menuItemsChronicles1 = [
    { label: 'Jugar Capítulo', link: 'theFeat', description: '<strong>HAZAÑA</strong>: Explora las historias del pasado y desentraña los misterios. Empieza a jugar una partida.' },
    { label: 'Invocar Hazaña', link: 'summonFeat', description: '<strong>INVOCAR HAZAÑA</strong>: Adéntrate en las profundidades y enfréntate a tus miedos. Puedes ver los contenidos del juego.' },
  ];

  menuItemsChronicles2 = [
    { label: 'Jugar Acto', link: 'theSaga', description: '<strong>SAGA</strong>: Descubre los secretos de la creación y el poder de la transformación. Puedes crear contenidos custom para el juego.' },
    { label: 'Invocar Saga', link: 'summonSaga', description: '<strong>INVOCAR SAGA</strong>: Es el conocimiento arcano. Puedes consultar el manual de juego.' },
  ];

  menuItemsForging = [
    { label: 'Personajes', link: 'characters', description: '<strong>PERSONAJES</strong>: Explora las historias del pasado y desentraña los misterios. Empieza a jugar una partida.' },
    { label: 'Equipo', link: 'equipment', description: '<strong>EQUIPO</strong>: Descubre los secretos de la creación y el poder de la transformación. Puedes crear contenidos custom para el juego.' },
    { label: 'Armería', link: 'armory', description: '<strong>ARMERÍA</strong>: Adéntrate en las profundidades y enfréntate a tus miedos. Puedes ver los contenidos del juego.' },
    { label: 'Reliquias', link: 'relics', description: '<strong>RELIQUIAS</strong>: Es el conocimiento arcano. Puedes consultar el manual de juego.' },
    { label: 'Grimorio', link: 'grimoire', description: '<strong>GRIMORIO</strong>: Explora las historias del pasado y desentraña los misterios. Empieza a jugar una partida.' },
    { label: 'Bestiario', link: 'bestiary', description: '<strong>BESTIARIO</strong>: Descubre los secretos de la creación y el poder de la transformación. Puedes crear contenidos custom para el juego.' },
    { label: 'Hazañas', link: 'feats', description: '<strong>HAZAÑAS</strong>: Adéntrate en las profundidades y enfréntate a tus miedos. Puedes ver los contenidos del juego.' },
    { label: 'Sagas', link: 'saga', description: '<strong>SAGAS</strong>: Es el conocimiento arcano. Puedes consultar el manual de juego.' },
  ];

  menuItemsGrimoire = [];

  menuItemsOracle = [];

  FIRST_NAME_MALE = [
    'Alaric', 'Thrain', 'Ragnar', 'Borak', 'Eirik', 'Magnus', 'Hakon', 'Leif', 'Viktor', 'Dorian',
    'Baldur', 'Klaus', 'Jorund', 'Gunnar', 'Hemming', 'Bjorn', 'Freyr', 'Stefan', 'Tomas', 'Valdemar',
    'Aksel', 'Otto', 'Sven', 'Eldar', 'Odin', 'Vegar', 'Sigurd', 'Loki', 'Vegar', 'Knud',
    'Skadi', 'Lennart', 'Ingemar', 'Rolf', 'Dag', 'Knut', 'Einar', 'Asgeir', 'Torsten', 'Jarl',
    'Arvid', 'Ulric', 'Viggo', 'Runar', 'Torbjorn', 'Haldor', 'Vidar', 'Ulf', 'Sindre', 'Harald'
  ];

  FIRST_NAME_FEMALE = [
    'Astrid', 'Freya', 'Isolde', 'Eira', 'Selene', 'Runa', 'Ingrid', 'Lena', 'Thora', 'Helga',
    'Solveig', 'Yrsa', 'Astra', 'Hilda', 'Vera', 'Tora', 'Alva', 'Liv', 'Sigrid', 'Karin',
    'Alfhild', 'Dagmar', 'Gunhild', 'Eivor', 'Hedda', 'Ylva', 'Astrid', 'Maja', 'Greta', 'Kerstin',
    'Edel', 'Kari', 'Ragnhild', 'Asta', 'Bodil', 'Helle', 'Sanne', 'Maren', 'Siv', 'Elin',
    'Mira', 'Asta', 'Ingmar', 'Vigdis', 'Hulda', 'Thyra', 'Ragnilda', 'Britt', 'Karin'
  ];

  LASTNAMES = [
    'Hawk', 'Stone', 'Ironfoot', 'Thorn', 'Wolf', 'Shadow', 'Frost', 'Grim', 'Storm', 'Ash',
    'Nightfall', 'Bloodthorn', 'Windrider', 'Lightfoot', 'Firestone', 'Blackwood', 'Moonshadow',
    'Ironbark', 'Oakshield', 'Goldleaf', 'Redfern', 'Dawnbringer', 'Stoneheart', 'Silverbrook',
    'Starcrest', 'Darkmoon', 'Silverwind', 'Wildhorn', 'Dewfall', 'Winterwind', 'Sunstone', 'Stormwatch',
    'Greywolf', 'Ironclad', 'Ravenwood', 'Deepwater', 'Brightblade', 'Frostwolf', 'Windwalker',
    'Firebloom', 'Ashenbrook', 'Wolfhart', 'Lightbloom', 'Shadowsun', 'Sundew', 'Snowblood', 'Wolfsbane',
    'Goldbloom', 'Nightshade', 'Flamewaker', 'Riverstone', 'Braveheart', 'Moonstone'
  ];

  NICKNAMES_MALE = [
    'el Temerario', 'el Fuerte', 'el Invencible', 'el Veloz', 'el Errante', 'el Sabio', 'el Cazador',
    'el Vengador', 'el Imparable', 'el Solitario', 'el Lobo', 'el Inquebrantable', 'el Justiciero',
    'el Oscuro', 'el Guerrillero', 'el Caballero', 'el Rebelde', 'el Valiente', 'el Cazador de Sombras',
    'el Maestre', 'el Irrompible', 'el Rencoroso', 'el Luchador', 'el Ágil', 'el Vidente', 'el Guardián',
    'el Corazón de Hierro', 'el Héroe', 'Escudo de Hierro', 'el Destructor', 'el Lince',
    'el Rayo', 'el Rastreador', 'el Águila', 'el Sol', 'el Furioso', 'el Imparable', 'el Líder',
    'el Perseguidor', 'el Rey de la Guerra', 'Viento del Norte', 'el Serpiente', 'Cazador de Dragones',
    'el Centurión', 'el Imbatible', 'el Santo', 'el Hijo del Trueno', 'el Guerrero Eterno', 'el Cazador Nocturno'
  ];

  NICKNAMES_FEMALE = [
    'la Valiente', 'la Inquebrantable', 'la Serpiente', 'la Luminosa', 'la Sombra', 'la Guerrera',
    'la Cazadora', 'la Vidente', 'la Imparable', 'la Sombra de Noche', 'la Guerrillera', 'la Ágil',
    'la Tigresa', 'la Hija del Viento', 'la Valkiria', 'la Temeraria', 'la Dama de Hierro', 'la Sabia',
    'la Cazadora de Sombras', 'la Rebelde', 'la Vengadora', 'Maestra de las Sombras', 'la Loba',
    'la Tigresa Negra', 'la Rastrojera', 'la Luminosa Guerrera', 'la Valquiria', 'la Hechicera',
    'la Reina de la Guerra', 'la Cóndor', 'la Dama de la Noche', 'la Fierce', 'la Furia', 'Princesa Guerrera',
    'la Inmortal', 'la Rápida', 'la Ciega', 'la Dama de Fuego', 'la Luz de la Esperanza', 'la Llama Eterna',
    'Reina del Acantilado', 'la Dama del Viento', 'Señora de la Noche', 'Doncella de Acero', 'Cazadora de Vientos',
    'la Fénix', 'la Escarlata', 'la Furiosa', 'la Guerrera Escarlata', 'la Sabia del Bosque'
  ];

  DIFFICULTY_LVL = [
    { name: 'veryEasy', label: 'Muy fácil', value: -2},
    { name: 'easy', label: 'Fácil', value: -1},
    { name: 'medium', label: 'Normal', value: 0},
    { name: 'hard', label: 'Difícil', value: 1},
    { name: 'veryHard', label: 'Muy difícil', value: 2},
  ];

  INFO_ASPECTS = [
    { aspect: 'vigor', color: '#2C6B2F', label: 'Vigor', sum: 'VIG', description: 'Fuerza física y resistencia.',},
    { aspect: 'subterfuge', color: '#5A3D66', label: 'Subterfugio', sum: 'SUB', description: 'Habilidad para el engaño y el sigilo.'},
    { aspect: 'wisdom', color: '#1D6E8C', label: 'Sabiduria', sum: 'SAB', description: 'Conocimiento y percepción.'},
    { aspect: 'cunning', color: '#E26A2C', label: 'Astucia', sum: 'AST', description: 'Habilidad para liderar y manipular.'},
  ];

  ASPECTS_ARRAY = ['vigor', 'subterfugio', 'sabiduria', 'astucia'];

  ASPECT_TO_KEY_MAP: { [key: string]: string } = {
    'vigor': 'vigor',
    'subterfuge': 'subterfugio',
    'wisdom': 'sabiduria',
    'cunning': 'astucia',
  };

  MINIMUN_NUMBER_CARDS = 2;
  MAXIMUN_NUMBER_CARDS = 7;

  SKILL_COST =
    {
      principalSkill: [1,3,5,7,10],
      secondarySkill: [2,4,6,9,12],
      otherSkill: [3,6,9,12,15]
    };

  SKILLS_MAP: { [key: string]: string[] } = {
    vigor: ['Resistencia', 'Acrobacias', 'Atletismo', 'Contundentes', 'A dos manos', 'Armas largas'],
    subterfugio: ['Sigilo', 'Juego de manos', 'Ocultar', 'Filo', 'Certeza', 'Ligereza'],
    sabiduria: ['Percepción', 'Concentración', 'Supervivencia', 'Deducción', 'Medicina', 'Arcano'],
    astucia: ['Intimidar', 'Intuición', 'Alerta', 'Entereza', 'Persuadir', 'Liderazgo'],
  };

  SKILL_DESCRIPTION = [
    {label: 'Resistencia', description: 'Habilidad para soportar condiciones extremas, como frío, calor o fatiga prolongada'},
    {label: 'Acrobacias', description: 'Competencia para realizar maniobras físicas complejas, como saltos, volteretas o movimientos evasivos'},
    {label: 'Contundentes', description: 'Dominio de armas como martillos, mazas o garrotes'},
    {label: 'A dos manos', description: 'Especialización en el uso de armas grandes que requieren las dos manos, como espadas largas o hachas de guerra'},
    {label: 'Armas largas', description: 'Maestría en armas con alcance extendido, como lanzas o alabardas'},
    {label: 'Atletismo', description: 'Capacidad para cargar grandes pesos, mover obstáculos pesados o romper objetos robustos con las manos desnudas'},
    {label: 'Sigilo', description: 'Capacidad para moverse sin ser detectado, ya sea al infiltrarse en una ubicación o evadir enemigos'},
    {label: 'Juego de manos', description: 'Habilidad para realizar trucos rápidos con las manos, como robar, manipular objetos o engañar visualmente'},
    {label: 'Ocultar', description: 'Competencia para esconder objetos o incluso personas en el entorno'},
    {label: 'Filo', description: 'Maestría en el uso de armas cortas y afiladas, como espadas pequeñas o dagas'},
    {label: 'Certeza', description: 'Precisión extrema en el uso de armas arrojadizas, como cuchillos, dardos o shurikens'},
    {label: 'Ligereza', description: 'Especialización en combate con armas pequeñas, como dagas o cuchillos, en enfrentamientos cuerpo a cuerpo'},
    {label: 'Percepción', description: 'Capacidad para notar detalles sutiles en el entorno, como sonidos, movimientos o pistas visuales'},
    {label: 'Concentración', description: 'Habilidad para mantener la calma y el enfoque en situaciones caóticas o peligrosas'},
    {label: 'Supervivencia', description: 'Competencia en rastreo, caza, orientación y habilidades necesarias para sobrevivir en entornos hostiles'},
    {label: 'Deducción', description: 'Capacidad para analizar situaciones y llegar a conclusiones lógicas rápidamente'},
    {label: 'Medicina', description: 'Habilidad para curar heridas, tratar enfermedades o usar remedios naturales'},
    {label: 'Arcano', description: 'Conocimiento de lo mágico, como runas, encantamientos o criaturas sobrenaturales'},
    {label: 'Intimidar', description: 'Habilidad para usar el miedo como arma, ya sea con palabras, gestos o presencia física'},
    {label: 'Intuición', description: 'Capacidad para leer las intenciones de otros, detectando mentiras o señales de peligro'},
    {label: 'Alerta', description: 'Competencia para reaccionar rápidamente ante amenazas repentinas o cambios en el entorno'},
    {label: 'Entereza', description: 'Habilidad para resistir el estrés emocional, el miedo o las manipulaciones mentales'},
    {label: 'Persuadir', description: 'Capacidad para convencer a otros mediante argumentos lógicos o emocionales'},
    {label: 'Liderazgo', description: 'Habilidad para inspirar y dirigir a otros, organizándolos de manera eficaz en situaciones complejas'},
  ];

  SELECT_CHR = 'Selección de Crónica';
  SELECT_ADV = 'Selección de Aventureros';
  SELECT_LVL = 'Selección de Dificultad';
  SELECT_PREV = 'Volver a ';
  SELECT_INI = 'Comenzar la Aventura';
  SELECT_PLO = 'Continuar la aventura';

  PROMPT_INI0 = 'Narrarás una aventura en un mundo de baja fantasía, sombrío y decadente, donde la humanidad sobrevive entre corrupción, intrigas políticas y peligros mundanos y sobrenaturales. ';
  PROMPT_INI1 = 'El jugador interpreta a un aventurero que, por destino o decisión, emprende un viaje lleno de desafíos, elecciones significativas y moral ambigua, para cumplir una tarea encomendada. ';
  PROMPT_INI2 = 'La aventura tiene tres actos, cada acto con tres escenas, y cada escena incluye eventos clave para avanzar la trama. Superar un evento introduce nuevos desafíos que acercan al siguiente acto. ';
  PROMPT_ADV0 = 'El aventurero es {{name}}, cuya ocupación es {{occupation}}, forma parte de un grupo de aventureros junto a: {{partners}}. ';
  PROMPT_POS0 = 'Necesito que devuelvas el texto que de contexto al evento actual ({{scene}}) en un máximo de {{numPar}} párrafos';
  PROMPT_POS1 = 'Tras ello, muestrame {{numOpc}} opciones, precedida cada una por *Opción X:* donde X es el número de la opción';
  PROMPT_POS2 = 'Las opciones deben describir acciones específicas del aventurero, evitando mencionar reacciones, resultados o consecuencias inmediatas. Céntrate en lo que hace, no en cómo responde el entorno';
  PROMPT_POS3 = 'Cada opción representa una habilidad del aventurero, sin mencionar explícitamente la habilidad usada. Asegúrate de que las acciones reflejen la descripción de cada habilidad'

  ACT_TITLES = ['Acto I', 'Acto II', 'Acto III'];
  ACT_SUBTITLES = ['Introducción', 'Nudo', 'Desenlace'];
  SCENE_NAMES = [
    ['Prólogo', 'Preparación', 'Catalizador'],
    ['In Crescendo', 'Punto intermedio', 'Crisis'],
    ['Clímax', 'Solución final', 'Epílogo'],
  ];
  PLOT_POINTS = [
    [2, 3, 4],
    [5, 5, 4],
    [4, 3, 0],
  ];

  NAME_SUBNAME_MAP: { [name: string]: string[] } = {
    Enfrentamiento: ['Combate', 'Duelo', 'Negociación', 'Emboscada', 'Sorpresa'],
    Decisión: ['Moral', 'Comercio', 'Ayuda', 'Recompensa', 'Contratación'],
    Desafío: ['Reto', 'Conflicto'],
  };
  NAME_PROBABILITIES: number[][] = [
    [50, 0, 50],  // Para Acto I [30, 20, 50]
    [40, 20, 40],  // Para Acto II
    [50, 20, 30],  // Para Acto III
  ];
  SUBNAME_PROBABILITIES: { [key: string]: number[][] } = {
    Enfrentamiento: [
      [40, 20, 20, 10, 10],  // Para Acto I
      [60, 10, 10, 15, 5],  // Para Acto II
      [80, 0, 0, 20, 0],  // Para Acto III
    ],
    Decisión: [
      [40, 20, 20, 10, 10],  // Para Acto I
      [40, 15, 15, 15, 15],  // Para Acto II
      [90, 0, 10, 0, 0],  // Para Acto III
    ],
    Desafío: [
      [60, 40],  // Para Acto I
      [50, 50],  // Para Acto II
      [40, 60],  // Para Acto III
    ],
  };
}
