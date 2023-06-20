
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
  mainSearchBar.value = '';

  // eslint-disable-next-line no-undef
  const ingredients = new Ingredients(recipes);
  ingredients.addIngredientTagtoHtml();

  // get list of all appliance
  const listAppliance = recipes.flatMap((recipe) => recipe.appliance);
  const listUniqueAppliance = [...new Set(listAppliance)];
  listUniqueAppliance.sort(function (a, b) {
    return a.localeCompare(b);
  });

  // add appliance list tag to html
  listUniqueAppliance.forEach(appliance => {
    const listTag = document.getElementById('appliance-ListTag');
    const buttonAppliance = document.createElement('button');
    buttonAppliance.innerHTML = appliance;
    buttonAppliance.classList.add('mainHeader__tag');
    listTag.appendChild(buttonAppliance);
  });

  // get list of all ustensiles
  const listUstensiles = recipes.flatMap((recipe) => recipe.ustensils);
  const listUniqueUstensiles = [...new Set(listUstensiles)];
  listUniqueUstensiles.sort(function (a, b) {
    return a.localeCompare(b);
  });

  // add ustensils list tag to html
  listUniqueUstensiles.forEach(ustensil => {
    const listTag = document.getElementById('ustensiles-ListTag');
    const buttonAppliance = document.createElement('button');
    buttonAppliance.innerHTML = ustensil;
    buttonAppliance.classList.add('mainHeader__tag');
    listTag.appendChild(buttonAppliance);
  });

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
    }
  });

  let listTag = [];

  // event from filter botton
  let tagBtn = document.querySelectorAll('.mainHeader__tag');
  const activetedBigTag = document.querySelector('.activetedTag');
  const activetedSmallTags = document.querySelectorAll('.mainHeader__activetedTags');
  function addEventListenerToTagBtn () {
    tagBtn.forEach(tag => {
      tag.addEventListener('click', function () {
        listTag.push(tag.textContent);
        // eslint-disable-next-line no-undef
        const instanceSearch = searchTest(tag.textContent.toLowerCase(), filteredList);
        filteredList = instanceSearch.advancedSearch();
        clearAndAppendListCard(filteredList);

        addTagToHtml(tag);
        tag.remove();
        uptdateFilterList(filteredList, tag.textContent);
      });
    });
  }
  addEventListenerToTagBtn();

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
  activetedBigTag.addEventListener('click', function (event) {
    if (event.target.matches('.activetedTag__tag i')) {
      const clickedTag = event.target.parentNode;
      const tagText = clickedTag.querySelector('span').textContent;

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
          const instanceSearch = searchTest(query, recipes);
          filteredList = instanceSearch.searchMainBar();
          clearAndAppendListCard(filteredList);
          uptdateFilterList(filteredList);
        } else {
          filteredList = [...recipes];
          clearAndAppendListCard(filteredList);
          uptdateFilterList(filteredList);
        }
      } else {
        newAdvancedSearch(listTag);
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
          if (BigTag.querySelector('span').value === tagText) {
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
          console.log(listTag);
          newAdvancedSearch(listTag, recipe);
        }
      }
    });
  });

  function newAdvancedSearch (list, recipe) {
    filteredList = [...recipe];
    list.forEach(tag => {
      console.log(tag);
      // eslint-disable-next-line no-undef
      const instanceSearch = searchTest(tag.toLowerCase(), filteredList);
      filteredList = instanceSearch.advancedSearch();
      clearAndAppendListCard(filteredList);
      // uptdateFilterList(filteredList);
    });
    console.log(filteredList);
  }

  function uptdateFilterList (list, tag = '') {
    // new ingrediants
    let newIngredientList = list.map((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient)).flat();
    newIngredientList = newIngredientList.filter(ingredient => ingredient !== tag);
    const newListUniqueIngredient = [...new Set(newIngredientList)];
    newListUniqueIngredient.sort(function (a, b) {
      return a.localeCompare(b);
    });

    const ingrédientsListTag = document.getElementById('ingrédients-ListTag');
    while (ingrédientsListTag.firstChild) {
      ingrédientsListTag.removeChild(ingrédientsListTag.firstChild);
    }

    newListUniqueIngredient.forEach(ingredient => {
      const buttonIngredient = document.createElement('button');
      buttonIngredient.innerHTML = ingredient;
      buttonIngredient.classList.add('mainHeader__tag');
      ingrédientsListTag.appendChild(buttonIngredient);
    });

    // new appliances
    let newListAppliance = list.flatMap((recipe) => recipe.appliance);
    newListAppliance = newListAppliance.filter(appliance => appliance !== tag);
    const newListUniqueAppliance = [...new Set(newListAppliance)];
    newListUniqueAppliance.sort(function (a, b) {
      return a.localeCompare(b);
    });

    const applianceListTag = document.getElementById('appliance-ListTag');
    while (applianceListTag.firstChild) {
      applianceListTag.removeChild(applianceListTag.firstChild);
    }

    newListUniqueAppliance.forEach(appliance => {
      const buttonAppliance = document.createElement('button');
      buttonAppliance.innerHTML = appliance;
      buttonAppliance.classList.add('mainHeader__tag');
      applianceListTag.appendChild(buttonAppliance);
    });

    // new ustensiles
    let newListUstensiles = list.flatMap((recipe) => recipe.ustensils);
    newListUstensiles = newListUstensiles.filter(ustensile => ustensile !== tag);
    const newListUniqueUstensiles = [...new Set(newListUstensiles)];
    newListUniqueUstensiles.sort(function (a, b) {
      return a.localeCompare(b);
    });

    const ustensilListTag = document.getElementById('ustensiles-ListTag');
    while (ustensilListTag.firstChild) {
      ustensilListTag.removeChild(ustensilListTag.firstChild);
    }
    newListUniqueUstensiles.forEach(ustensil => {
      const buttonAppliance = document.createElement('button');
      buttonAppliance.innerHTML = ustensil;
      buttonAppliance.classList.add('mainHeader__tag');
      ustensilListTag.appendChild(buttonAppliance);
    });

    // new listener on tag button
    tagBtn = document.querySelectorAll('.mainHeader__tag');
    addEventListenerToTagBtn();
  }

  const secondarySearchBars = document.querySelectorAll('.mainHeader__search-bar input');
  secondarySearchBars.forEach(searchBar => {
    searchBar.addEventListener('keyup', function (event) {
      const input = event.target.value.toLowerCase();
      const grandParentElement = event.target.parentElement.parentElement;
      const list = grandParentElement.querySelectorAll('.mainHeader__tag');
      for (let i = 0; i < list.length; i++) {
        const txtValue = list[i].textContent;
        if (txtValue.toLowerCase().indexOf(input) > -1) {
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

  const inputField = document.querySelector('.header__search-bar input');
  const iconCross = document.querySelector('.header__search-bar span');

  inputField.addEventListener('input', function () {
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
      });
    } else {
      filteredList = [...recipes];
      clearAndAppendListCard(filteredList);
    }
  });
});
/**
 * TODO
 * select et option / regarder attribut
 * regarder export module
 * corriger la suppression des tag dans les dropdown content
 * continuer le responsive
 * séparer les listes ingrédiants/ ustancile et appareils dans des fichier js
 * 2nd version de search en boucle native
 */
