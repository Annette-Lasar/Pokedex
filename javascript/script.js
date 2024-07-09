async function init() {
  showOrHideLoadingSpinner('show');
  await getPokemons();
  showOrHideLoadingSpinner('hide');
  loadCurrentTabName();
  const inputElement = document.querySelector('.search-input');
  inputElement.addEventListener('input', handleInputChange);
}

/* =================================================================
get Pokemons from external server
=================================================================== */

function searchPokemon() {
  let searchInput = getBoxId('search_input').value.trim().toLowerCase();
  let listedPokemons = getBoxId('pokemon_gallery');
  listedPokemons.innerHTML = '';
  for (let i = 0; i < currentPokemons.length; i++) {
    let pokemon = currentPokemons[i];
    let pokemonName = pokemon.name.toLowerCase();
    if (pokemonName.includes(searchInput)) {
      listedPokemons.innerHTML += generatePokemonGalleryHTML(i, pokemon);
      definePokemonMainType(i);
      getPokemonTypes(i, pokemon);
    }
  }
}

function handleInputChange(event) {
  const input = document.querySelector('.search-input');
  if (event.target.value && !input.classList.contains('clear-input--touched')) {
    input.classList.add('search-input--touched');
  } else if (
    !event.target.value &&
    input.classList.contains('clear-input--touched')
  ) {
    input.classList.remove('search-input--touched');
  }
}

function clearSearchBox() {
  let searchInput = getBoxId('search_input');
  searchInput.value = '';
  renderPokemons();
}

/* =============================================================
Pokemon gallery
=============================================================== */
async function getPokemons() {
  let response = await fetchURL('https://pokeapi.co/api/v2/pokemon');
  pokemonBatch = await changeDatabaseToJson(response);
  currentBatch = pokemonBatch.results;
  await createPokemonObjects();
}

async function createPokemonObjects() {
  for (let i = 0; i < currentBatch.length; i++) {
    const BATCH = currentBatch[i];
    const POKEMON_URL = BATCH.url;
    await createAndSavePokemonObject(POKEMON_URL);
  }
  renderPokemons();
}

async function createAndSavePokemonObject(POKEMON_URL) {
  let currentPokemonData = await fetchURL(POKEMON_URL);
  let currentPokemon = await changeDatabaseToJson(currentPokemonData);
  currentPokemons.push(currentPokemon);
}

async function createNewPokemonObjects() {
  for (let i = 0; i < newBatch.length; i++) {
    const BATCH = newBatch[i];
    const POKEMON_URL = BATCH.url;
    await createAndSavePokemonObject(POKEMON_URL);
  }
  renderPokemons();
}

