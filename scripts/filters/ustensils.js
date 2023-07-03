
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
}
