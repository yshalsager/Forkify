import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  console.log(data);
  return {
    id: data.id,
    title: data.title,
    publisher: data.publisher,
    sourceUrl: data.source_url,
    image: data.image_url,
    servings: data.servings,
    cookingTime: data.cooking_time,
    ingredients: data.ingredients,
    // conditionally add key property if it exists
    ...(data.key && { key: data.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    const { recipe } = data.data;
    state.recipe = createRecipeObject(recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log(state.recipe);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearchResults = async query => {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  return state.search.results.slice(
    (page - 1) * state.search.resultsPerPage,
    page * state.search.resultsPerPage
  );
};

export const updateServings = function (newServings = state.recipe.servings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      ingredient.quantity * (newServings / state.recipe.servings);
  });
  state.recipe.servings = newServings;
};

const storeBookmarks = () =>
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

const loadBookmarks = () =>
  (state.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []);

export const addBookmark = recipe => {
  // Add recipe to bookmarks
  state.bookmarks.push(recipe);
  // Mark recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  storeBookmarks();
};

export const removeBookmark = recipeID => {
  // Remove recipe from bookmarks
  state.bookmarks.splice(
    state.bookmarks.findIndex(recipe => recipe.id === recipeID),
    1
  );
  // Mark recipe as not bookmarked
  if (recipeID === state.recipe.id) state.recipe.bookmarked = false;
  storeBookmarks();
};

export const uploadRecipe = async recipe => {
  try {
    const ingredients = Object.entries(recipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArray = ingredient[1]
          .split(',')
          .map(element => element.trim());
        if (ingredientArray.length !== 3)
          throw new Error(
            'Invalid ingredient format! Please use the correct one.'
          );
        const [quantity, unit, description] = ingredientArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const newRecipe = {
      title: recipe.title,
      publisher: recipe.publisher,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      servings: +recipe.servings,
      cooking_time: +recipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, newRecipe);
    state.recipe = createRecipeObject(data.data.recipe);
    addBookmark(state.recipe);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const init = () => {
  loadBookmarks();
};

init();
