async function init() {
  await getPokemons();
}

/* ===========================================================
auxiliary functions
============================================================= */
async function fetchURL(url) {
  let requestedURL = await fetch(url);
  return requestedURL;
}

async function changeDatabaseToJson(data) {
  let dataToJson = await data.json();
  return dataToJson;
}

function getBoxId(id) {
  const BOX_ID = document.getElementById(id);
  return BOX_ID;
}

/* =============================================================
Pokemon gallery
=============================================================== */
async function getPokemons() {
  let response = await fetchURL('https://pokeapi.co/api/v2/pokemon');
  pokemonBatch = await changeDatabaseToJson(response);
  currentBatch = pokemonBatch.results;
  console.log('Pokemon-Batch: ', pokemonBatch);
  console.log('Aktuelle Pokemon-Charge: ', currentBatch);
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
  newBatch = [];
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${off}&limit=${BATCH_LENGTH}`
  );
  const data = await response.json();
  newBatch.push(...data.results);
  console.log('Neue Pokemon-Batch: ', newBatch);
  createNewPokemonObjects();
  disableOrEnableMoreButton('disable');
}

async function setNewOffForMorePokemons() {
  let newOff = off + BATCH_LENGTH;
  console.log('Anzahl der Pokemons: ', newOff);
  off = newOff;
  await getMorePokemons(off);
}

function disableOrEnableMoreButton(action) {
  const MORE_BUTTON = getBoxId('more_pokemons_button');
  if (action === 'disable') {
    MORE_BUTTON.disabled = true;
    MORE_BUTTON.classList.add('disabled');
  } else {
    MORE_BUTTON.disabled = false;
    MORE_BUTTON.classList.remove('disabled');
  }
}

/* function renderPokemons() {
  console.log('Pokemon-Array: ', currentPokemons);
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
  MORE_BUTTON_BOX.innerHTML += `<button id="more_pokemons_button" onclick="setNewOffForMorePokemons()" class="more-pokemons-button">More Pokemons</button`;
  disableOrEnableMoreButton('enable');
} */

function renderPokemons() {
  console.log('Pokemon-Array: ', currentPokemons);
  const POKEMON_GALLERY_BOX = getBoxId('pokemon_gallery');
  const MORE_BUTTON_BOX = getBoxId('more_button_section');
  POKEMON_GALLERY_BOX.innerHTML = '';
  MORE_BUTTON_BOX.innerHTML = '';
  for (let i = 0; i < currentPokemons.length; i++) {
    const currentPokemon = currentPokemons[i];
    POKEMON_GALLERY_BOX.innerHTML += generatePokemonGalleryHTML(
      i,
      currentPokemon,
    );
    definePokemonMainType(i);
    getPokemonTypes(i, currentPokemon);
  }
  scrollLastCardIntoView();
  MORE_BUTTON_BOX.innerHTML += `<button id="more_pokemons_button" onclick="setNewOffForMorePokemons()" class="more-pokemons-button">More Pokemons</button`;
  disableOrEnableMoreButton('enable');
}

function generatePokemonGalleryHTML(i, currentPokemon) {
  return /* html */ `
       <div id="pokemon_card_${i}" class="pokemon-card" onclick="turnCard(${i})" onmouseover="moveImageToCenter(${i})" onmouseout="moveImageToSide(${i})">
        <div id="pokemon_content_wrapper_frontface_${i}" class="pokemon-content-wrapper-frontface">       
            <div class="pokemon-image-container">
              <img id="current_pokemon_symbol_${i}" class="current-pokemon-symbol" src="../icons/types/type_normal_opaque.png" alt=""></img>
              <img id="current_pokemon_image_${i}" class="current-pokemon-image" src="${
    currentPokemon['sprites']['other']['official-artwork']['front_default']
  }" alt="">
            </div>
            <div id="pokemon_text_wrapper_${i}" class="pokemon-text-wrapper">
              <div class="pokemon-name-wrapper">
                <h2 class="pokemon-name">${currentPokemon.name}</h2>
                <h2 class="pokemon-id">#${currentPokemon.id
                  .toString()
                  .padStart(4, '0')}</h2>
              </div>
              <div id="pokemon_type_wrapper_${i}" class="pokemon-type-wrapper">
              </div>  
            </div>
          </div>
            <div id="pokemon_content_wrapper_backface_${i}" class="pokemon-content-wrapper-backface d-none">
          </div>     
        </div>      
    `;
}

function scrollLastCardIntoView() {
  const last_id = currentPokemons.length - 1;
  const lastPokemonElement = document.getElementById(`pokemon_card_${last_id}`);
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
  console.log('Pokemon-Arten: ', pokemonSpecies);
  getPokemonSpeciesInformation(currentPokemon, pokemonSpecies);
  await getPokemonEvolution(evolutionChainUrl);
}

function getPokemonSpeciesInformation(currentPokemon, pokemonSpecies) {
  const pokemonEggGroups = extractEggGroups(pokemonSpecies);
  const pokemonGenus = extractGenus(pokemonSpecies);

  insertPokemonAbouts(currentPokemon, pokemonEggGroups, pokemonGenus);
}

// EVOLUTION
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

function generateBackFaceContentHTML(i, currentPokemon) {
  return /* html */ `
    <h2 class="pokemon-name">${currentPokemon.name}</h2>
    <p id="pokemon_info_text${i}" class="pokemon-info-text">Description of this Pokemon.</p>
    <button id="show_details_button" class="show_details_button" data-index="${i}" onclick="openCard(${i})">Details</button>
  `;
}

function insertDescriptionText(i, englishFlavorTexts) {
  const pokemonInfoTextBox = getBoxId(`pokemon_info_text${i}`);
  if (pokemonInfoTextBox) {
    pokemonInfoTextBox.innerHTML = '';
    pokemonInfoTextBox.innerHTML = englishFlavorTexts;
  }
}

/* ==============================================================================
Pokemons: detailed view
================================================================================= */
document.addEventListener('click', function (event) {
  const clickedElement = event.target;
  if (clickedElement.classList.contains('show_details_button')) {
    const dataIndex = clickedElement.dataset.index;
    openCard(dataIndex);
  }
});

async function openCard(i) {
  let tabName = 'evolution';
  const POKEMON_DETAIL_BOX = getBoxId('pokemon_details_background');
  let currentPokemon = currentPokemons[i];

  POKEMON_DETAIL_BOX.innerHTML = generateDetailCardBoxHTML(i, currentPokemon);
  POKEMON_DETAIL_BOX.classList.remove('d-none');
  definePokemonMainType(i);
  await getPokemonSpecies(i, currentPokemon);
  getPokemonStats(i, currentPokemon);
  getPokemonMoves(i, currentPokemon);
  showContent(tabName);
}

function generateDetailCardBoxHTML(i, currentPokemon) {
  return /* html */ `
    <div id="pokemon_detail_card${i}" class="pokemon-detail-card">
      <div class="detail-card-icon-wrapper">
      <div class="arrow-wrapper">
        <img src="../icons/arrow-left.svg" onclick="showPreviousCard(${i})">
        <img src="../icons/arrow-right.svg" onclick="showNextCard(${i})">
      </div>
      <div class="x-close" onclick="closeDetailView()">
        <img src="../icons/x-close.svg" alt="">
      </div>
      </div>
      <div class="detail-name-wrapper">
        <h2 class="pokemon-name">${currentPokemon.name}</h2>
        <h2 class="detail-pokemon-id">#${currentPokemon.id
          .toString()
          .padStart(4, '0')}
        </h2>
      </div>
      <div class="detail-content-wrapper">
          <div id="detail_image_container_${i}" class="detail-image-container">
          </div>
          <div class="detail-container">
              <div class="tab-container">
              <div id="about" class="tab not-current-tab" onclick="showContent('about')">About</div>
              <div id="base_stats" class="tab not-current-tab" onclick="showContent('base_stats')">Base Stats</div>
              <div id="evolution" class="tab not-current-tab" onclick="showContent('evolution')">Evolution</div>
              <div id="moves" class="tab not-current-tab" onclick="showContent('moves')">Moves</div>
          </div>
          <div class="detail-content-container">
            <div id="about_content" class="content">
                <table id="about_table" class="about-table"></table>
            </div>
            <div id="base_stats_content" class="content base-stats-content">
                <table id="statistics_table" class="statistics-table"></table>
            </div>
            <div id="evolution_content" class="content evolution-content">
              <div id="evolution_box" class="evolution-box"></div>
            </div>
            <div id="moves_content" class="content">Content for Moves tab</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function closeDetailView() {
  const POKEMON_DETAIL_BOX = getBoxId('pokemon_details_background');
  POKEMON_DETAIL_BOX.classList.add('d-none');
}

