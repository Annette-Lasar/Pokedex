let pokemonBatch;
let currentBatch = [];
let newBatch = [];
let currentPokemons = [];
let currentSpeciesOfPokemons = [];
let off = 0;
let currentTab = 'about';
const BATCH_LENGTH = 20;
const DETAIL_TABS = ['about', 'base_stats', 'evolution', 'moves'];
const METER_IN_FEET = 3.28084;
const KG_IN_ENGL_POUND = 2.20462;

const TYPE_COLORS = {
    bug: '#c8d834', //Spinnennetz
    dark: '#b89e93', //Maske
    dragon: '#ba6aba', //Drache
    electric: '#edd46f',// Blitz
    fairy: '#f4bcc8', //Zauberstab
    fighting: '#c45b54', // Hand
    fire: '#F08030', // Feuer
    flying: '#adf2ff', //Feder
    ghost: '#b59a86', // Geist
    grass: '#7fdb60', // Blatt
    ground: '#E0C068', // Spaten
    ice: '#56c9c9', // Eiskristalle
    normal: '#b7b782', // Stern
    poison: '#ffb7fb', //Blasen
    psychic: '#ea8faa', // Auge
    rock: '#dbc87a', //Berg
    steel: '#B8B8D0', //Stahlfeder
    water: '#72c6ff', //Tropfen
}

const TYPE_COLORS_Text = {
    bug: '#c8d834', //Spinnennetz
    dark: '#b89e93', //Maske
    dragon: '#ba6aba', //Drache
    electric: '#edd46f',// Blitz
    fairy: '#f4bcc8', //Zauberstab
    fighting: '#c45b54', // Hand
    fire: '#F08030', // Feuer
    flying: '#adf2ff', //Feder
    ghost: '#b59a86', // Geist
    grass: '#7fdb60', // Blatt
    ground: '#E0C068', // Spaten
    ice: '#56c9c9', // Eiskristalle
    normal: '#b7b782', // Stern
    poison: '#ffb7fb', //Blasen
    psychic: '#ea8faa', // Auge
    rock: '#dbc87a', //Berg
    steel: '#B8B8D0', //Stahlfeder
    water: '#72c6ff', //Tropfen
}

const TYPE_SYMBOLS = {
    bug: './symbols/types/type_bug_opaque.png', //Spinnennetz
    dark: './symbols/types/type_dark_opaque.png', //Maske
    dragon: './symbols/types/type_dragon_opaque.png', //Drache
    electric: './symbols/types/type_electric_opaque.png',// Blitz
    fairy: './symbols/types/type_fairy_opaque.png', //zauberstab
    fighting: './symbols/types/type_fighting_opaque.png', // Hand
    fire: './symbols/types/type_fire_opaque.png', // Feuer
    flying: './symbols/types/type_flying_opaque.png', //Feder
    ghost: './symbols/types/type_ghost_opaque.png', // Geist
    grass: './symbols/types/type_grass_opaque.png', // Blatt
    ground: './symbols/types/type_ground_opaque.png', // Spaten
    ice: './symbols/types/type_ice_opaque.png', // Eiskristalle
    normal: './symbols/types/type_normal_opaque.png', // Stern
    poison: './symbols/types/type_poison_opaque.png', //Blasen
    psychic: './symbols/types/type_psychic_opaque.png', // Auge
    rock: './symbols/types/type_rock_opaque.png', //Berg
    steel: './symbols/types/type_steel_opaque.png', //Stahlfeder
    water: './symbols/types/type_water_opaque.png', //Tropfen
}

