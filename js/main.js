/* global renderSavedRecipes, renderCreatedRecipes, renderSearchResults, renderIngrInput, renderDirInput */
/* eslint no-undef: "error" */

// Navigation functions

var $pages = document.querySelectorAll('main > .page');
var $filterNav = document.querySelector('.filter-navigation a');
var $searchNav = document.querySelector('.search-navigation');
var $createRecipeNav = document.querySelector('.create-recipe-navigation');
var $recipeBookNav = document.querySelector('.recipe-book-navigation');
var $filterSave = document.querySelector('.save-filters-button.green-button');
var $returnButton = document.querySelector('.save-filters-button.orange-button');
var $savedRecipesTab = document.querySelectorAll('.saved-recipes-tab');
var $createdRecipesTab = document.querySelectorAll('.created-recipes-tab');
var $recipeBookTabs = document.querySelectorAll('.row.tab');

$recipeBookNav.addEventListener('click', function () {
  recipeBookNav();
  returnToRecipeBook();
});

function recipeBookNav() {
  for (var i = 0; i < $pages.length; i++) {
    if ($pages[i].dataset.view !== 'recipe-book') {
      $pages[i].className = 'page hidden';
    }
    if ($pages[i].dataset.view === 'recipe-book') {
      $pages[i].className = 'page';
    }
  }
}

function recipeBookSavedTab() {
  $recipeBookTabs[0].className = 'row tab';
  $recipeBookTabs[1].className = 'row tab hidden';
}

function recipeBookCreatedTab() {
  $recipeBookTabs[0].className = 'row tab hidden';
  $recipeBookTabs[1].className = 'row tab';
}

$savedRecipesTab[0].addEventListener('click', function () {
  recipeBookSavedTab();
});

$savedRecipesTab[1].addEventListener('click', function () {
  recipeBookSavedTab();
});

$createdRecipesTab[0].addEventListener('click', function () {
  recipeBookCreatedTab();
});

$createdRecipesTab[1].addEventListener('click', function () {
  recipeBookCreatedTab();
});

$searchNav.addEventListener('click', function () {
  for (var i = 0; i < $pages.length; i++) {
    if ($pages[i].dataset.view !== 'search-form') {
      $pages[i].className = 'page hidden';
    }
    if ($pages[i].dataset.view === 'search-form') {
      $pages[i].className = 'page';
    }
  }
  $searchPage[0].className = 'container tab';
  $searchPage[1].className = 'container tab hidden';
  $searchPage[2].className = 'container tab hidden';
});

function createRecipeNav() {
  for (var i = 0; i < $pages.length; i++) {
    if ($pages[i].dataset.view !== 'create-recipe-page') {
      $pages[i].className = 'page hidden';
    }
    if ($pages[i].dataset.view === 'create-recipe-page') {
      $pages[i].className = 'page';
    }
  }
}

$createRecipeNav.addEventListener('click', function () {
  createRecipeNav();
});

// Upon page reload (local storage)

window.addEventListener('DOMContentLoaded', function loadJournal() {
  for (let i = 0; i < data.savedRecipes.length; i++) {
    $savedRecipesList.appendChild(renderSavedRecipes(data.savedRecipes[i]));
  }

  for (let i = 0; i < data.createdRecipes.length; i++) {
    $createdRecipesList.appendChild(renderCreatedRecipes(data.createdRecipes[i]));
  }

  // if (data.view === 'entry-form') {
  //   $entryForm[0].className = 'page';
  //   $entryForm[1].className = 'page hidden';
  // }
  // if (data.view === 'entries') {
  //   $entryForm[0].className = 'page hidden';
  //   $entryForm[1].className = 'page';
  // }

});

// Search page and Filter page functions

var $searchPage = document.querySelectorAll('#recipe-search-form .container.tab');
var $clearFiltersButton = document.querySelector('.clear-filters');
var $filters = document.querySelectorAll('.filter-dropdown');

$filterNav.addEventListener('click', function () {
  $searchPage[0].className = 'container tab hidden';
  $searchPage[1].className = 'container tab';
});

