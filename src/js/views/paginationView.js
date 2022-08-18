import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _getButtonHTML(page, directon = 'next') {
    return `
      <button class="btn--inline pagination__btn--${directon}" data-goto="${page}">
      ${
        directon === 'prev'
          ? '<svg class="search__icon"><use href="' +
            icons +
            '#icon-arrow-left"></use></svg>'
          : ''
      }
        <span>Page ${page}</span>
        ${
          directon === 'next'
            ? '<svg class="search__icon"><use href="' +
              icons +
              '#icon-arrow-right"></use></svg>'
            : ''
        }
      </button>`;
  }

  _generateHTML() {
    // calculate total pages and round up to the nearest integer
    const currentPage = this._data.page;
    const numberOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there's more than one page
    if (currentPage === 1 && numberOfPages > 1) {
      return this._getButtonHTML(currentPage + 1);
    }

    // Last page
    if (currentPage === numberOfPages && numberOfPages > 1) {
      return this._getButtonHTML(currentPage - 1, 'prev');
    }

    // Other pages
    if (currentPage !== 1 && currentPage < numberOfPages) {
      return (
        this._getButtonHTML(currentPage - 1, 'prev') +
        this._getButtonHTML(currentPage + 1)
      );
    }
    // Page 1 and there's only one page
    return '';
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', event => {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = parseInt(btn.dataset.goto);
      handler(goToPage);
    });
  }
}

export default new PaginationView();
