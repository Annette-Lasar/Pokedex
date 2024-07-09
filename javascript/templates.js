function generatePokemonGalleryHTML(i, currentPokemon) {
  return /* html */ `
         <div id="pokemon_card_${i}" class="pokemon-card" onclick="turnCard(${i})" onmouseover="moveImageToCenter(${i})" onmouseout="moveImageToSide(${i})">
          <div id="pokemon_content_wrapper_frontface_${i}" class="pokemon-content-wrapper-frontface">       
              <div class="pokemon-image-container">
                <img id="current_pokemon_symbol_${i}" class="current-pokemon-symbol" src="../symbols/types/type_normal_opaque.png" alt=""></img>
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

function generateMorePokemonsAndToTopButtonHTML() {
  return /* html */ `
        <button id="back_to_top_button" class="back-to-top-button">
          <a href="#top"><img src="./symbols/arrow_up.svg" alt=""></a>
        </button>
        <button id="more_pokemons_button" 
            onclick="setNewOffForMorePokemons()" 
            class="more-pokemons-button">
            More Pokemons
        </button>
        <button id="to_bottom_button" onclick="scrollLastCardIntoView()" class="to-bottom-button">
          <div class="bottom-button-img-wrapper"><img src="./symbols/arrow_up.svg" alt=""></div>
        </button>
    `;
}

function generateBackFaceContentHTML(i, currentPokemon) {
  return /* html */ `
      <h2 class="pokemon-name">${currentPokemon.name}</h2>
      <p id="pokemon_info_text${i}" class="pokemon-info-text">Description of this Pokemon.</p>
      <button id="show_details_button" class="show-details-button background-radial-gradient" data-index="${i}" onclick="openCard(${i})">Details</button>
    `;
}

function generateDetailCardBoxHTML(i, currentPokemon) {
  return /* html */ `
      <div id="pokemon_detail_card${i}" class="pokemon-detail-card">
        <div class="detail-card-icon-wrapper">
        <div class="arrow-wrapper">
          <img src="./symbols/arrow-left.svg" onclick="showPreviousCard(${i})">
          <img src="./symbols/arrow-right.svg" onclick="showNextCard(${i})">
        </div>
        <div class="x-close" onclick="closeDetailView()">
          <img src="./symbols/x-close.svg" alt="">
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
              <div id="moves_content" class="content moves-content">Content for Moves tab</div>
            </div>
          </div>
        </div>
      </div>
    `;
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
          <td colspan="2" class="ability-box">${pokemonAbilities.join(
            ', '
          )}</td>
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

function generateStatisticsTableHTML(j, POKEMON_STAT_NAME, POKEMON_STAT_VALUE) {
  return /* html */ `
      <tr>
          <td>${POKEMON_STAT_NAME}</td>
          <td class="progress-container">
            <span class="progress-label">${POKEMON_STAT_VALUE}</span>
            <progress id="progress_bar_${j}" value="${Math.round(
              (POKEMON_STAT_VALUE / 150) * 100)}" max="100"></progress>
          </td>
      </tr>
      `;
}
