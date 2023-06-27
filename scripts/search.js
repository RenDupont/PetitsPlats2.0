
// eslint-disable-next-line no-unused-vars
function searchTest (query, recipes) {
  let filteredList = [...recipes];

  function searchMainBar () {
    filteredList = filteredList.filter(function (recipe) {
      return (
        recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.some(function (list) {
              return list.ingredient.toLowerCase().includes(query);
            }) ||
            recipe.description.toLowerCase().includes(query)
      );
    });
    return filteredList;
  }

  /* function searchMainBar () {
    const filteredList = [];

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const lowerCaseName = recipe.name.toLowerCase();
      const lowerCaseDescription = recipe.description.toLowerCase();
      let found = false;

      if (lowerCaseName.includes(query) || lowerCaseDescription.includes(query)) {
        found = true;
      } else {
        for (let j = 0; j < recipe.ingredients.length; j++) {
          const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
          if (ingredient.includes(query)) {
            found = true;
            break;
          }
        }
      }
      if (found) {
        filteredList.push(recipe);
      }
    }
    return filteredList;
  } */

  function advancedSearch () {
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
    return filteredList;
  }
  return { searchMainBar, advancedSearch };
}
