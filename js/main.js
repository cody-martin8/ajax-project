// Navigation functions

const $pages = document.querySelectorAll('main > .page');
const $filterNav = document.querySelector('.filter-navigation a');
const $searchNav = document.querySelector('.search-navigation');
const $createRecipeNav = document.querySelector('.create-recipe-navigation');
const $recipeBookNav = document.querySelector('.recipe-book-navigation');
const $filterSave = document.querySelector('.save-filters-button.green-button');
const $returnButton = document.querySelector('.save-filters-button.orange-button');
const $savedRecipesTab = document.querySelectorAll('.saved-recipes-tab');
const $createdRecipesTab = document.querySelectorAll('.created-recipes-tab');
const $recipeBookTabs = document.querySelectorAll('.row.tab');

$recipeBookNav.addEventListener('click', function () {
  recipeBookNav();
  returnToRecipeBook();
});

function recipeBookNav() {
  for (let i = 0; i < $pages.length; i++) {
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
  for (let i = 0; i < $pages.length; i++) {
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
  for (let i = 0; i < $pages.length; i++) {
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

function retrieveRecipes(recipeId, savedRecipeId) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.edamam.com/api/recipes/v2/' + recipeId + '?type=public&app_id=25ee5a1c&app_key=2e0d886c58ffcac239ddf7ae29b2d302');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status); // eslint-disable-line no-console
    console.log(xhr.response); // eslint-disable-line no-console
    const newRecipe = xhr.response;
    newRecipe.savedRecipeId = savedRecipeId;
    $savedRecipesList.appendChild(renderSavedRecipes(newRecipe)); // eslint-disable-line
    for (let i = 0; i < data.savedRecipes.length; i++) {
      if (data.savedRecipes[i].savedRecipeId === newRecipe.savedRecipeId) {
        data.savedRecipes[i].recipe.image = newRecipe.recipe.image;
      }
    }
  });
  xhr.send();
}

window.addEventListener('DOMContentLoaded', function loadJournal() {
  for (let i = 0; i < data.savedRecipes.length; i++) {
    const recipeId = data.savedRecipes[i].recipe.uri.split('_');
    const savedRecipeId = data.savedRecipes[i].savedRecipeId;
    retrieveRecipes(recipeId[1], savedRecipeId);
  }

  for (let i = 0; i < data.createdRecipes.length; i++) {
    $createdRecipesList.appendChild(renderCreatedRecipes(data.createdRecipes[i])); // eslint-disable-line
  }
});

// Search page and Filter page functions

const $searchPage = document.querySelectorAll('#recipe-search-form .container.tab');
const $clearFiltersButton = document.querySelector('.clear-filters');
const $filters = document.querySelectorAll('.filter-dropdown');

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
  for (let i = 0; i < $filters.length; i++) {
    $filters[i].value = $filters[i][0];
  }
}

$clearFiltersButton.addEventListener('click', clearFilters);

// Submitting Search parameters to API

const $searchForm = document.getElementById('recipe-search-form');
const $searchList = document.getElementById('search-result-list');

let searchData = [];

