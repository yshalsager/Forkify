import View from './view';
import previewView from './previewView';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'No recipe results found for your search query. Please try another one.';

  _generateHTML() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SearchResultsView();