function showContent(tabName) {
  const contents = document.querySelectorAll('.content');
  contents.forEach((content) => {
    content.style.display = 'none';
  });

  const selectedContent = document.getElementById(`${tabName}_content`);
  selectedContent.style.display = 'flex';
  markCurrentTab(tabName);
}

function markCurrentTab(id) {
  for (let tabName of DETAIL_TABS) {
    const DETAIL_TAB_BOX = getBoxId(tabName);

    if (tabName === id) {
      DETAIL_TAB_BOX.classList.remove('not-current-tab');
      DETAIL_TAB_BOX.classList.add('current-tab');
    } else {
      DETAIL_TAB_BOX.classList.remove('current-tab');
      DETAIL_TAB_BOX.classList.add('not-current-tab');
    }
  }
}

function showPreviousCard(i) {
  let previousIndex = (i - 1 + currentPokemons.length) % currentPokemons.length;
  openCard(previousIndex);
}

function showNextCard(i) {
  let nextIndex = (i + 1 + currentPokemons.length) % currentPokemons.length;
  openCard(nextIndex);
}

function setDetailBackgroundAndImages(i, pokemonMainType) {
  const DETAIL_CARD_BOX = getBoxId(`pokemon_detail_card${i}`);
  const DETAIL_IMAGE_BOX = getBoxId(`detail_image_container_${i}`);

  if (DETAIL_CARD_BOX) {
    const isDetailOpen = !DETAIL_CARD_BOX.classList.contains('d-none');
    if (
      isDetailOpen &&
      TYPE_COLORS[pokemonMainType] &&
      TYPE_SYMBOLS[pokemonMainType]
    ) {
      DETAIL_CARD_BOX.style.backgroundColor = TYPE_COLORS[pokemonMainType];
      DETAIL_IMAGE_BOX.innerHTML = '';
      DETAIL_IMAGE_BOX.innerHTML += `<img src="${currentPokemons[i]['sprites']['other']['official-artwork']['front_default']}" class="pokemon-detail-image" alt="">
      <img src="${TYPE_SYMBOLS[pokemonMainType]}" class="pokemon-detail-symbol" alt="">
      `;
    } else {
      console.warn(`Farbe für den Typ '${pokemonMainType}' nicht gefunden.`);
      DETAIL_CARD_BOX.style.backgroundColor = 'lightgray';
    }
  }
}

