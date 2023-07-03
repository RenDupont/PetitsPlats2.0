
/**
 * manage the ustensil filter list (creation, update, ect)
 */
// eslint-disable-next-line no-unused-vars, no-undef
class Ustensils extends Filters {
  constructor (data) {
    super(data, 'appliance-ListTag');
    const listUstensiles = data.flatMap((recipe) => recipe.ustensils);
    const listUniqueUstensiles = [...new Set(listUstensiles)];
    listUniqueUstensiles.sort(function (a, b) {
      return a.localeCompare(b);
    });
    this._list = listUniqueUstensiles;
  }

  // eslint-disable-next-line accessor-pairs
  set list (newList) {
    if (Array.isArray(newList)) {
      const listUstensiles = newList.flatMap((recipe) => recipe.ustensils);
      const listUniqueUstensiles = [...new Set(listUstensiles)];
      listUniqueUstensiles.sort((a, b) => a.localeCompare(b));
      this._list = listUniqueUstensiles;
    } else {
      console.log('pas un tableau');
    }
  }
}
