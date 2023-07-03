/**
 * ingredient filter list
 */
// eslint-disable-next-line no-undef, no-unused-vars
class Ingredients extends Filters {
  constructor (data) {
    super(data, 'ingrédients-ListTag');
    const listIngredients = data.map((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase())).flat();
    const listUniqueIngredient = [...new Set(listIngredients)];
    listUniqueIngredient.sort(function (a, b) {
      return a.localeCompare(b);
    });
    this._list = listUniqueIngredient;
  }
}
