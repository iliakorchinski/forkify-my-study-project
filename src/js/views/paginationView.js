import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline ');
      if (!btn) return;
      console.log(btn);

      const goToPage = +btn.dataset.goto;
      //   console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateHTML() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    console.log(this._data.page);
    //page1, and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return `
      <button data-goto="${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
      <span>${this._data.page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button> 
      `;
    }

    //last page
    if (this._data.page === numPages && numPages > 1) {
      return `
      <button data-goto="${
        this._data.page - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${this._data.page - 1}</span>
    </button>
      `;
    }
    //other page
    if (this._data.page < numPages) {
      return `
        <button data-goto="${
          this._data.page - 1
        }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${this._data.page - 1}</span>
      </button>

      <button data-goto="${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      <span>${this._data.page + 1}</span>
    </button>
      `;
    }
    //page1, and there are no pages
    return '';
  }
}

export default new PaginationView();
