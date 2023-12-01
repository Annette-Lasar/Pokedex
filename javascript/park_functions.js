/* async function getOtherInformationAboutPokemon() {
  let urlStat1 = 'https://pokeapi.co/api/v2/stat/1/';
  let urlStat2 = 'https://pokeapi.co/api/v2/pokemon-species/1/';
  let responseUrlStat1 = await fetch(urlStat1);
  let responseUrlStat2 = await fetch(urlStat2);
  let data2 = await responseUrlStat2.json();
  console.log('Status Weedle: ', responseUrlStat1);
  console.log('Attack Bulbasaur: ', data2);
} */

/* async function getEnglishFlavorText() {
  let url = 'https://pokeapi.co/api/v2/pokemon-species/1/';
  let response = await fetch(url);
  let data = await response.json();

  // Extrahiere englische Beschreibungstexte
  let englishFlavorTexts = data.flavor_text_entries
    .filter(entry => entry.language.name === 'en') // Filtere nach Englisch
    .map(entry => entry.flavor_text); // Extrahiere die eigentlichen Texte

  console.log('Englische Beschreibungstexte:', englishFlavorTexts);
} */

/* async function getEnglishFlavorText() {
  let url = 'https://pokeapi.co/api/v2/pokemon-species/1/';
  let response = await fetch(url);
  let data = await response.json();

  // Extrahiere englische Beschreibungstexte
  let englishFlavorTexts = data.flavor_text_entries
    .filter(entry => entry.language.name === 'en') // Filtere nach Englisch
    .map(entry => entry.flavor_text) // Extrahiere die eigentlichen Texte
    .filter((value, index, self) => self.indexOf(value) === index); // Entferne Duplikate

  console.log('Englische Beschreibungstexte:', englishFlavorTexts);
} */

/* async function getEnglishFlavorText() {
  let url = 'https://pokeapi.co/api/v2/pokemon-species/1/';
  let response = await fetch(url);
  let data = await response.json();

  // Extrahiere englische Beschreibungstexte
  let englishFlavorTexts = data.flavor_text_entries
    .filter(entry => entry.language.name === 'en') // Filtere nach Englisch
    .map(entry => entry.flavor_text) // Extrahiere die eigentlichen Texte
    .map(text => text.toLowerCase().replace(/\s+/g, ' ').trim()) // Normalisiere die Texte
    .filter((value, index, self) => self.indexOf(value) === index); // Entferne Duplikate

  console.log('Englische Beschreibungstexte:', englishFlavorTexts);
} */

/* async function getEnglishFlavorText() {
  let url = 'https://pokeapi.co/api/v2/pokemon-species/1/';
  let response = await fetch(url);
  let data = await response.json();

  // Extrahiere englische Beschreibungstexte
  let englishDescription = data.form_description;
  let englishFlavorTexts = data.flavor_text_entries
    .filter((entry) => entry.language.name === 'en') // Filtere nach Englisch
    .map((entry) => entry.flavor_text) // Extrahiere die eigentlichen Texte
    .map((text) =>
      text
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/(^\w|\.\s*\w)/g, (match) => match.toUpperCase())
    ) // Normalisiere und setze Großbuchstaben am Anfang jedes Satzes
    .filter((value, index, self) => self.indexOf(value) === index); // Entferne Duplikate

  console.log('Englische Beschreibungstexte:', englishFlavorTexts);
  console.log('Beschreibung: ', englishDescription);
  insertDescriptionText(englishFlavorTexts);
} */

/* function insertDescriptionText(englishFlavorTexts) {
  const textBox = document.getElementById('text');
  textBox.innerHTML = '';
  textBox.innerHTML += `<p>${englishFlavorTexts}</p>`;
}
 */
/* function calcstoneInKG() {
  let x = 32;
  let y;
  y = x * STONE_IN_KG;
  let stoneInKgRounded = Math.ceil(y * 2) / 2;
  console.log(
    `${x} st sind ${stoneInKgRounded.toString().replace('.', ',')} kg.`
  );
  return y;
} */

function getFirstWords(text, numWords) {
  const words = text.split(/\s+/).slice(0, numWords);
  return words.join(' ');
}

async function getGermanFlavorTexts(i, pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  let response = await fetch(url);
  let data = await response.json();

  let germanFlavorTexts = data.flavor_text_entries
    .filter((entry) => entry.language.name === 'de')
    .map((entry) => entry.flavor_text)
    .filter((value, index, self) => {
      const firstWords = getFirstWords(value, 5);
      return self.findIndex((other) => getFirstWords(other, 5) === firstWords) === index;
    });

  console.log('Deutsche Beschreibungstexte:', germanFlavorTexts);
}

async function getFrenchFlavorTexts(i, pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  let response = await fetch(url);
  let data = await response.json();

  let frenchFlavorTexts = data.flavor_text_entries
    .filter((entry) => entry.language.name === 'fr')
    .map((entry) => entry.flavor_text)
    .filter((value, index, self) => {
      const firstWords = getFirstWords(value, 5);
      return self.findIndex((other) => getFirstWords(other, 5) === firstWords) === index;
    });

  console.log('Französische Beschreibungstexte:', frenchFlavorTexts);
}