function getRecipes(search) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.edamam.com/api/recipes/v2?type=public&beta=false&q=' + search.queryText + '&app_id=25ee5a1c&app_key=2e0d886c58ffcac239ddf7ae29b2d302' + search.ingredientsNumber + search.cuisineType + search.mealType + search.dishType);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status); // eslint-disable-line no-console
    console.log(xhr.response); // eslint-disable-line no-console
    let searchId = 0;
    for (let i = 0; i < xhr.response.hits.length; i++) {
      $searchList.append(renderSearchResults(xhr.response.hits[i], searchId)); // eslint-disable-line
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
  const search = {};
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

const $newRecipeHeading = document.querySelector('.new-recipe-wrapper h1');
const $newRecipeImage = document.querySelector('.new-recipe-wrapper img');
const $newRecipeLink = document.querySelector('.new-recipe-wrapper a');
const $newRecipeIngredients = document.getElementById('new-recipe-ingredients-list');
let newRecipe;

$searchList.addEventListener('click', function viewNewRecipe(event) {
  while ($newRecipeIngredients.firstChild) {
    $newRecipeIngredients.removeChild($newRecipeIngredients.firstChild);
  }
  for (let i = 0; i < searchData[0].length; i++) {
    if (i.toString() === event.target.dataset.entryId) {
      newRecipe = searchData[0][i];
    }
  }
  $newRecipeHeading.textContent = newRecipe.recipe.label;
  $newRecipeImage.alt = newRecipe.recipe.label;
  $newRecipeImage.src = newRecipe.recipe.image;
  $newRecipeLink.href = newRecipe.recipe.url;
  for (let n = 0; n < newRecipe.recipe.ingredients.length; n++) {
    const ingredient = document.createElement('li');
    const ingredientText = document.createElement('p');
    ingredientText.textContent = newRecipe.recipe.ingredients[n].text;
    ingredient.appendChild(ingredientText);
    ingredient.className = 'ingredient';
    $newRecipeIngredients.appendChild(ingredient);
  }
  $searchPage[0].className = 'container tab hidden';
  $searchPage[2].className = 'container tab';
});

// Clicking Save Recipe button

const $saveRecipe = document.querySelector('.save-recipe-button');
const $savedRecipesList = document.getElementById('saved-recipes-list');

$saveRecipe.addEventListener('click', function saveRecipe() {
  for (let i = 0; i < data.savedRecipes.length; i++) {
    if (newRecipe.recipe === data.savedRecipes[i].recipe) {
      $searchPage[0].className = 'container tab';
      $searchPage[2].className = 'container tab hidden';
      return;
    }
  }
  newRecipe.savedRecipeId = data.nextSavedRecipeId;
  data.savedRecipes.push(newRecipe);
  data.nextSavedRecipeId++;
  $savedRecipesList.append(renderSavedRecipes(newRecipe)); // eslint-disable-line
  $searchPage[0].className = 'container tab';
  $searchPage[2].className = 'container tab hidden';
});

const $recipeBookPageNav = document.querySelectorAll('.container.page');
const $addNotesHeading = document.querySelector('.add-notes-wrapper h1');
const $addNotesImage = document.querySelector('.add-notes-wrapper img');
const $addNotesLink = document.querySelector('.add-notes-wrapper a');
const $addNotesIngredients = document.getElementById('add-notes-ingredients-list');

const $notesArea = document.querySelector('.notes');
const $saveNotes = document.querySelector('.save-notes-button');
const $cancelNotes = document.querySelector('.cancel-notes-button');

const $savedRecipeHeading = document.querySelector('.view-saved-recipe-wrapper h1');
const $savedRecipeImage = document.querySelector('.view-saved-recipe-wrapper img');
const $savedRecipeLink = document.querySelector('.view-saved-recipe-wrapper a');
const $savedRecipeIngredients = document.getElementById('view-saved-recipe-ingredients-list');
const $savedRecipeNotes = document.querySelector('.view-saved-recipe-notes p');
const $returnSavedButton = document.querySelector('.return-saved-button');

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
  for (let i = 0; i < data.savedRecipes.length; i++) {
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
    for (let n = 0; n < data.editing.recipe.ingredients.length; n++) {
      const ingredient = document.createElement('li');
      const ingredientText = document.createElement('p');
      ingredientText.textContent = data.editing.recipe.ingredients[n].text;
      ingredient.appendChild(ingredientText);
      ingredient.className = 'ingredient';
      $savedRecipeIngredients.appendChild(ingredient);
    }
    viewSavedRecipe();
  }
});

