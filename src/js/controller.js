import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async () => {
  const id = window.location.hash.slice(1);
  if (!id) return;
  recipeView.renderSpinner();

  // 1) Loading recipe
  await model.loadRecipe(id);

  // 2) Render recipe
  recipeView.render(model.state.recipe);
};

// Handle hash change (recipe click)
// Handle page load (recipe click)
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipes)
);