async function getItalianFlavorTexts(i, pokemonId, currentPokemon) {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  let response = await fetch(url);
  let data = await response.json();

  let italianFlavorTexts = data.flavor_text_entries
    .filter((entry) => entry.language.name === 'it')
    .map((entry) => entry.flavor_text)
    .filter((value, index, self) => {
      const firstWords = getFirstWords(value, 5);
      return self.findIndex((other) => getFirstWords(other, 5) === firstWords) === index;
    });

  console.log('Italienische Beschreibungstexte:', currentPokemon.name, italianFlavorTexts);
}

async function getSpanishFlavorTexts(i, pokemonId, currentPokemon) {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  let response = await fetch(url);
  let data = await response.json();

  let spanishFlavorTexts = data.flavor_text_entries
    .filter((entry) => entry.language.name === 'es')
    .map((entry) => entry.flavor_text)
    .filter((value, index, self) => {
      const firstWords = getFirstWords(value, 5);
      return self.findIndex((other) => getFirstWords(other, 5) === firstWords) === index;
    });

  console.log('Spanische Beschreibungstexte:', currentPokemon.name, spanishFlavorTexts);
}

// while-Schleife!!
async function renderEvolutions() {
  await loadSpecies(`${currentPokemon['species']['url']}`);
  await loadEvolution(`${currentPokemonSpecies['evolution_chain']['url']}`);
  let display = document.getElementById('detail-view_render-content');
  display.innerHTML = ``;
  display.innerHTML = `<h2>Evolutions</h2>`;
  let evolves_to = currentPokemonEvolution.chain.evolves_to;
  while(evolves_to.length > 0){
      // render evolves_to
      evolves_to = evolves_to[0].evolves_to;
  }
}

let family = {
  name: 'Gundula',
  child: {
      name: 'Hans',
      child: {
          name: 'Freddy',
          child: {
              name: 'Claudia'
          }
      }
  }
}

let currentPerson = family;
while(currentPerson) {
  console.log(currentPerson.name);
  currentPerson = currentPerson.child;
}

// Code-Teile für More-Button!!
let currentPokemons = [];
let off = 0;
const batchLength = 20;

async function loadPokedex(off) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${off}&limit=${BATCH_LENGTH}`);
  const data = await response.json();
  currentPokemons.push(...data.results);
  // Verarbeite die Daten...
}

// Das ist die Onclick-Funktion:
async function setNewOffForMorePokemons() {
  let newOff = off + batchLength;
  off = newOff;
  await loadPokedex(off);
}


async function insertPokemonEvolution(evolutionStages) {
  const EVOLUTION_TABLE_BOX = getBoxId('evolution_table');
  let pokemon1Obj = await getOriginalPokemonObject(evolutionStages[0].name);
  let pokemon2Obj = await getOriginalPokemonObject(evolutionStages[1].name);
  let pokemon3Obj = await getOriginalPokemonObject(evolutionStages[2]?.name || '');

  EVOLUTION_TABLE_BOX.innerHTML = '';
  EVOLUTION_TABLE_BOX.innerHTML += generateEvolutionChainHTML(
    evolutionStages,
    pokemon1Obj,
    pokemon2Obj,
    pokemon3Obj
  );
}

async function getOriginalPokemonObject(name) {
  let response = await fetchURL(`https://pokeapi.co/api/v2/pokemon/${name}`);
  let pokemon = await changeDatabaseToJson(response);
  return pokemon;
}

function generateEvolutionChainHTML(
  evolutionStages,
  pokemon1Obj,
  pokemon2Obj,
  pokemon3Obj
) {
  return `
    <tr>
      <th colspan="5">Evolution Chain:</th>
    </tr>
    <tr>
      <td class="evolution-chain-img"><img src="${checkIfExists(pokemon1Obj.sprites.other['official-artwork'].front_default)}"></td>
      <td class="evolution-arrow"><img src="../icons/arrow_right_long.svg"></td>
      <td class="evolution-chain-img"><img src="${checkIfExists(pokemon2Obj.sprites.other['official-artwork'].front_default)}"></td>
      <td class="evolution-arrow"><img src="../icons/arrow_right_long.svg"></td>
      <td class="evolution-chain-img"><img src="${checkIfExists(pokemon3Obj.sprites.other['official-artwork'].front_default)}"></td>
    </tr>
    <tr>
      <td class="evolution-chain-name">${evolutionStages[0].name}</td>
      <td></td>
      <td class="evolution-chain-name">${evolutionStages[1].name}</td>
      <td></td>
      <td class="evolution-chain-name">${evolutionStages[2]?.name || ''}</td>
    </tr>
  `;
}


async function renderPokemons() {
  // Rendere die Pokemons...

  // Am Ende, nachdem die Pokemons hinzugefügt wurden:
  const lastPokemonElement = document.getElementById('last_pokemon'); // Füge eine eindeutige ID zu dem letzten Pokemon hinzu
  lastPokemonElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
}

