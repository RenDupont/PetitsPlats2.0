
/**
 * manage filter lists (creation, update, ect)
 */
// eslint-disable-next-line no-unused-vars
class Filters {
  constructor (elementId) {
    if (this.constructor === Filters) {
      throw new TypeError('Abstract class "Filters" cannot be instantiated directly');
    }
    this._list = [];
    this._elementId = elementId;
  }

  get list () {
    return this._list;
  }

  set list (newList) {
  }

  addToListTag () {
    const listTag = document.getElementById(this._elementId);
    listTag.innerHTML = '';
    this._list.forEach(item => {
      const button = document.createElement('button');
      button.innerHTML = item;
      button.classList.add('mainHeader__tag');
      listTag.appendChild(button);
    });
  }

  updateFilters (activatedTags) {
    const listTag = document.getElementById(this._elementId);
    const listFilter = listTag.querySelectorAll('button');
    listFilter.forEach(button => {
      const item = button.innerText;
      if (!this._list.includes(item) || activatedTags.includes(item)) {
        button.style.display = 'none';
      } else {
        button.style.display = '';
      }
    });
  }
}