$filterSave.addEventListener('click', function () {
  $searchPage[1].className = 'container tab hidden';
  $searchPage[0].className = 'container tab';
});

$returnButton.addEventListener('click', function () {
  clearFilters();
  $searchPage[1].className = 'container tab hidden';
  $searchPage[0].className = 'container tab';
});

function clearFilters() {
  for (var i = 0; i < $filters.length; i++) {
    $filters[i].value = $filters[i][0];
  }
}

$clearFiltersButton.addEventListener('click', clearFilters);

// Submitting Search parameters to API

// var $queryText = document.querySelector('.query-text');
// var $searchButton = document.querySelector('.search-button');
var $searchForm = document.getElementById('recipe-search-form');
var $searchList = document.getElementById('search-result-list');

// var $searchListItems;
var searchData = [];

function getRecipes(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.edamam.com/api/recipes/v2?type=public&beta=false&q=' + search.queryText + '&app_id=25ee5a1c&app_key=2e0d886c58ffcac239ddf7ae29b2d302' + search.ingredientsNumber + search.cuisineType + search.mealType + search.dishType);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status); // eslint-disable-line no-console
    console.log(xhr.response); // eslint-disable-line no-console
    var searchId = 0;
    for (var i = 0; i < xhr.response.hits.length; i++) {
      console.log(xhr.response.hits[i]); // eslint-disable-line no-console
      $searchList.append(renderSearchResults(xhr.response.hits[i], searchId));
      searchId++;
    }
    searchData.push(xhr.response.hits);
  });
  xhr.send();
}

// Clicking the Search button on the Search page

$searchForm.addEventListener('submit', function searchRecipes(event) {
  event.preventDefault();
  while ($searchList.firstChild) {
    $searchList.removeChild($searchList.firstChild);
  }
  searchData = [];
  var search = {};
  search.queryText = $searchForm[0].value;
  if ($searchForm[3].value !== '') {
    search.mealType = '&mealType=' + $searchForm[3].value;
  } else {
    search.mealType = '';
  }
  if ($searchForm[4].value !== '') {
    search.ingredientsNumber = '&ingr=' + $searchForm[4].value;
  } else {
    search.ingredientsNumber = '';
  }
  if ($searchForm[5].value !== '') {
    search.dishType = '&dishType=' + $searchForm[5].value;
  } else {
    search.dishType = '';
  }
  if ($searchForm[6].value !== '') {
    search.cuisineType = '&cuisineType=' + $searchForm[6].value;
  } else {
    search.cuisineType = '';
  }

  getRecipes(search);
});

// Function for getting recipe data by clicking on a search item

var $newRecipeHeading = document.querySelector('.new-recipe-wrapper h1');
var $newRecipeImage = document.querySelector('.new-recipe-wrapper img');
var $newRecipeLink = document.querySelector('.new-recipe-wrapper a');
var $newRecipeIngredients = document.getElementById('new-recipe-ingredients-list');
var newRecipe;

$searchList.addEventListener('click', function viewNewRecipe(event) {
  while ($newRecipeIngredients.firstChild) {
    $newRecipeIngredients.removeChild($newRecipeIngredients.firstChild);
  }
  for (var i = 0; i < searchData[0].length; i++) {
    if (i.toString() === event.target.dataset.entryId) {
      newRecipe = searchData[0][i];
    }
  }
  $newRecipeHeading.textContent = newRecipe.recipe.label;
  $newRecipeImage.alt = newRecipe.recipe.label;
  $newRecipeImage.src = newRecipe.recipe.image;
  $newRecipeLink.href = newRecipe.recipe.url;
  for (var n = 0; n < newRecipe.recipe.ingredients.length; n++) {
    var ingredient = document.createElement('li');
    var ingredientText = document.createElement('p');
    ingredientText.textContent = newRecipe.recipe.ingredients[n].text;
    ingredient.appendChild(ingredientText);
    ingredient.className = 'ingredient';
    $newRecipeIngredients.appendChild(ingredient);
  }
  $searchPage[0].className = 'container tab hidden';
  $searchPage[2].className = 'container tab';
});

// Clicking Save Recipe button

