
// eslint-disable-next-line no-unused-vars
class Ingredients {
  constructor (data) {
    const listIngredients = data.map((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient)).flat();
    const listUniqueIngredient = [...new Set(listIngredients)];
    listUniqueIngredient.sort(function (a, b) {
      return a.localeCompare(b);
    });
    this._list = listUniqueIngredient;
  }

  get ingredientsList () {
    return this._list;
  }

  set ingredientsList (newList) {
    if (Array.isArray(newList)) {
      const listIngredients = newList.map((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient)).flat();
      const listUniqueIngredient = [...new Set(listIngredients)];
      listUniqueIngredient.sort(function (a, b) {
        return a.localeCompare(b);
      });
      this._list = listUniqueIngredient;
    } else {
      console.log('pas un tableau');
    }
  }

  addIngredientTagtoHtml () {
    this._list.forEach(ingredient => {
      const listTag = document.getElementById('ingrédients-ListTag');
      const buttonIngredient = document.createElement('button');
      buttonIngredient.innerHTML = ingredient;
      buttonIngredient.classList.add('mainHeader__tag');
      listTag.appendChild(buttonIngredient);
    });
  }

  updateIngredientFilters (activetedTags) {
    const listTag = document.getElementById('ingrédients-ListTag');
    const listFilter = listTag.querySelectorAll('button');
    listFilter.forEach(button => {
      const ingredient = button.innerText;
      if (!this._list.includes(ingredient) || activetedTags.includes(ingredient)) {
        button.style.display = 'none';
      } else {
        button.style.display = '';
      }
    });
  }
}