async function getMorePokemons(off) {
  showOrHideLoadingSpinner('show');
  newBatch = [];
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${off}&limit=${BATCH_LENGTH}`
  );
  const data = await response.json();
  newBatch.push(...data.results);
  await createNewPokemonObjects();
  showOrHideLoadingSpinner('hide');
}

async function setNewOffForMorePokemons() {
  let newOff = off + BATCH_LENGTH;
  off = newOff;
  await getMorePokemons(off);
}

function renderPokemons() {
  const POKEMON_GALLERY_BOX = getBoxId('pokemon_gallery');
  const MORE_BUTTON_BOX = getBoxId('more_button_section');
  POKEMON_GALLERY_BOX.innerHTML = '';
  MORE_BUTTON_BOX.innerHTML = '';
  for (let i = 0; i < currentPokemons.length; i++) {
    const currentPokemon = currentPokemons[i];
    POKEMON_GALLERY_BOX.innerHTML += generatePokemonGalleryHTML(
      i,
      currentPokemon
    );
    definePokemonMainType(i);
    getPokemonTypes(i, currentPokemon);
  }
  MORE_BUTTON_BOX.innerHTML += generateMorePokemonsAndToTopButtonHTML();
}

function scrollLastCardIntoView() {
  const last_id = currentPokemons.length - 1;
  const lastPokemonElement = getBoxId(`pokemon_card_${last_id}`);
  lastPokemonElement.scrollIntoView({ behavior: 'smooth' });
}

async function getEnglishFlavorTexts(i, pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  let response = await fetch(url);
  let data = await response.json();
  let englishFlavorTexts = 'Description of this Pokemon';
  let text = adjustEnglishFlavorTexts(data, englishFlavorTexts);

  insertDescriptionText(i, text);
}

function adjustEnglishFlavorTexts(data, englishFlavorTexts) {
  englishFlavorTexts = data.flavor_text_entries
    .filter((entry) => entry.language.name === 'en')
    .map((entry) => entry.flavor_text)
    .map((text) =>
      text
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/(^\w|\.\s*\w)/g, (match) => match.toUpperCase())
    )
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(' ');
  return englishFlavorTexts;
}

function definePokemonMainType(i) {
  const currentPokemon = currentPokemons[i];
  const pokemonMainType = currentPokemon['types'][0]['type']['name'];
  setPokemonBackgroundColor(i, pokemonMainType);
  setPokemonTypeSymbol(i, pokemonMainType);
  setDetailBackgroundAndImages(i, pokemonMainType);
}

function extractTypes(pokemon) {
  return pokemon.types.map((type) => type.type.name);
}

function extractEggGroups(pokemonSpecies) {
  return pokemonSpecies.egg_groups.map((eggData) => eggData.name);
}

function extractGenus(pokemonSpecies) {
  return pokemonSpecies.genera[7].genus;
}

function extractMoves(pokemon) {
  return pokemon.moves.map((moveData) => moveData.move.name);
}

function extractStats(pokemon) {
  return pokemon.stats.map((statData) => statData.stat.name);
}

function extractStatsValue(pokemon) {
  return pokemon.stats.map((statData) => statData.base_stat);
}

function combineStats(names, values) {
  if (names.length !== values.length) {
    console.error('Fehler: Die Arrays haben unterschiedliche Längen.');
    return [];
  }
  const stats = names.map((statName, index) => ({
    stat_name: statName,
    stat_value: values[index],
  }));

  return stats;
}

function getPokemonTypes(i, pokemon) {
  const pokemonTypes = extractTypes(pokemon);
  insertPokemonTypes(i, pokemonTypes);
}

async function getPokemonSpecies(i, currentPokemon) {
  let pokemonId = +i + 1;
  let response = await fetchURL(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
  );
  let pokemonSpecies = await changeDatabaseToJson(response);
  let evolutionChainUrl = pokemonSpecies.evolution_chain.url;
  getPokemonSpeciesInformation(currentPokemon, pokemonSpecies);
  await getPokemonEvolution(evolutionChainUrl);
}

function getPokemonSpeciesInformation(currentPokemon, pokemonSpecies) {
  const pokemonEggGroups = extractEggGroups(pokemonSpecies);
  const pokemonGenus = extractGenus(pokemonSpecies);

  insertPokemonAbouts(currentPokemon, pokemonEggGroups, pokemonGenus);
}

async function getPokemonEvolution(url) {
  let response = await fetchURL(`${url}`);
  let pokemonEvolution = await changeDatabaseToJson(response);
  getPokemonEvolutionInformation(pokemonEvolution);
}

function getPokemonEvolutionInformation(pokemonEvolution) {
  let firstPokemonOfChain = createFirstPokemonOfChain(pokemonEvolution);
  let evolutionStages = [];
  evolutionStages.push(firstPokemonOfChain);
  let evolves_to = pokemonEvolution.chain.evolves_to;
  while (evolves_to.length > 0) {
    const currentStage = evolves_to[0];
    evolutionStages.push({
      name: currentStage.species.name,
      url: currentStage.species.url,
    });
    evolves_to = currentStage.evolves_to;
  }
  insertPokemonEvolution(evolutionStages);
}

function createFirstPokemonOfChain(pokemonEvolution) {
  return {
    name: pokemonEvolution.chain.species.name,
    url: pokemonEvolution.chain.species.url,
  };
}

function getPokemonStats(i, pokemon) {
  const pokemonStatsName = extractStats(pokemon);
  const pokemonStatsValue = extractStatsValue(pokemon);
  const stats = combineStats(pokemonStatsName, pokemonStatsValue);

  insertPokemonStats(i, stats);
}

function getPokemonMoves(i, pokemon) {
  const pokemonMoves = extractMoves(pokemon);
  insertPokemonMoves(i, pokemonMoves);
}

function setPokemonBackgroundColor(i, pokemonMainType) {
  const POKEMON_CARD_BOX = getBoxId(`pokemon_card_${i}`);
  const POKEMON_TEXT_BOX = getBoxId(`pokemon_text_wrapper_${i}`);

  if (TYPE_COLORS[pokemonMainType]) {
    POKEMON_CARD_BOX.style.backgroundColor = TYPE_COLORS[pokemonMainType];
    POKEMON_TEXT_BOX.style.backgroundColor = TYPE_COLORS[pokemonMainType];
  } else {
    console.warn(`Farbe für den Typ '${pokemonMainType}' nicht gefunden.`);
    POKEMON_CARD_BOX.style.backgroundColor = 'lightgray';
  }
}

function setPokemonTypeSymbol(i, pokemonMainType) {
  if (TYPE_SYMBOLS[pokemonMainType]) {
    const newSymbolPath = TYPE_SYMBOLS[pokemonMainType];
    const existingImgElement = getBoxId(`current_pokemon_symbol_${i}`);
    if (existingImgElement) {
      existingImgElement.src = newSymbolPath;
    }
  }
}

function insertPokemonTypes(i, types) {
  const TYPE_BOX = getBoxId(`pokemon_type_wrapper_${i}`);
  TYPE_BOX.innerHTML = '';
  for (let j = 0; j < types.length; j++) {
    const pokemonType = types[j];
    TYPE_BOX.innerHTML += /* html */ `<div id="pokemon_type${i}" class="pokemon-type">${pokemonType}</div>`;
  }
}

function moveImageToCenter(i) {
  const pokemonImageBox = getBoxId(`current_pokemon_image_${i}`);
  const pokemonSymbolBox = getBoxId(`current_pokemon_symbol_${i}`);
  if (pokemonImageBox || pokemonSymbolBox) {
    pokemonImageBox.style.left = '50%';
    pokemonSymbolBox.style.right = '50%';
  }
}

function moveImageToSide(i) {
  const pokemonImageBox = getBoxId(`current_pokemon_image_${i}`);
  const pokemonSymbolBox = getBoxId(`current_pokemon_symbol_${i}`);
  if (pokemonImageBox) {
    pokemonImageBox.style.left = '20%';
    pokemonSymbolBox.style.right = '35%';
  }
}

function turnCard(i) {
  const pokemonCardBox = getBoxId(`pokemon_card_${i}`);
  const pokemonFrontfaceBox = getBoxId(
    `pokemon_content_wrapper_frontface_${i}`
  );
  const pokemonBackfaceBox = getBoxId(`pokemon_content_wrapper_backface_${i}`);
  pokemonCardBox.classList.toggle('backface');
  pokemonFrontfaceBox.classList.toggle('d-none');
  pokemonBackfaceBox.classList.toggle('d-none');
  renderPokemonBackfaceContent(i);
}

async function renderPokemonBackfaceContent(i) {
  const pokemonBackfaceBox = getBoxId(`pokemon_content_wrapper_backface_${i}`);
  const currentPokemon = currentPokemons[i];
  const pokemonId = currentPokemon.id;

  pokemonBackfaceBox.innerHTML = '';
  pokemonBackfaceBox.innerHTML += generateBackFaceContentHTML(
    i,
    currentPokemon
  );
  await getEnglishFlavorTexts(i, pokemonId);
}

function insertDescriptionText(i, englishFlavorTexts) {
  const pokemonInfoTextBox = getBoxId(`pokemon_info_text${i}`);
  if (pokemonInfoTextBox) {
    pokemonInfoTextBox.innerHTML = '';
    pokemonInfoTextBox.innerHTML = englishFlavorTexts;
  }
}