var $saveRecipe = document.querySelector('.save-recipe-button');
var $savedRecipesList = document.getElementById('saved-recipes-list');

$saveRecipe.addEventListener('click', function saveRecipe() {
  for (var i = 0; i < data.savedRecipes.length; i++) {
    if (newRecipe.recipe === data.savedRecipes[i].recipe) {
      $searchPage[0].className = 'container tab';
      $searchPage[2].className = 'container tab hidden';
      return;
    }
  }
  newRecipe.savedRecipeId = data.nextSavedRecipeId;
  data.savedRecipes.push(newRecipe);
  data.nextSavedRecipeId++;
  $savedRecipesList.append(renderSavedRecipes(newRecipe));
  $searchPage[0].className = 'container tab';
  $searchPage[2].className = 'container tab hidden';
});

var $recipeBookPageNav = document.querySelectorAll('.container.page');
var $addNotesHeading = document.querySelector('.add-notes-wrapper h1');
var $addNotesImage = document.querySelector('.add-notes-wrapper img');
var $addNotesLink = document.querySelector('.add-notes-wrapper a');
var $addNotesIngredients = document.getElementById('add-notes-ingredients-list');

var $notesArea = document.querySelector('.notes');
var $saveNotes = document.querySelector('.save-notes-button');
var $cancelNotes = document.querySelector('.cancel-notes-button');

var $savedRecipeHeading = document.querySelector('.view-saved-recipe-wrapper h1');
var $savedRecipeImage = document.querySelector('.view-saved-recipe-wrapper img');
var $savedRecipeLink = document.querySelector('.view-saved-recipe-wrapper a');
var $savedRecipeIngredients = document.getElementById('view-saved-recipe-ingredients-list');
var $savedRecipeNotes = document.querySelector('.view-saved-recipe-notes p');
var $returnSavedButton = document.querySelector('.return-saved-button');

function notesPageNav() {
  $recipeBookPageNav[0].className = 'container page hidden';
  $recipeBookPageNav[1].className = 'container page';
}

function viewSavedRecipe() {
  $recipeBookPageNav[0].className = 'container page hidden';
  $recipeBookPageNav[2].className = 'container page';
}

function viewCreatedRecipe() {
  $recipeBookPageNav[0].className = 'container page hidden';
  $recipeBookPageNav[3].className = 'container page';
}

function returnToRecipeBook() {
  $recipeBookPageNav[0].className = 'container page';
  $recipeBookPageNav[1].className = 'container page hidden';
  $recipeBookPageNav[2].className = 'container page hidden';
  $recipeBookPageNav[3].className = 'container page hidden';
}

// Open View Saved Recipe page and populate values
$savedRecipesList.addEventListener('click', function openAddNotes(event) {
  while ($savedRecipeIngredients.firstChild) {
    $savedRecipeIngredients.removeChild($savedRecipeIngredients.firstChild);
  }
  for (var i = 0; i < data.savedRecipes.length; i++) {
    if (String(data.savedRecipes[i].savedRecipeId) === event.target.dataset.entryId) {
      data.editing = data.savedRecipes[i];
    }
  }
  if (event.target.matches('.saved-recipe-image img') || event.target.matches('.saved-recipe-title h2')) {
    $savedRecipeHeading.textContent = data.editing.recipe.label;
    $savedRecipeImage.alt = data.editing.recipe.label;
    $savedRecipeImage.src = data.editing.recipe.image;
    $savedRecipeLink.href = data.editing.recipe.url;
    if (data.editing.notes !== undefined) {
      $savedRecipeNotes.textContent = data.editing.notes;
    }
    for (var n = 0; n < data.editing.recipe.ingredients.length; n++) {
      var ingredient = document.createElement('li');
      var ingredientText = document.createElement('p');
      ingredientText.textContent = data.editing.recipe.ingredients[n].text;
      ingredient.appendChild(ingredientText);
      ingredient.className = 'ingredient';
      $savedRecipeIngredients.appendChild(ingredient);
    }
    viewSavedRecipe();
  }
});

