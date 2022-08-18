import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept();
}

///////////////////////////////////////
const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    searchResultsView.renderSpinner();

    // 1) Get query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Show search results
    await model.getSearchResults(query);

    // 3) Render search results
    // searchResultsView.render(model.state.search.results);
    searchResultsView.render(model.getSearchResultsPage());

    // 4) Pagination
    paginationView.render(model.state.search);
  } catch (error) {
    searchResultsView.renderError();
  }
};

const controlPagination = goToPage => {
  // Render new search results
  searchResultsView.render(model.getSearchResultsPage(goToPage));
  // Render new pagination
  paginationView.render(model.state.search);
};

const init = function () {
  recipeView.addHandleRender(controlRecipes);
  searchView.addHandleSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
