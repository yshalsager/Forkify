import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import bookmarksView from './views/bookmarksView.js';
import { MODAL_CLOSE_AFTER_SECONDS } from './config.js';

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

    // 0) Update results view to mark the active recipe
    searchResultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
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
  searchResultsView.update(model.getSearchResultsPage(goToPage));
  // Render new pagination
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // Update recipe servings (in the state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // Toggle bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Update bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlLoadBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(
      () => addRecipeView.toggleWindow(),
      MODAL_CLOSE_AFTER_SECONDS * 1000
    );
  } catch (error) {
    addRecipeView.renderError(error.message);
    console.error(error);
  }
};

const init = function () {
  bookmarksView.addHandleLoadBookmarks(controlLoadBookmarks);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandleUpdateServings(controlServings);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandleSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
