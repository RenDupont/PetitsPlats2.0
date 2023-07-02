
/**
 * manage the ustensil filter list (creation, update, ect)
 */
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
      const listUstensiles = newList.flatMap((recipe) => recipe.ustensils);
      const listUniqueUstensiles = [...new Set(listUstensiles)];
      listUniqueUstensiles.sort(function (a, b) {
        return a.localeCompare(b);
      });
      this._list = listUniqueUstensiles;
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

  updateUstensilFilters (activetedTags) {
    const listTag = document.getElementById('ustensiles-ListTag');
    const listFilter = listTag.querySelectorAll('button');
    listFilter.forEach(button => {
      const ustensile = button.innerText;
      if (!this._list.includes(ustensile) || activetedTags.includes(ustensile)) {
        button.style.display = 'none';
      } else {
        button.style.display = '';
      }
    });
  }
}