// Open (if and else if statement) and Close (else statement) Options Menu
$savedRecipesList.addEventListener('click', function openOptionsMenu(event) {
  event.preventDefault();
  for (var i = 1; i - 1 < data.savedRecipes.length; i++) {
    if ($savedRecipesList.childNodes[i].querySelector('.options-menu.hidden') === null) {
      var close = $savedRecipesList.childNodes[i].querySelector('.options-menu');
      close.className = 'options-menu hidden';
    }
  }
  if (event.target.matches('.saved-recipe i.fa-ellipsis')) {
    const recipeDivs = event.target.closest('.list-column');
    recipeDivs.childNodes[2].className = 'options-menu';
  } else if (event.target.matches('.saved-recipe i.fa-xmark')) {
    const recipeDivs = event.target.closest('.list-column');
    recipeDivs.childNodes[2].className = 'options-menu hidden';
  }
});

$returnSavedButton.addEventListener('click', function () {
  returnToRecipeBook();
  data.editing = null;
});

// Open Add Notes page from Options Menu and populate values
$savedRecipesList.addEventListener('click', function openAddNotes(event) {
  for (var i = 0; i < data.savedRecipes.length; i++) {
    if (String(data.savedRecipes[i].savedRecipeId) === event.target.dataset.entryId) {
      data.editing = data.savedRecipes[i];
    }
  }
  if (event.target.matches('.notes-button')) {
    while ($addNotesIngredients.firstChild) {
      $addNotesIngredients.removeChild($addNotesIngredients.firstChild);
    }
    $addNotesHeading.textContent = data.editing.recipe.label;
    $addNotesImage.alt = data.editing.recipe.label;
    $addNotesImage.src = data.editing.recipe.image;
    $addNotesLink.href = data.editing.recipe.url;
    if (data.editing.notes !== undefined) {
      $notesArea.value = data.editing.notes;
    }
    for (var n = 0; n < data.editing.recipe.ingredients.length; n++) {
      var ingredient = document.createElement('li');
      var ingredientText = document.createElement('p');
      ingredientText.textContent = data.editing.recipe.ingredients[n].text;
      ingredient.appendChild(ingredientText);
      ingredient.className = 'ingredient';
      $addNotesIngredients.appendChild(ingredient);
    }
    notesPageNav();
  }
  if (event.target.matches('.delete-button')) {
    console.log('Delete Recipe'); // eslint-disable-line no-console
    // To be used in Issue 6
  }
});

$saveNotes.addEventListener('click', function saveNotes() {
  data.editing.notes = $notesArea.value;
  for (var i = 0; i < data.savedRecipes.length; i++) {
    if (data.savedRecipes[i].savedRecipeId === data.editing.savedRecipeId) {
      data.savedRecipes[i] = data.editing;
    }
  }
  $notesArea.value = '';
  returnToRecipeBook();
  data.editing = null;
});

$cancelNotes.addEventListener('click', function cancelNotes() {
  $notesArea.value = '';
  returnToRecipeBook();
  data.editing = null;
});

var $createRecipeImage = document.querySelector('.create-recipe-image');
var $createRecipeTitle = document.querySelector('.create-recipe-title');
var $photoUrl = document.querySelector('.create-recipe-image-url');
// var $ingredients = document.querySelector('#create-ingredients-list');
// var $directions = document.querySelector('#create-directions-list');

$photoUrl.addEventListener('input', function inputImage(event) {
  event.preventDefault();
  $createRecipeImage.setAttribute('src', event.target.value);
});

var $createIngredientsList = document.getElementById('create-ingredients-list');
var $createDirectionsList = document.getElementById('create-directions-list');
var $addIngredientInput = document.querySelector('.add-ingredient-input');
var $addDirectionsInput = document.querySelector('.add-directions-input');
var $removeIngredientInput = document.querySelector('.remove-ingredient-input');
var $removeDirectionsInput = document.querySelector('.remove-directions-input');

$addIngredientInput.addEventListener('click', function () {
  event.preventDefault();
  $createIngredientsList.append(renderIngrInput());
});

$addDirectionsInput.addEventListener('click', function () {
  event.preventDefault();
  $createDirectionsList.append(renderDirInput());
});

