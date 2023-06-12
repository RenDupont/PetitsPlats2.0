
// eslint-disable-next-line no-unused-vars
function searchTest (query, recipes) {
  let filteredList = recipes;

  console.log(filteredList, '1');
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
    console.log(filteredList, '2');
    return filteredList;
  }
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
