
/**
 * appliance filter list
 */
// eslint-disable-next-line no-unused-vars
class Appliances extends Filters {
  constructor (data) {
    super('appliance-ListTag');
    const listAppliance = data.flatMap((recipe) => recipe.appliance);
    const listUniqueAppliance = [...new Set(listAppliance)];
    listUniqueAppliance.sort(function (a, b) {
      return a.localeCompare(b);
    });
    this._list = listUniqueAppliance;
  }

  // eslint-disable-next-line accessor-pairs
  set list (newList) {
    if (Array.isArray(newList)) {
      const listAppliance = newList.flatMap((recipe) => recipe.appliance);
      const listUniqueAppliance = [...new Set(listAppliance)];
      listUniqueAppliance.sort((a, b) => a.localeCompare(b));
      this._list = listUniqueAppliance;
    } else {
      console.log('pas un tableau');
    }
  }
}
