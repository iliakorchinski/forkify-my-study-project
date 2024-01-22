import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import paginationView from './views/paginationView.js';

import 'core-js/stable'; //polyfiling everything
import 'regenerator-runtime/runtime'; //polifyling async/await
import { async } from 'regenerator-runtime/runtime'; //polifyling async/await
import bookmarksView from './views/bookmarksView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();
    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //rendering recipe
    recipeView.render(model.state.recipe);
    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1) get search results
    const query = searchView.getQuery();
    if (!query) return;

    //2) load search results
    await model.loadSearchResults(query);

    console.log(model.state.search.results);
    //3) render results
    resultsView.render(model.getSearchResultsPage(1));
    //4) render pagination
    paginationView.render(model.state.search);
    searchView.clearSearchField();
  } catch (err) {
    recipeView.renderError('No founds for your query');
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add/remove bookmarh
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);
  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmars
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarsk = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddrecipe = async function (newRecipeData) {
  try {
    addRecipeView.renderSpinner();
    // console.log(newRecipeData);
    await model.uploadRecipe(newRecipeData);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderSuccess();

    bookmarksView.render(model.state.bookmarks);

    //change id in the URL
    window.history.pushState(null, '', `${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// controlSearchResults();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarsk);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView._addHandlerFormSubmission(controlAddrecipe);
};

init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
