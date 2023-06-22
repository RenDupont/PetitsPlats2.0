
// eslint-disable-next-line no-unused-vars
class Appliances {
  constructor (data) {
    const listAppliance = data.flatMap((recipe) => recipe.appliance);
    const listUniqueAppliance = [...new Set(listAppliance)];
    listUniqueAppliance.sort(function (a, b) {
      return a.localeCompare(b);
    });
    this._list = listUniqueAppliance;
  }

  get appliancesList () {
    return this._list;
  }

  set appliancesList (newList) {
    if (Array.isArray(newList)) {
      this._list = newList;
    } else {
      console.log('pas un tableau');
    }
  }

  addApplianceToHtml () {
    this._list.forEach(appliance => {
      const listTag = document.getElementById('appliance-ListTag');
      const buttonAppliance = document.createElement('button');
      buttonAppliance.innerHTML = appliance;
      buttonAppliance.classList.add('mainHeader__tag');
      listTag.appendChild(buttonAppliance);
    });
  }
}