// Open and Close Options Menu
$savedRecipesList.addEventListener('click', function openOptionsMenu(event) {
  event.preventDefault();
  for (let i = 1; i - 1 < data.savedRecipes.length; i++) {
    if ($savedRecipesList.childNodes[i].querySelector('.options-menu.hidden') === null) {
      const close = $savedRecipesList.childNodes[i].querySelector('.options-menu');
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

const $body = document.body;
const $overlay = document.querySelector('.overlay');
const $deleteRecipeModalWrapper = document.querySelector('.delete-recipe-modal-wrapper');
const $deleteRecipeModal = document.querySelector('.delete-recipe-modal');

$savedRecipesList.addEventListener('click', function openAddNotes(event) {
  for (let i = 0; i < data.savedRecipes.length; i++) {
    if (String(data.savedRecipes[i].savedRecipeId) === event.target.dataset.entryId) {
      data.editing = data.savedRecipes[i];
    }
  }

  // Add Notes Button for Saved Recipes
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
    for (let n = 0; n < data.editing.recipe.ingredients.length; n++) {
      const ingredient = document.createElement('li');
      const ingredientText = document.createElement('p');
      ingredientText.textContent = data.editing.recipe.ingredients[n].text;
      ingredient.appendChild(ingredientText);
      ingredient.className = 'ingredient';
      $addNotesIngredients.appendChild(ingredient);
    }
    notesPageNav();
  }

  // Delete Button for Saved Recipes
  if (event.target.matches('.delete-button')) {
    for (let i = 0; i < data.savedRecipes.length; i++) {
      if (String(data.savedRecipes[i].savedRecipeId) === event.target.dataset.entryId) {
        data.editing = data.savedRecipes[i];
      }
    }
    const savedRecipes = $savedRecipesList.children;
    for (let i = 0; i < savedRecipes.length; i++) {
      savedRecipes[i].firstChild.firstChild.className = 'list-column';
    }
    $body.className = 'modal-open';
    $overlay.className = 'overlay';
    $deleteRecipeModalWrapper.className = 'delete-recipe-modal-wrapper';
    $deleteRecipeModal.className = 'delete-recipe-modal';
  }
});

function confirmDelete() {
  for (let i = 0; i < data.savedRecipes.length; i++) {
    if (data.editing.savedRecipeId === data.savedRecipes[i].savedRecipeId) {
      data.savedRecipes.splice(i, 1);
    }
  }
  const savedRecipe = document.querySelectorAll('li.saved-recipe');
  for (let i = 0; i < savedRecipe.length; i++) {
    if (String(data.editing.savedRecipeId) === savedRecipe[i].firstChild.firstChild.firstChild.firstChild.firstChild.dataset.entryId) {
      savedRecipe[i].remove();
    }
  }
  data.editing = null;
  closeModal();
}

function closeModal() {
  const savedRecipes = $savedRecipesList.children;
  for (let i = 0; i < savedRecipes.length; i++) {
    savedRecipes[i].firstChild.firstChild.className = 'list-column relative';
  }
  $body.className = '';
  $overlay.className = 'overlay hidden';
  $deleteRecipeModalWrapper.className = 'delete-recipe-modal-wrapper hidden';
  $deleteRecipeModal.className = 'delete-recipe-modal hidden';
}

const $confirmDeleteButton = document.querySelector('.confirm-delete-button');
$confirmDeleteButton.addEventListener('click', confirmDelete);

const $cancelButton = document.querySelector('.cancel-button');
$cancelButton.addEventListener('click', closeModal);

$saveNotes.addEventListener('click', function saveNotes() {
  data.editing.notes = $notesArea.value;
  for (let i = 0; i < data.savedRecipes.length; i++) {
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

const $createRecipeImage = document.querySelector('.create-recipe-image');
const $createRecipeTitle = document.querySelector('.create-recipe-title');
const $photoUrl = document.querySelector('.create-recipe-image-url');

$photoUrl.addEventListener('input', function inputImage(event) {
  event.preventDefault();
  $createRecipeImage.setAttribute('src', event.target.value);
});

const $createIngredientsList = document.getElementById('create-ingredients-list');
const $createDirectionsList = document.getElementById('create-directions-list');
const $addIngredientInput = document.querySelector('.add-ingredient-input');
const $addDirectionsInput = document.querySelector('.add-directions-input');
const $removeIngredientInput = document.querySelector('.remove-ingredient-input');
const $removeDirectionsInput = document.querySelector('.remove-directions-input');

$addIngredientInput.addEventListener('click', function () {
  event.preventDefault();
  $createIngredientsList.append(renderIngrInput()); // eslint-disable-line
});

$addDirectionsInput.addEventListener('click', function () {
  event.preventDefault();
  $createDirectionsList.append(renderDirInput()); // eslint-disable-line
});

$removeIngredientInput.addEventListener('click', function () {
  event.preventDefault();
  const ingrInputs = $createIngredientsList.querySelectorAll('li');
  if (ingrInputs.length > 1) {
    ingrInputs[ingrInputs.length - 1].remove();
  }
});

$removeDirectionsInput.addEventListener('click', function () {
  event.preventDefault();
  const dirInputs = $createDirectionsList.querySelectorAll('li');
  if (dirInputs.length > 1) {
    dirInputs[dirInputs.length - 1].remove();
  }
});

const $createRecipe = document.getElementById('create-recipe-form');
const $createdRecipesList = document.getElementById('created-recipes-list');
const $cancelRecipeButton = document.querySelector('.cancel-recipe-button');
const $createRecipeHeader = document.querySelector('#create-recipe-form h1');

$createRecipe.addEventListener('submit', function inputCreateRecipe(event) {
  event.preventDefault();
  if (data.editing === null) {

    // New Create Recipes
    const createRecipe = {};
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
    $createdRecipesList.prepend(renderCreatedRecipes(createRecipe)); // eslint-disable-line
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
        const createdRecipes = document.querySelectorAll('li.created-recipe');
        createdRecipes[n].replaceWith(renderCreatedRecipes(data.createdRecipes[n])); // eslint-disable-line
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
  for (let i = 0; i < data.createdRecipes.length; i++) {
    if ($createdRecipesList.children[i].querySelector('.options-menu.hidden') === null) {
      const close = $createdRecipesList.children[i].querySelector('.options-menu');
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

const $deleteCreatedRecipeModalWrapper = document.querySelector('.delete-created-recipe-modal-wrapper');
const $deleteCreatedRecipeModal = document.querySelector('.delete-created-recipe-modal');

$createdRecipesList.addEventListener('click', function openEditRecipe(event) {
  for (let i = 0; i < data.createdRecipes.length; i++) {
    if (String(data.createdRecipes[i].createdRecipeId) === event.target.dataset.entryId) {
      data.editing = data.createdRecipes[i];
    }
  }

  // Edit Button for Created Recipes
  if (event.target.matches('.edit-button')) {
    $createRecipeHeader.textContent = 'Edit Recipe';
    $createRecipeImage.alt = data.editing.title;
    $createRecipeImage.src = data.editing.photoUrl;
    $createRecipeTitle.value = data.editing.title;
    $photoUrl.value = data.editing.photoUrl;
    let ingrInputs = $createIngredientsList.querySelectorAll('li');
    while (ingrInputs.length > 1) {
      ingrInputs[ingrInputs.length - 1].remove();
      ingrInputs = $createIngredientsList.querySelectorAll('li');
    }
    for (let x = 1; x < data.editing.ingredients.length; x++) {
      $createIngredientsList.append(renderIngrInput()); // eslint-disable-line
    }
    ingrInputs = $createIngredientsList.querySelectorAll('li');
    for (let a = 0; a < data.editing.ingredients.length; a++) {
      ingrInputs[a].firstElementChild.value = data.editing.ingredients[a];
    }

    let dirInputs = $createDirectionsList.querySelectorAll('li');
    while (dirInputs.length > 1) {
      dirInputs[dirInputs.length - 1].remove();
      dirInputs = $createDirectionsList.querySelectorAll('li');
    }
    for (let y = 1; y < data.editing.directions.length; y++) {
      $createDirectionsList.append(renderDirInput()); // eslint-disable-line
    }
    dirInputs = $createDirectionsList.querySelectorAll('li');
    for (let b = 0; b < data.editing.directions.length; b++) {
      dirInputs[b].firstElementChild.value = data.editing.directions[b];
    }
    createRecipeNav();
    returnToRecipeBook();
  }

  // Delete Button for Created Recipes
  if (event.target.matches('.delete-button')) {
    for (let i = 0; i < data.createdRecipes.length; i++) {
      if (String(data.createdRecipes[i].createdRecipeId) === event.target.dataset.entryId) {
        data.editing = data.createdRecipes[i];
      }
    }
    const createdRecipes = $createdRecipesList.children;
    for (let i = 0; i < createdRecipes.length; i++) {
      createdRecipes[i].firstChild.firstChild.className = 'list-column';
    }
    $body.className = 'modal-open';
    $overlay.className = 'overlay';
    $deleteCreatedRecipeModalWrapper.className = 'delete-created-recipe-modal-wrapper';
    $deleteCreatedRecipeModal.className = 'delete-created-recipe-modal';
  }
});

function confirmCreatedRecipeDelete() {
  for (let i = 0; i < data.createdRecipes.length; i++) {
    if (data.editing.createdRecipeId === data.createdRecipes[i].createdRecipeId) {
      data.createdRecipes.splice(i, 1);
    }
  }
  const createdRecipe = document.querySelectorAll('li.created-recipe');
  for (let i = 0; i < createdRecipe.length; i++) {
    if (String(data.editing.createdRecipeId) === createdRecipe[i].firstChild.firstChild.firstChild.firstChild.firstChild.dataset.entryId) {
      createdRecipe[i].remove();
    }
  }
  data.editing = null;
  closeCreatedRecipeModal();
}

function closeCreatedRecipeModal() {
  const createdRecipes = $createdRecipesList.children;
  for (let i = 0; i < createdRecipes.length; i++) {
    createdRecipes[i].firstChild.firstChild.className = 'list-column relative';
  }
  $body.className = '';
  $overlay.className = 'overlay hidden';
  $deleteCreatedRecipeModalWrapper.className = 'delete-created-recipe-modal-wrapper hidden';
  $deleteCreatedRecipeModal.className = 'delete-created-recipe-modal hidden';
}

const $confirmDeleteButtonCreatedRecipe = document.querySelector('.confirm-delete-button-created-recipe');
$confirmDeleteButtonCreatedRecipe.addEventListener('click', confirmCreatedRecipeDelete);

const $cancelButtonCreatedRecipe = document.querySelector('.cancel-button-created-recipe');
$cancelButtonCreatedRecipe.addEventListener('click', closeCreatedRecipeModal);

const $createdRecipeHeading = document.querySelector('.view-created-recipe-wrapper h1');
const $createdRecipeIngredients = document.getElementById('view-created-recipe-ingredients-list');
const $createdRecipeDirections = document.getElementById('view-created-recipe-directions-list');
const $createdRecipeImage = document.querySelector('.view-created-recipe-wrapper img');
const $returnCreatedButton = document.querySelector('.return-created-button');

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
  for (let i = 0; i < data.createdRecipes.length; i++) {
    if (String(data.createdRecipes[i].savedRecipeId) === event.target.dataset.entryId) {
      data.editing = data.createdRecipes[i];
    }
  }
  if (event.target.matches('.created-recipe-image img') || event.target.matches('.created-recipe-title h2')) {
    $createdRecipeHeading.textContent = data.editing.title;
    $createdRecipeImage.alt = data.editing.title;
    $createdRecipeImage.src = data.editing.photoUrl;
    for (let n = 0; n < data.editing.ingredients.length; n++) {
      const ingredient = document.createElement('li');
      const ingredientText = document.createElement('p');
      ingredientText.textContent = data.editing.ingredients[n];
      ingredient.appendChild(ingredientText);
      ingredient.className = 'ingredient';
      $createdRecipeIngredients.appendChild(ingredient);
    }
    for (let m = 0; m < data.editing.directions.length; m++) {
      const direction = document.createElement('li');
      const directionText = document.createElement('p');
      directionText.textContent = data.editing.directions[m];
      direction.appendChild(directionText);
      direction.className = 'direction';
      $createdRecipeDirections.appendChild(direction);
    }
    viewCreatedRecipe();
  }
});