function insertPokemonAbouts(currentPokemon, pokemonEggGroups, pokemonGenus) {
  const ABOUT_TABLE_BOX = getBoxId('about_table');
  ABOUT_TABLE_BOX.innerHTML = '';
  const MONSTER_HEIGHT = currentPokemon.height / 10;
  const MONSTER_WEIGHT = currentPokemon.weight / 10;
  let pokemonAbilities = currentPokemon.abilities.map(
    (abilityData) => abilityData.ability.name
  );
  let monsterEggGroups01 = pokemonEggGroups[0];
  let monsterEggGroups02 = '';

  monsterEggGroups02 = checkIfEggGroups(pokemonEggGroups, monsterEggGroups02);
  let monsterHeightInFeet = metersToFeetAndInches(MONSTER_HEIGHT);
  let monsterWeightInStone = kilosToStoneAndPounds(MONSTER_WEIGHT);
  ABOUT_TABLE_BOX.innerHTML += generateaboutTableHTML(
    pokemonGenus,
    MONSTER_HEIGHT,
    monsterHeightInFeet,
    MONSTER_WEIGHT,
    monsterWeightInStone,
    pokemonAbilities,
    monsterEggGroups01,
    monsterEggGroups02
  );
}

function metersToFeetAndInches(MONSTER_HEIGHT) {
  const feet = MONSTER_HEIGHT * METER_IN_FEET;
  const feetPart = Math.floor(feet);
  const inchesPart = Math.round((feet - feetPart) * 12);
  return `${feetPart}' ${inchesPart}''`;
}

