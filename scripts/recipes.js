
async function getRecipes () {
  const response = await fetch('../data/recipe.json');
  const recipes = await response.json();
  return [...recipes];
}

document.addEventListener('DOMContentLoaded', async () => {
  const recipes = await getRecipes();
  const sectionRecipe = document.querySelector('.section-recipe');
  const searchBnt = document.querySelector('.header__search-bar button');

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
  const listUstensiles = recipes.map((recipe) => recipe.ustensils);
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
      search(query, 'mainSearchBar');
    }
  });

  let listTag = [];

  // event from filter botton
  const tagBtn = document.querySelectorAll('.mainHeader__tag');
  const activetedTag = document.querySelector('.activetedTag');
  tagBtn.forEach(tag => {
    tag.addEventListener('click', function () {
      listTag.push(tag.textContent);
      console.log(listTag);
      const div = document.createElement('div');
      div.classList.add('activetedTag__tag');
      const createTag = `
                <span>${tag.textContent}</span>
                <i class="fa-solid fa-xmark"></i>
              `;
      div.innerHTML = createTag;
      search(tag.textContent.toLowerCase());
      activetedTag.appendChild(div);
    });
  });

  activetedTag.addEventListener('click', function (event) {
    if (event.target.matches('.activetedTag__tag i')) {
      const clickedTag = event.target.parentNode;
      const tagText = clickedTag.querySelector('span').textContent;
      listTag = listTag.filter(tag => tag !== tagText);
      clickedTag.remove();
      listTag.forEach(tag => {
        filteredList = [...recipes];
        search(tag.toLowerCase());
      });
    }
  });

  let filteredList = [...recipes];

  /**
 * delete and add new filtered list of card
 * @param {Array} newList
 */
  function clearAndAppendListCard (newList) {
    const oldHtmlList = document.querySelector('.section-recipe');
    while (oldHtmlList.firstChild) {
      oldHtmlList.removeChild(oldHtmlList.firstChild);
    }

    newList.forEach(recipe => {
    // eslint-disable-next-line no-undef
      const newRecipeList = new RecipesFactory(recipe);
      const card = newRecipeList.createRecipeCard();
      sectionRecipe.appendChild(card);
    });
  }

  /**
 * search through recipe name, ingredients, and ustensils
 */
  function search (query, from) {
  // main search
    if (from === 'mainSearchBar') {
      filteredList = recipes.filter(function (recipe) {
        return (
          recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(function (list) {
          return list.ingredient.toLowerCase().includes(query);
        }) ||
        recipe.description.toLowerCase().includes(query)
        );
      });
    } else { // filter button search
      filteredList = filteredList.filter(function (recipe) {
        return (
          recipe.appliance.toLowerCase().includes(query) ||
        recipe.ingredients.some(function (list) {
          return list.ingredient.toLowerCase().includes(query);
        }) ||
        recipe.ustensils.some(function (list) {
          return list.toLowerCase().includes(query);
        })
        );
      });
    }

    clearAndAppendListCard(filteredList);
  }
});

/**
 * TODO
 * change icon tag
 * enleve le space-between pour la liste des recettes
 * modifie les padding/margin entre les bouton/tag/recettes
 * ajoute une icon croix pour les bars de recherche
 * implementer les bar de recherche des bouton de filtre
 * ajoute le temps de preparation des card recipe
 * implemente le changement du nombre de recette
 * implemente le fait de pouvoir suprimer un tag
 * implemente le fait que la liste de tag possible change en fonction des recettes restante
 *
 * tester le template
 */
