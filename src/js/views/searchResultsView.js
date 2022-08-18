import View from './view';
import icons from 'url:../../img/icons.svg';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'No recipe resutls found for your search query. Please try another one.';
  _message = '';

  _generateHTML() {
    return this._data.map(result => this._generatePreviewHTML(result)).join('');
  }

  _generatePreviewHTML(result) {
    return `
      <li class="preview">
        <a class="preview__link" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
          </div>
        </a>
      </li>
  `;
  }
}

export default new SearchResultsView();
