
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
      this._list = newList;
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
}
