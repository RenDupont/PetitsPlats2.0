
/**
 * create recipe card
 */
// eslint-disable-next-line no-unused-vars
class RecipesFactory {
  constructor (data) {
    this._data = data;
  }

  createRecipeCard () {
    const ingredientsList = this._data.ingredients.map(ingredient => {
      const quantity = ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit || ''}` : '';
      return `<div class="section-recipe__cardIngredient">
                <span>${ingredient.ingredient}</span>
                <span>${quantity}</span>
              </div>`;
    }).join('');

    const article = document.createElement('article');
    article.classList.add('section-recipe__card');

    const recipeCard = `
          <img src="./assets/Photos P7 JS Les petits plats/${this._data.image}" alt="${this._data.name}">
          <div class="section-recipe__time">
            <span>${this._data.time}min</span>
          </div>
          <div class="section-recipe__cardContent">
            <h3>${this._data.name}</h3>
            <div class="section-recipe__cardRecette">
              <h4>RECETTE</h4>
              <p>${this._data.description}</p>
            </div>
            <div class="section-recipe__cardListIngredients">
              <h4>Ingrédients</h4>
              <div class="section-recipe__cardIngredients">
                ${ingredientsList}
              </div>
            </div>
          </div>
      `;

    article.innerHTML = recipeCard;
    return article;
  }
}