$removeIngredientInput.addEventListener('click', function () {
  event.preventDefault();
  var ingrInputs = $createIngredientsList.querySelectorAll('li');
  if (ingrInputs.length > 1) {
    ingrInputs[ingrInputs.length - 1].remove();
  }
});

$removeDirectionsInput.addEventListener('click', function () {
  event.preventDefault();
  var dirInputs = $createDirectionsList.querySelectorAll('li');
  if (dirInputs.length > 1) {
    dirInputs[dirInputs.length - 1].remove();
  }
});

var $createRecipe = document.getElementById('create-recipe-form');
var $createdRecipesList = document.getElementById('created-recipes-list');
var $cancelRecipeButton = document.querySelector('.cancel-recipe-button');
var $createRecipeHeader = document.querySelector('#create-recipe-form h1');

$createRecipe.addEventListener('submit', function inputCreateRecipe(event) {
  event.preventDefault();
  if (data.editing === null) {

    // New Create Recipes
    var createRecipe = {};
    createRecipe.ingredients = [];
    createRecipe.directions = [];
    createRecipe.title = event.target[0].value;
    createRecipe.photoUrl = event.target[1].value;
    for (let i = 2; i < event.target.length - 2; i++) {
      if (event.target[i].className === 'ingredient create-recipe-input') {
        createRecipe.ingredients.push(event.target[i].value);
      }
      if (event.target[i].className === 'directions create-recipe-textarea') {
        createRecipe.directions.push(event.target[i].value);
      }
    }
    createRecipe.createdRecipeId = data.nextCreatedRecipeId;
    $createdRecipesList.prepend(renderCreatedRecipes(createRecipe));
    data.nextCreatedRecipeId++;
    data.createdRecipes.unshift(createRecipe);
    $createRecipeImage.setAttribute('src', 'images/placeholder-image-square.jpg');
    $createRecipe.reset();
    recipeBookNav();
  } else {

    // Edited Recipes
    $createRecipeHeader.textContent = 'Create Recipe';
    data.editing.ingredients = [];
    data.editing.directions = [];
    data.editing.title = event.target[0].value;
    data.editing.photoUrl = event.target[1].value;
    for (let i = 2; i < event.target.length - 2; i++) {
      if (event.target[i].className === 'ingredient create-recipe-input') {
        data.editing.ingredients.push(event.target[i].value);
      }
      if (event.target[i].className === 'directions create-recipe-textarea') {
        data.editing.directions.push(event.target[i].value);
      }
    }

    for (let n = 0; n < data.createdRecipes.length; n++) {
      if (data.editing.createdRecipeId === data.createdRecipes[n].createdRecipeId) {
        data.createdRecipes[n] = data.editing;
        var createdRecipes = document.querySelectorAll('li.created-recipe');
        createdRecipes[n].replaceWith(renderCreatedRecipes(data.createdRecipes[n]));
      }
    }
    data.editing = null;
    $createRecipeImage.setAttribute('src', 'images/placeholder-image-square.jpg');
    $createRecipe.reset();
    recipeBookNav();
  }
});

$createdRecipesList.addEventListener('click', function openOptionsMenu(event) {
  event.preventDefault();
  for (var i = 0; i < data.createdRecipes.length; i++) {
    if ($createdRecipesList.children[i].querySelector('.options-menu.hidden') === null) {
      var close = $createdRecipesList.children[i].querySelector('.options-menu');
      close.className = 'options-menu hidden';
    }
  }
  if (event.target.matches('.created-recipe i.fa-ellipsis')) {
    const recipeDivs = event.target.closest('.list-column');
    recipeDivs.childNodes[2].className = 'options-menu';
  } else if (event.target.matches('.created-recipe i.fa-xmark')) {
    const recipeDivs = event.target.closest('.list-column');
    recipeDivs.childNodes[2].className = 'options-menu hidden';
  }
});

$cancelRecipeButton.addEventListener('click', function cancelRecipe() {
  $createRecipe.reset();
  recipeBookNav();
});

