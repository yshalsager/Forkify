import View from './view';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was uploaded successfully';
  _windowElement = document.querySelector('.add-recipe-window');
  _overlayElement = document.querySelector('.overlay');
  _addRecipeOpenBtnElement = document.querySelector('.nav__btn--add-recipe');
  _addRecipeCloseBtnElement = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleWindow() {
    [this._overlayElement, this._windowElement].forEach(element =>
      element.classList.toggle('hidden')
    );
  }

  _uploadRecipe() {
    const recipe = {
      title: this._windowElement.querySelector('input[name="title"]').value,
      publisher: this._windowElement.querySelector('input[name="publisher"]')
        .value,
      sourceUrl: this._windowElement.querySelector('input[name="sourceUrl"]')
        .value,
      image: this._windowElement.querySelector('input[name="image"]').value,
      servings: this._windowElement.querySelector('input[name="servings"]')
        .value,
      cookingTime: this._windowElement.querySelector(
        'input[name="cookingTime"]'
      ).value,
    };
    console.log(recipe);
  }

  _addHandlerShowWindow() {
    this._addRecipeOpenBtnElement.addEventListener(
      'click',
      this.toggleWindow.bind(this)
    );
  }

  _addHandlerCloseWindow() {
    [this._addRecipeCloseBtnElement, this._overlayElement].forEach(element => {
      element.addEventListener('click', this.toggleWindow.bind(this));
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', event => {
      event.preventDefault();
      console.log('upload');
      const formData = Object.fromEntries([
        ...new FormData(this._parentElement),
      ]);
      handler(formData);
    });
  }

  _generateHTML() {}
}

export default new AddRecipeView();