function kilosToStoneAndPounds(MONSTER_WEIGHT) {
  const weightInStone = Math.floor((MONSTER_WEIGHT * KG_IN_ENGL_POUND) / 14);
  const weightInPounds = Math.floor((MONSTER_WEIGHT * KG_IN_ENGL_POUND) % 14);
  return `${weightInStone}' ${weightInPounds}''`;
}

function generateaboutTableHTML(
  pokemonGenus,
  MONSTER_HEIGHT,
  monsterHeightInFeet,
  MONSTER_WEIGHT,
  monsterWeightInStone,
  pokemonAbilities,
  monsterEggGroups01,
  monsterEggGroups02
) {
  return /* html */ `
      <tr>
        <td colspan="3" class="about-box">About</td>
      </tr>
      <tr>
        <td class="first-column">Species</td>
        <td colspan="2">${pokemonGenus}</td>
      </tr>
      <tr>
        <td class="first-column">Height</td>
        <td>${MONSTER_HEIGHT} m</td>
        <td>${monsterHeightInFeet}</td>
      </tr>
      <tr>
        <td class="first-column">Weight</td>
        <td>${MONSTER_WEIGHT} kg</td>
        <td>${monsterWeightInStone}</td>
      </tr>
      <tr>
        <td class="first-column">Abilities</td>
        <td colspan="2" class="ability-box">${pokemonAbilities.join(', ')}</td>
      </tr>
      <tr>
        <td colspan="3" class="breeding-box">Breeding</td>
      </tr>
      <tr>
        <td class="first-column">Egg Groups</td>
        <td colspan="2" class="egg-groups">${monsterEggGroups01}</td>
      </tr>
      <tr>
        <td class="first-column">Egg Cycle</td>
        <td colspan="2" class="egg-groups">${monsterEggGroups02}</td>
      </tr>
  `;
}

function checkIfEggGroups(pokemonEggGroups, monsterEggGroups02) {
  if (pokemonEggGroups.length == 2) {
    monsterEggGroups02 = pokemonEggGroups[1];
    return monsterEggGroups02;
  } else if (pokemonEggGroups.length == 1) {
    monsterEggGroups02 = '';
    return monsterEggGroups02;
  }
}

function insertPokemonStats(i, stats) {
  const DETAIL_CARD_BOX = getBoxId(`pokemon_detail_card${i}`);
  const DETAIL_STATS_TABLE = getBoxId(`statistics_table`);
  if (DETAIL_CARD_BOX) {
    const isDetailOpen = !DETAIL_CARD_BOX.classList.contains('d-none');

    if (isDetailOpen && stats) {
      DETAIL_STATS_TABLE.innerHTML = '';
      let rowsHTML = '';
      let progressBarValues = [];
      let sum = 0;

      for (let j = 0; j < stats.length; j++) {
        const POKEMON_STAT_NAME = stats[j].stat_name;
        const pokemonStatValue = stats[j].stat_value;
        sum += pokemonStatValue;

        rowsHTML += generateStatisticsTableHTML(
          j,
          POKEMON_STAT_NAME,
          pokemonStatValue
        );

        progressBarValues.push(pokemonStatValue);
      }
      rowsHTML += `<tr><td>Total</td><td class="total-sum">${sum}</td></tr`;
      DETAIL_STATS_TABLE.innerHTML += rowsHTML;
      setProgressbarColor(progressBarValues);
    }
  }
}

function generateStatisticsTableHTML(j, POKEMON_STAT_NAME, pokemonStatValue) {
  return /* html */ `
    <tr>
        <td>${POKEMON_STAT_NAME}</td>
        <td class="progress-container">
          <span class="progress-label">${pokemonStatValue}</span>
          <progress id="progress_bar_${j}" value="${Math.round(
    (pokemonStatValue / 150) * 100
  )}" max="100"></progress>
        </td>
    </tr>
    `;
}

