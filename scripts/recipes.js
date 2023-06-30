
let searched = false;

async function getRecipes () {
  const response = await fetch('../data/recipe.json');
  const recipes = await response.json();
  return [...recipes];
}

document.addEventListener('DOMContentLoaded', async () => {
  const recipes = await getRecipes();
  const sectionRecipe = document.querySelector('.section-recipe');
  const searchBnt = document.querySelector('.header__search-bar button');
  const mainSearchBar = document.querySelector('.header__search-bar input');

  // eslint-disable-next-line no-undef
  const ingredients = new Ingredients(recipes);
  ingredients.addIngredientTagtoHtml();

  // eslint-disable-next-line no-undef
  const appliances = new Appliances(recipes);
  appliances.addApplianceToHtml();

  // eslint-disable-next-line no-undef
  const ustensils = new Ustensils(recipes);
  ustensils.addUstensilToHtml();

  // add recipe card
  recipes.forEach(recipe => {
    // eslint-disable-next-line no-undef
    const newRecipe = new RecipesFactory(recipe);
    const card = newRecipe.createRecipeCard();
    sectionRecipe.appendChild(card);
  });

  // event from main search bar
  searchBnt.addEventListener('click', function (event) {
    event.preventDefault();
    const query = document.querySelector('.header__search-bar input').value.toLowerCase();
    if (query.length >= 3) {
      // eslint-disable-next-line no-undef
      const instanceSearch = searchTest(query, filteredList);
      filteredList = instanceSearch.searchMainBar();
      clearAndAppendListCard(filteredList);
      searched = true;
      uptdateFilterList(filteredList);
      if (filteredList.length === 0) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.innerText = `Aucune recette ne contient « ${query} » vous pouvez chercher «tarte aux pommes », « poisson », etc.`;
      }
    }
  });

  mainSearchBar.addEventListener('input', function () {
    const query = document.querySelector('.header__search-bar input').value.toLowerCase();
    if (query.length < 3 && searched) {
      const errorMessage = document.getElementById('errorMessage');
      searched = false;
      errorMessage.innerText = '';
      if (listTag.length !== 0) {
        listTag.forEach(tag => {
          // eslint-disable-next-line no-undef
          const instanceSearch = searchTest(tag.toLowerCase(), recipes);
          filteredList = instanceSearch.advancedSearch();
          clearAndAppendListCard(filteredList);
          uptdateFilterList(filteredList);
        });
      } else {
        filteredList = [...recipes];
        clearAndAppendListCard(filteredList);
        uptdateFilterList(filteredList);
      }
    }
  });

  let listTag = [];

  // event from filter botton
  const tagBtn = document.querySelectorAll('.mainHeader__tag');
  const activetedBigTag = document.querySelector('.activetedTag');
  const activetedSmallTags = document.querySelectorAll('.mainHeader__activetedTags');
  tagBtn.forEach(tag => {
    tag.addEventListener('click', function () {
      listTag.push(tag.textContent);
      // eslint-disable-next-line no-undef
      const instanceSearch = searchTest(tag.textContent.toLowerCase(), filteredList);
      filteredList = instanceSearch.advancedSearch();
      clearAndAppendListCard(filteredList);

      addTagToHtml(tag);
      uptdateFilterList(filteredList);
    });
  });

  function addTagToHtml (tag) {
    const BigTag = document.createElement('div');
    BigTag.classList.add('activetedTag__tag');
    const createBigTag = `
              <span>${tag.textContent}</span>
              <i class="fa-solid fa-xmark"></i>
            `;
    BigTag.innerHTML = createBigTag;
    activetedBigTag.appendChild(BigTag);

    const smallTag = document.createElement('div');
    smallTag.classList.add('mainHeader__tag');
    const createSmallTag = `
              <span>${tag.textContent}</span>
              <i class="fa-solid fa-circle-xmark"></i>
            `;
    smallTag.innerHTML = createSmallTag;

    const grandParentElement = tag.parentElement.parentElement;
    const filterActivetedTag = grandParentElement.querySelector('.mainHeader__activetedTags');
    filterActivetedTag.appendChild(smallTag);
  }

  // delete tag and search anew
  // a refactorer
  activetedBigTag.addEventListener('click', async function (event) {
    if (event.target.matches('.activetedTag__tag i')) {
      const clickedTag = event.target.parentNode;
      const tagText = clickedTag.querySelector('span').textContent;
      const recipe = await getRecipes();

      listTag = listTag.filter(tag => tag !== tagText);

      clickedTag.remove();

      const listSmallTags = Array.from(activetedSmallTags).flatMap(element => Array.from(element.children));
      listSmallTags.forEach((smallTag) => {
        if (smallTag.querySelector('span').textContent === tagText) {
          smallTag.remove();
        }
      });

      if (listTag.length === 0) {
        const query = document.querySelector('.header__search-bar input').value.toLowerCase();
        if (query !== '' && searched) {
          // eslint-disable-next-line no-undef
          const instanceSearch = searchTest(query, recipe);
          filteredList = instanceSearch.searchMainBar();
          clearAndAppendListCard(filteredList);
          uptdateFilterList(filteredList);
        } else {
          filteredList = [...recipe];
          clearAndAppendListCard(filteredList);
          uptdateFilterList(filteredList);
        }
      } else {
        newAdvancedSearch(listTag, recipe);
      }
    }
  });

  // à refactorer
  activetedSmallTags.forEach(activetedSmallTag => {
    activetedSmallTag.addEventListener('click', async function (event) {
      if (event.target.matches('.mainHeader__tag i')) {
        const clickedTag = event.target.parentNode;
        const tagText = clickedTag.querySelector('span').textContent;
        const recipe = await getRecipes();

        listTag = listTag.filter(tag => tag !== tagText);

        clickedTag.remove();

        const listBigTag = Array.from(activetedBigTag.children);
        listBigTag.forEach((BigTag) => {
          if (BigTag.querySelector('span').innerText === tagText) {
            BigTag.remove();
          }
        });

        if (listTag.length === 0) {
          const query = document.querySelector('.header__search-bar input').value.toLowerCase();
          if (query !== '' && searched) {
            // eslint-disable-next-line no-undef
            const instanceSearch = searchTest(query, recipe);
            filteredList = instanceSearch.searchMainBar();
            clearAndAppendListCard(filteredList);
            uptdateFilterList(filteredList);
          } else {
            filteredList = [...recipe];
            clearAndAppendListCard(filteredList);
            uptdateFilterList(filteredList);
          }
        } else {
          newAdvancedSearch(listTag, recipe);
        }
      }
    });
  });

  function newAdvancedSearch (list, recipe) {
    filteredList = recipe;
    list.forEach(tag => {
      // eslint-disable-next-line no-undef
      const instanceSearch = searchTest(tag.toLowerCase(), filteredList);
      filteredList = instanceSearch.advancedSearch();
      clearAndAppendListCard(filteredList);
      uptdateFilterList(filteredList);
    });
  }

  function uptdateFilterList (list) {
    ingredients.ingredientsList = list;
    ingredients.updateIngredientFilters(listTag);

    appliances.appliancesList = list;
    appliances.updateApplianceFilters(listTag);

    ustensils.ustensilsList = list;
    ustensils.updateUstensilFilters(listTag);
  }

  const secondarySearchBars = document.querySelectorAll('.mainHeader__search-bar input');
  secondarySearchBars.forEach(searchBar => {
    searchBar.addEventListener('keyup', function (event) {
      const input = event.target.value.toLowerCase();
      const grandParentElement = event.target.parentElement.parentElement;
      const list = grandParentElement.querySelectorAll('.mainHeader__tag');
      for (let i = 0; i < list.length; i++) {
        const txtValue = list[i].textContent.toLowerCase();
        if (txtValue.startsWith(input) || txtValue.includes(' ' + input)) {
          list[i].style.display = '';
        } else {
          list[i].style.display = 'none';
        }
      }
    });
  });

  let filteredList = [...recipes];

  /**
 * delete and add new filtered list of card
 * @param {Array} newList
 */
  function clearAndAppendListCard (newList) {
    const oldHtmlList = document.querySelector('.section-recipe');
    const recipeCount = document.querySelector('.mainHeader__recipeCount');
    while (oldHtmlList.firstChild) {
      oldHtmlList.removeChild(oldHtmlList.firstChild);
    }

    newList.forEach(recipe => {
    // eslint-disable-next-line no-undef
      const newRecipeList = new RecipesFactory(recipe);
      const card = newRecipeList.createRecipeCard();
      sectionRecipe.appendChild(card);
    });

    recipeCount.textContent = newList.length + ' recettes';
  }

  // Sélection des éléments nécessaires
  const inputField = document.querySelector('.header__search-bar input');
  const iconCross = document.querySelector('.header__search-bar span');

  /* const dropdownContent = document.querySelector('.mainHeader__dropdown-content');
  const button = document.querySelector('.mainHeader__button');
  const iconFirst = button.querySelector('i:first-child');
  const iconLast = button.querySelector('i:last-child');

  dropdownContent.addEventListener('mouseover', function () {
    iconFirst.style.display = 'none';
    iconLast.style.display = 'block';
  });

  dropdownContent.addEventListener('mouseout', function () {
    iconFirst.style.display = 'block';
    iconLast.style.display = 'none';
  }); */

  inputField.addEventListener('input', function () {
    if (inputField.value !== '') {
      iconCross.style.display = 'block'; // Affiche l'icône de croix
    } else {
      iconCross.style.display = 'none'; // Cache l'icône de croix
    }
  });

  inputField.addEventListener('click', function () {
    if (inputField.value !== '') {
      iconCross.style.display = 'block'; // Affiche l'icône de croix
    } else {
      iconCross.style.display = 'none'; // Cache l'icône de croix
    }
  });

  iconCross.addEventListener('click', function () {
    inputField.value = '';
    iconCross.style.display = 'none';
    searched = false;
    if (listTag.length !== 0) {
      listTag.forEach(tag => {
        // eslint-disable-next-line no-undef
        const instanceSearch = searchTest(tag.toLowerCase(), recipes);
        filteredList = instanceSearch.advancedSearch();
        clearAndAppendListCard(filteredList);
        uptdateFilterList(filteredList);
      });
    } else {
      filteredList = [...recipes];
      clearAndAppendListCard(filteredList);
      uptdateFilterList(filteredList);
    }
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = '';
  });
});
/**
 * TODO
 * add comments
 */
