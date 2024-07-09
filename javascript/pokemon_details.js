/* ==============================================================================
Pokemons: detailed view
================================================================================= */
document.addEventListener('click', function (event) {
    const CLICKED_ELEMENT = event.target;
    if (CLICKED_ELEMENT.classList.contains('show_details_button')) {
      const dataIndex = CLICKED_ELEMENT.dataset.index;
      openCard(dataIndex);
    }
  });
  
  async function openCard(i) {
    const POKEMON_DETAIL_BOX = getBoxId('pokemon_details_background');
    let currentPokemon = currentPokemons[i];
    POKEMON_DETAIL_BOX.innerHTML = generateDetailCardBoxHTML(i, currentPokemon);
    POKEMON_DETAIL_BOX.classList.remove('d-none');
    definePokemonMainType(i);
    await getPokemonSpecies(i, currentPokemon);
    getPokemonStats(i, currentPokemon);
    getPokemonMoves(i, currentPokemon);
    let tabName = currentTab;
    showContent(tabName);
  }
  
  function loadCurrentTabName() {
    let currentTabAsText = localStorage.getItem('current-tab');
    if (currentTabAsText) {
      currentTab = currentTabAsText;
    }
  }
  
  function closeDetailView() {
    const POKEMON_DETAIL_BOX = getBoxId('pokemon_details_background');
    POKEMON_DETAIL_BOX.classList.add('d-none');
  }
  
  function showContent(tabName) {
    localStorage.setItem('current-tab', tabName);
    loadCurrentTabName();
    const CONTENTS = document.querySelectorAll('.content');
    CONTENTS.forEach((content) => {
      content.style.display = 'none';
    });
  
    const SELECTED_CONTENT = getBoxId(`${tabName}_content`);
    SELECTED_CONTENT.style.display = 'flex';
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
      const IS_DETAIL_OPEN = !DETAIL_CARD_BOX.classList.contains('d-none');
      if (
        IS_DETAIL_OPEN &&
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
    const FEET = MONSTER_HEIGHT * METER_IN_FEET;
    const FEET_PART = Math.floor(FEET);
    const INCHES_PART = Math.round((FEET - FEET_PART) * 12);
    return `${FEET_PART}' ${INCHES_PART}''`;
  }
  
  function kilosToStoneAndPounds(MONSTER_WEIGHT) {
    const WEIGHT_IN_STONE = Math.floor((MONSTER_WEIGHT * KG_IN_ENGL_POUND) / 14);
    const WEIGHT_IN_POUNDS = Math.floor((MONSTER_WEIGHT * KG_IN_ENGL_POUND) % 14);
    return `${WEIGHT_IN_STONE}' ${WEIGHT_IN_POUNDS}''`;
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
        let rowsHTML = generateRowsHTML(stats);
        DETAIL_STATS_TABLE.innerHTML += rowsHTML;
        setProgressbarColor(stats.map(stat => stat.stat_value));
      }
    }
  }
  
  function generateRowHTML(j, statName, statValue) {
    return generateStatisticsTableHTML(j, statName, statValue);
  }

  
  function generateRowsHTML(stats) {
    let rowsHTML = '';
    let progressBarValues = [];
    let sum = 0;
    for (let j = 0; j < stats.length; j++) {
      const POKEMON_STAT_NAME = stats[j].stat_name;
      const pokemonStatValue = stats[j].stat_value;
      sum += pokemonStatValue;
      rowsHTML += generateRowHTML(j, POKEMON_STAT_NAME, pokemonStatValue);
      progressBarValues.push(pokemonStatValue);
    }
    rowsHTML += `<tr><td>Total</td><td class="total-sum">${sum}</td></tr>`;
    return rowsHTML;
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
  
  function getColorClassForStatValue(POKEMON_STAT_VALUE) {
    if (POKEMON_STAT_VALUE <= 20) {
      return '#c126c1';
    } else if (POKEMON_STAT_VALUE <= 40) {
      return '#dd2e2e';
    } else if (POKEMON_STAT_VALUE <= 60) {
      return '#fc9919';
    } else if (POKEMON_STAT_VALUE <= 80) {
      return '#ffe500';
    } else if (POKEMON_STAT_VALUE <= 100) {
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
    const FIRST_TABLE_ROW = await createFirstTableRow(evolutionStages);
    tableHTML += FIRST_TABLE_ROW.columns.join('');
    tableHTML += '</tr><tr>';
    const SECOND_TABLE_ROW = createSecondTableRow(evolutionStages);
    tableHTML += SECOND_TABLE_ROW.names.join('');
    tableHTML += '</tr>';
    numColumns = FIRST_TABLE_ROW.updatedNumColumns;
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
      const POKEMON_OBJ = await getOriginalPokemonObject(evolutionStages[i].name);
      const IMG_SRC = POKEMON_OBJ.sprites.other['official-artwork'].front_default;
      columns.push(
        `<td class="evolution-chain-img"><img src="${IMG_SRC}" class="monster-image"></td>`
      );
      numColumns += 1;
      if (i < evolutionStages.length - 1) {
        columns.push(
          '<td class="evolution-arrow"><img src="./symbols/arrow_right_long.svg"></td>'
        );
        numColumns += 1;
      }
    }
    return { columns, updatedNumColumns: numColumns };
  }
  
  function createSecondTableRow(evolutionStages) {
    let names = [];
    for (let j = 0; j < evolutionStages.length; j++) {
      const POKEMON_NAME = evolutionStages[j].name;
      names.push(`<td class="evolution-chain-name">${POKEMON_NAME}</td>`);
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
      const IS_DETAIL_OPEN = !DETAIL_CARD_BOX.classList.contains('d-none');
      if (IS_DETAIL_OPEN && pokemonMoves) {
        for (let j = 0; j < pokemonMoves.length; j++) {
          DETAIL_MOVES_BOX.innerHTML = '';
          DETAIL_MOVES_BOX.innerHTML = `<div>${pokemonMoves.join(', ')}</div>`;
        }
      }
    }
  }