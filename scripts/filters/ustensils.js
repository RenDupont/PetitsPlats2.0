
// eslint-disable-next-line no-unused-vars
class Ustensils {
  constructor (data) {
    const listUstensiles = data.flatMap((recipe) => recipe.ustensils);
    const listUniqueUstensiles = [...new Set(listUstensiles)];
    listUniqueUstensiles.sort(function (a, b) {
      return a.localeCompare(b);
    });
    this._list = listUniqueUstensiles;
  }

  get ustensilsList () {
    return this._list;
  }

  set ustensilsList (newList) {
    if (Array.isArray(newList)) {
      this._list = newList;
    } else {
      console.log('pas un tableau');
    }
  }

  addUstensilToHtml () {
    this._list.forEach(ustensil => {
      const listTag = document.getElementById('ustensiles-ListTag');
      const buttonAppliance = document.createElement('button');
      buttonAppliance.innerHTML = ustensil;
      buttonAppliance.classList.add('mainHeader__tag');
      listTag.appendChild(buttonAppliance);
    });
  }
}
