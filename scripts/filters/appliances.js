
/**
 * manage the appliance filter list (creation, update, ect)
 */
// eslint-disable-next-line no-unused-vars, no-undef
class Appliances extends Filters {
  constructor (data) {
    super(data, 'appliance-ListTag');
    const listAppliance = data.flatMap((recipe) => recipe.appliance);
    const listUniqueAppliance = [...new Set(listAppliance)];
    listUniqueAppliance.sort(function (a, b) {
      return a.localeCompare(b);
    });
    this._list = listUniqueAppliance;
  }
}
