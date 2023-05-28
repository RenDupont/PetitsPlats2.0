
// eslint-disable-next-line no-unused-vars
class RecipesFactory {
  constructor (data) {
    this._data = data;
  }

  createRecipeCard () {
    const ingredientsList = this._data.ingredients.map(ingredient => {
      const quantity = ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit || ''}` : '';
      return `<li>${ingredient.ingredient}${quantity}</li>`;
    }).join('');

    const article = document.createElement('article');
    article.classList.add('section-recipe__card');

    const recipeCard = `
          <img class"" src="./assets/Photos P7 JS Les petits plats/${this._data.image}" alt="${this._data.name}">
          <div>
            <h3>${this._data.name}</h3>
            <div>
              <h4>RECETTE</h4>
              <p>${this._data.description}</p>
            </div>
            <div>
              <h4>Ingrédients</h4>
              <ul>
                ${ingredientsList}
              </ul>
            </div>
          </div>
      `;

    article.innerHTML = recipeCard;
    return article;
  }
}