$createdRecipesList.addEventListener('click', function openEditRecipe(event) {
  for (var i = 0; i < data.createdRecipes.length; i++) {
    if (String(data.createdRecipes[i].createdRecipeId) === event.target.dataset.entryId) {
      data.editing = data.createdRecipes[i];
    }
  }
  if (event.target.matches('.edit-button')) {
    $createRecipeHeader.textContent = 'Edit Recipe';
    $createRecipeImage.alt = data.editing.title;
    $createRecipeImage.src = data.editing.photoUrl;
    $createRecipeTitle.value = data.editing.title;
    $photoUrl.value = data.editing.photoUrl;
    var ingrInputs = $createIngredientsList.querySelectorAll('li');
    while (ingrInputs.length > 1) {
      ingrInputs[ingrInputs.length - 1].remove();
      ingrInputs = $createIngredientsList.querySelectorAll('li');
    }
    for (var x = 1; x < data.editing.ingredients.length; x++) {
      $createIngredientsList.append(renderIngrInput());
    }
    ingrInputs = $createIngredientsList.querySelectorAll('li');
    for (var a = 0; a < data.editing.ingredients.length; a++) {
      ingrInputs[a].firstElementChild.value = data.editing.ingredients[a];
    }

    var dirInputs = $createDirectionsList.querySelectorAll('li');
    while (dirInputs.length > 1) {
      dirInputs[dirInputs.length - 1].remove();
      dirInputs = $createDirectionsList.querySelectorAll('li');
    }
    for (var y = 1; y < data.editing.directions.length; y++) {
      $createDirectionsList.append(renderDirInput());
    }
    dirInputs = $createDirectionsList.querySelectorAll('li');
    for (var b = 0; b < data.editing.directions.length; b++) {
      dirInputs[b].firstElementChild.value = data.editing.directions[b];
    }
    createRecipeNav();
    returnToRecipeBook();
  }
  if (event.target.matches('.delete-button')) {
    console.log('Delete this recipe!'); // eslint-disable-line no-console
  }
});

var $createdRecipeHeading = document.querySelector('.view-created-recipe-wrapper h1');
var $createdRecipeIngredients = document.getElementById('view-created-recipe-ingredients-list');
var $createdRecipeDirections = document.getElementById('view-created-recipe-directions-list');
var $createdRecipeImage = document.querySelector('.view-created-recipe-wrapper img');
var $returnCreatedButton = document.querySelector('.return-created-button');

$returnCreatedButton.addEventListener('click', function () {
  returnToRecipeBook();
  data.editing = null;
});

// Open View Created Recipe page and populate values
$createdRecipesList.addEventListener('click', function openCreatedRecipe(event) {
  while ($createdRecipeIngredients.firstChild) {
    $createdRecipeIngredients.removeChild($createdRecipeIngredients.firstChild);
  }
  while ($createdRecipeDirections.firstChild) {
    $createdRecipeDirections.removeChild($createdRecipeDirections.firstChild);
  }
  for (var i = 0; i < data.createdRecipes.length; i++) {
    if (String(data.createdRecipes[i].savedRecipeId) === event.target.dataset.entryId) {
      data.editing = data.createdRecipes[i];
    }
  }
  if (event.target.matches('.created-recipe-image img') || event.target.matches('.created-recipe-title h2')) {
    $createdRecipeHeading.textContent = data.editing.title;
    $createdRecipeImage.alt = data.editing.title;
    $createdRecipeImage.src = data.editing.photoUrl;
    for (var n = 0; n < data.editing.ingredients.length; n++) {
      var ingredient = document.createElement('li');
      var ingredientText = document.createElement('p');
      ingredientText.textContent = data.editing.ingredients[n];
      ingredient.appendChild(ingredientText);
      ingredient.className = 'ingredient';
      $createdRecipeIngredients.appendChild(ingredient);
    }
    for (var m = 0; m < data.editing.directions.length; m++) {
      var direction = document.createElement('li');
      var directionText = document.createElement('p');
      directionText.textContent = data.editing.directions[m];
      direction.appendChild(directionText);
      direction.className = 'direction';
      $createdRecipeDirections.appendChild(direction);
    }
    viewCreatedRecipe();
  }
});
