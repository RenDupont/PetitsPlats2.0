
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

  // get list of all ingredient
  const listIngredients = recipes.map((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient)).flat();
  const listUniqueIngredient = [...new Set(listIngredients)];

  // add ingredient list tag to html
  listUniqueIngredient.forEach(ingredient => {
    const listTag = document.getElementById('ingrédients-ListTag');
    const buttonIngredient = document.createElement('button');
    buttonIngredient.innerHTML = ingredient;
    buttonIngredient.classList.add('mainHeader__tag');
    listTag.appendChild(buttonIngredient);
  });

  // get list of all appliance
  const listAppliance = recipes.flatMap((recipe) => recipe.appliance);
  const listUniqueAppliance = [...new Set(listAppliance)];

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
  const tagBtn = document.querySelectorAll('.mainHeader__tag');
  const activetedTag = document.querySelector('.activetedTag');
  tagBtn.forEach(tag => {
    tag.addEventListener('click', function () {
      listTag.push(tag.textContent);
      // eslint-disable-next-line no-undef
      const instanceSearch = searchTest(tag.textContent.toLowerCase(), filteredList);
      filteredList = instanceSearch.advancedSearch();
      clearAndAppendListCard(filteredList);

      addTagToHtml(tag);

      tag.remove();
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
    activetedTag.appendChild(BigTag);

    const SmallTag = document.createElement('span');
    SmallTag.textContent = tag.textContent;
    const grandParentElement = tag.parentElement.parentElement;
    const filterActivetedTag = grandParentElement.querySelector('.mainHeader__activetedTag');
    filterActivetedTag.appendChild(SmallTag);
  }

  // delete tag and search anew
  activetedTag.addEventListener('click', function (event) {
    if (event.target.matches('.activetedTag__tag i')) {
      const clickedTag = event.target.parentNode;
      const tagText = clickedTag.querySelector('span').textContent;
      listTag = listTag.filter(tag => tag !== tagText);
      clickedTag.remove();
      if (listTag.length === 0) {
        const query = document.querySelector('.header__search-bar input').value.toLowerCase();
        if (query !== '' && searched) {
          // eslint-disable-next-line no-undef
          const instanceSearch = searchTest(query, recipes);
          filteredList = instanceSearch.searchMainBar();
          clearAndAppendListCard(filteredList);
        } else {
          filteredList = [...recipes];
          clearAndAppendListCard(filteredList);
        }
      } else {
        newAdvancedSearch(listTag);
      }
    }
  });

  function newAdvancedSearch (list) {
    filteredList = [...recipes];
    list.forEach(tag => {
      // eslint-disable-next-line no-undef
      const instanceSearch = searchTest(tag.toLowerCase(), filteredList);
      filteredList = instanceSearch.advancedSearch();
      clearAndAppendListCard(filteredList);
    });
  }

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
 *
 *
 *
 *
 * implementer les bar de recherche des bouton de filtre
 *
 *
 *
 * implemente le fait que la liste de tag possible change en fonction des recettes restante
 *
 * tester le template
 */
