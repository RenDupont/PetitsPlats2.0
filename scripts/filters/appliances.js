
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
      const listAppliance = newList.flatMap((recipe) => recipe.appliance);
      const listUniqueAppliance = [...new Set(listAppliance)];
      listUniqueAppliance.sort(function (a, b) {
        return a.localeCompare(b);
      });
      this._list = listUniqueAppliance;
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

  updateAppliancefilters (activetedTags) {
    const listTag = document.getElementById('appliance-ListTag');
    const listFilter = listTag.querySelectorAll('button');
    listFilter.forEach(button => {
      const appliance = button.innerText;
      if (!this._list.includes(appliance) || activetedTags.includes(appliance)) {
        button.style.display = 'none';
      } else {
        button.style.display = '';
      }
    });
  }
}
