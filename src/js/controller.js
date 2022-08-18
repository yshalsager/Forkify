import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

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

const init = function () {
  recipeView.addHandleRender(controlRecipes);
};
init();