function setProgressbarColor(progressBarValues) {
  let progressBars = document.querySelectorAll('progress');

  progressBarValues.forEach((value, index) => {
    let progress = progressBars[index];
    if (progress) {
      let colorStyle = getColorClassForStatValue(
        Math.round((value / 150) * 100)
      );
      progress.style.setProperty('--bgcolor', `${colorStyle}`);
    }
  });
}

function getColorClassForStatValue(pokemonStatValue) {
  if (pokemonStatValue <= 20) {
    return '#c126c1';
  } else if (pokemonStatValue <= 40) {
    return '#dd2e2e';
  } else if (pokemonStatValue <= 60) {
    return '#fc9919';
  } else if (pokemonStatValue <= 80) {
    return '#ffe500';
  } else if (pokemonStatValue <= 100) {
    return '#19d90f';
  }
}

async function insertPokemonEvolution(evolutionStages) {
  const EVOLUTION_TABLE_BOX = getBoxId('evolution_box');
  EVOLUTION_TABLE_BOX.innerHTML = '';

  EVOLUTION_TABLE_BOX.innerHTML += await generateEvolutionChainHTML(
    evolutionStages
  );
}

async function getOriginalPokemonObject(name) {
  let response = await fetchURL(`https://pokeapi.co/api/v2/pokemon/${name}`);
  let pokemon = await changeDatabaseToJson(response);
  return pokemon;
}

async function generateEvolutionChainHTML(evolutionStages) {
  let tableHTML = '<tr>';
  let numColumns = 0;
  const firstTableRow = await createFirstTableRow(evolutionStages);
  tableHTML += firstTableRow.columns.join('');
  tableHTML += '</tr><tr>';
  const secondTableRow = createSecondTableRow(evolutionStages);
  tableHTML += secondTableRow.names.join('');
  tableHTML += '</tr>';
  numColumns = firstTableRow.updatedNumColumns + secondTableRow.names.length;
  numColumns = numColumns / 2;
  numColumns = checkNumberOfColumns(numColumns);
  const tableClass = numColumns;
  return `<table class="${tableClass} evolution-table">${tableHTML}</table>`;
}

function checkNumberOfColumns(numColumns) {
  if (numColumns === 5) {
    return 'evolution-table-big';
  } else if (numColumns === 3) {
    return 'evolution-table-medium';
  } else if (numColumns === 1) {
    return 'evolution-table-small';
  }
}

async function createFirstTableRow(evolutionStages) {
  let columns = [];
  let numColumns = 0;
  for (let i = 0; i < evolutionStages.length; i++) {
    const pokemonObj = await getOriginalPokemonObject(evolutionStages[i].name);
    const imgSrc = pokemonObj.sprites.other['official-artwork'].front_default;
    columns.push(
      `<td class="evolution-chain-img"><img src="${imgSrc}" class="monster-image"></td>`
    );
    numColumns += 1;
    if (i < evolutionStages.length - 1) {
      columns.push(
        '<td class="evolution-arrow"><img src="../icons/arrow_right_long.svg"></td>'
      );
      numColumns += 1;
    }
  }
  return { columns, updatedNumColumns: numColumns };
}

function createSecondTableRow(evolutionStages) {
  let names = [];
  for (let j = 0; j < evolutionStages.length; j++) {
    const pokemonName = evolutionStages[j].name;
    names.push(`<td class="evolution-chain-name">${pokemonName}</td>`);
    if (j < evolutionStages.length - 1) {
      names.push('<td></td>');
    }
  }
  return { names };
}

function insertPokemonMoves(i, pokemonMoves) {
  const DETAIL_CARD_BOX = getBoxId(`pokemon_detail_card${i}`);
  const DETAIL_MOVES_BOX = getBoxId(`moves_content`);

  if (DETAIL_CARD_BOX) {
    const isDetailOpen = !DETAIL_CARD_BOX.classList.contains('d-none');
    if (isDetailOpen && pokemonMoves) {
      for (let j = 0; j < pokemonMoves.length; j++) {
        DETAIL_MOVES_BOX.innerHTML = '';
        DETAIL_MOVES_BOX.innerHTML = `<div>${pokemonMoves.join(', ')}</div>`;
      }
    }
  }
}
