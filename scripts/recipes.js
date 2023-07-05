
let searched = false;

/**
 * get recipes from recipe.json
 * @returns recipes
 */
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

  // create filters
  const ingredients = new Ingredients(recipes);
  ingredients.addToListTag();

  const appliances = new Appliances(recipes);
  appliances.addToListTag();

  const ustensils = new Ustensils(recipes);
  ustensils.addToListTag();

  // add recipe card
  recipes.forEach(recipe => {
    const newRecipe = new RecipesFactory(recipe);
    const card = newRecipe.createRecipeCard();
    sectionRecipe.appendChild(card);
  });

  // event when using main search bar
  searchBnt.addEventListener('click', function (event) {
    event.preventDefault();
    const query = document.querySelector('.header__search-bar input').value.toLowerCase();
    if (query.length >= 3) {
      const instanceSearch = search(query, filteredList);
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

  // event when delete querry from main search bar
  mainSearchBar.addEventListener('input', function () {
    const query = document.querySelector('.header__search-bar input').value.toLowerCase();
    if (query.length < 3 && searched) {
      const errorMessage = document.getElementById('errorMessage');
      searched = false;
      errorMessage.innerText = '';
      if (listTag.length !== 0) {
        listTag.forEach(tag => {
          const instanceSearch = search(tag.toLowerCase(), recipes);
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

  // event for when you select a tag
  const tagBtn = document.querySelectorAll('.mainHeader__tag');
  const activetedBigTag = document.querySelector('.activetedTag');
  const activetedSmallTags = document.querySelectorAll('.mainHeader__activetedTags');
  tagBtn.forEach(tag => {
    tag.addEventListener('click', function () {
      listTag.push(tag.textContent);

      const instanceSearch = search(tag.textContent.toLowerCase(), filteredList);
      filteredList = instanceSearch.advancedSearch();
      clearAndAppendListCard(filteredList);

      addTagToHtml(tag);
      uptdateFilterList(filteredList);
    });
  });

  /**
   * add tag to html when a tag is selected
   * @param {HTMLElement} tag
   */
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

  // event when delete bigTag (in activetedTag) and search anew
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
          const instanceSearch = search(query, recipe);
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

  // event when delete smallTag (in mainHeader__activetedTags) and search anew
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
            const instanceSearch = search(query, recipe);
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

  /**
   * filter the recipe list with existing listTag
   * @param {Array} list
   * @param {Array} recipe
   */
  function newAdvancedSearch (list, recipe) {
    filteredList = recipe;
    console.log(filteredList);
    list.forEach(tag => {
      const instanceSearch = search(tag.toLowerCase(), filteredList);
      filteredList = instanceSearch.advancedSearch();
      clearAndAppendListCard(filteredList);
      uptdateFilterList(filteredList);
    });
  }

  /**
   * update all filters list
   * @param {Array} list
   */
  function uptdateFilterList (list) {
    ingredients.list = list;
    ingredients.updateFilters(listTag);

    appliances.list = list;
    appliances.updateFilters(listTag);

    ustensils.list = list;
    ustensils.updateFilters(listTag);
  }

  // event for searching a specific filter in mainHeader__search-bar
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
      const newRecipeList = new RecipesFactory(recipe);
      const card = newRecipeList.createRecipeCard();
      sectionRecipe.appendChild(card);
    });

    recipeCount.textContent = newList.length + ' recettes';
  }

  // Sélection des éléments nécessaires
  const inputField = document.querySelector('.header__search-bar input');
  const iconCross = document.querySelector('.header__search-bar span');
  const buttonFilters = document.querySelectorAll('.mainHeader__button');
  const dropdownContent = document.querySelectorAll('.mainHeader__dropdown-content');

  // change icon on mouseover or mouseout
  buttonFilters.forEach(btn => {
    const iconChevronUp = btn.querySelector('.fa-chevron-up');
    const iconChevronDown = btn.querySelector('.fa-chevron-down');
    btn.addEventListener('mouseover', function () {
      iconChevronUp.style.display = 'block';
      iconChevronDown.style.display = 'none';
    });
  });

  buttonFilters.forEach(btn => {
    const iconChevronUp = btn.querySelector('.fa-chevron-up');
    const iconChevronDown = btn.querySelector('.fa-chevron-down');
    btn.addEventListener('mouseout', function () {
      iconChevronUp.style.display = 'none';
      iconChevronDown.style.display = 'block';
    });
  });

  dropdownContent.forEach(element => {
    const elementParent = element.parentElement;
    const iconChevronUp = elementParent.querySelector('.fa-chevron-up');
    const iconChevronDown = elementParent.querySelector('.fa-chevron-down');
    element.addEventListener('mouseover', function () {
      iconChevronUp.style.display = 'block';
      iconChevronDown.style.display = 'none';
    });
  });

  dropdownContent.forEach(element => {
    const elementParent = element.parentElement;
    const iconChevronUp = elementParent.querySelector('.fa-chevron-up');
    const iconChevronDown = elementParent.querySelector('.fa-chevron-down');
    element.addEventListener('mouseout', function () {
      iconChevronUp.style.display = 'none';
      iconChevronDown.style.display = 'block';
    });
  });

  // diplay cross icon in main search bar when input not empty
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

  // reset main search when cross icon is clicked
  iconCross.addEventListener('click', function () {
    inputField.value = '';
    iconCross.style.display = 'none';
    searched = false;
    if (listTag.length !== 0) {
      listTag.forEach(tag => {
        const instanceSearch = search(tag.toLowerCase(), recipes);
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
