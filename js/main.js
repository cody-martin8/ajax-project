// Navigation functions

var $pages = document.querySelectorAll('.page');
var $filterNav = document.querySelector('.filter-navigation a');
var $searchNav = document.querySelector('.search-navigation');
var $newRecipeNav = document.querySelector('.new-recipe-navigation');
var $recipeBookNav = document.querySelector('.recipe-book-navigation')
var $filterSave = document.querySelector('.save-filters-button.green-button');
var $returnButton = document.querySelector('.save-filters-button.orange-button');

$recipeBookNav.addEventListener('click', function () {
  for (var i = 0; i < $pages.length; i++) {
    if ($pages[i].dataset.view !== 'recipe-book') {
      $pages[i].className = 'page hidden';
    }
    if ($pages[i].dataset.view === 'recipe-book') {
      $pages[i].className = 'page';
    }
  }
})

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
})

// Search page and Filter page functions

var $searchPage = document.querySelectorAll('.tab');
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

var $queryText = document.querySelector('.query-text');
var $searchButton = document.querySelector('.search-button');
var $searchForm = document.getElementById('recipe-search-form');
var $searchList = document.getElementById('search-result-list');

var $searchListItems;
var searchData = [];

function getRecipes(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.edamam.com/api/recipes/v2?type=public&beta=false&q=' + search.queryText + '&app_id=25ee5a1c&app_key=2e0d886c58ffcac239ddf7ae29b2d302' + search.ingredientsNumber + search.cuisineType + search.mealType + search.dishType);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log(xhr.response);
    var searchId = 0;
    for (var i = 0; i < xhr.response.hits.length; i++) {
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
})

{/* <li class="search-result-item" data-entry-id="#">
  <div class="list-row">
    <div class="list-column">
      <div class="search-result-image">
        <a href="#"><img alt="bruschetta" src="https://imagesvc.meredithcorp.io/v3/"></a>
      </div>
      <div class="search-result-title">
        <a href="#"><h2>Bruschetta</h2></a>
      </div>
    </div>
  </div>
</li> */}

function renderSearchResults(response, searchId) {
  var listItem = document.createElement('li');
  listItem.className = 'search-result-item';

  var listRowDiv = document.createElement('div');
  listRowDiv.className = 'list-row';
  listItem.appendChild(listRowDiv);

  var listColumnDiv = document.createElement('div');
  listColumnDiv.className = 'list-column';
  listRowDiv.appendChild(listColumnDiv);

  var resultImageDiv = document.createElement('div');
  resultImageDiv.className = 'search-result-image';
  listColumnDiv.appendChild(resultImageDiv);

  var resultTitleDiv = document.createElement('div');
  resultTitleDiv.className = 'search-result-title';
  listColumnDiv.appendChild(resultTitleDiv);

  var imageLink = document.createElement('a');
  imageLink.setAttribute('href', '#');
  resultImageDiv.appendChild(imageLink);

  var image = document.createElement('img');
  image.setAttribute('alt', response.recipe.label);
  image.setAttribute('src', response.recipe.image);
  image.setAttribute('data-entry-id', searchId);
  imageLink.appendChild(image);

  var titleLink = document.createElement('a');
  titleLink.setAttribute('href', '#');
  resultTitleDiv.appendChild(titleLink);

  var title = document.createElement('h2');
  title.textContent = response.recipe.label;
  title.setAttribute('data-entry-id', searchId);
  titleLink.appendChild(title);

  return listItem;
}

// Function for getting recipe data by clicking on a search item

var $newRecipeHeading = document.querySelector('.new-recipe-wrapper h1');
var $newRecipeImage = document.querySelector('.new-recipe-wrapper img');
var $newRecipeLink = document.querySelector('.new-recipe-wrapper a');
var $newRecipeIngredients = document.getElementById('new-recipe-ingredients-list');
var newRecipe;

$searchList.addEventListener('click', function viewNewRecipe (event) {
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
})

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
  $savedRecipesList.append(renderSavedRecipes(newRecipe))
  $searchPage[0].className = 'container tab';
  $searchPage[2].className = 'container tab hidden';
})


  // < li class="saved-recipe" data - entry - id="#" >
  //   <div class="list-row">
  //     <div class="list-column">
  //       <div class="saved-recipe-image">
  //         <a href="#"><img alt="bruschetta"
  //           src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2022%2F03%2F19%2F54165-Balsamic-Bruschetta-mfs_002.jpg"></a>
  //       </div>
  //       <div class="saved-recipe-title flex">
  //         <a href="#">
  //           <h2>Bruschetta</h2>
  //         </a>
  //         <a href="#" class="options-icon"><i class="fa-solid fa-ellipsis fa-xl"></i></a>
  //       </div>
  //     </div>
  //   </div>
  // </li >

function renderSavedRecipes(newRecipe) {
  var listItem = document.createElement('li');
  listItem.className = 'saved-recipe';

  var listRowDiv = document.createElement('div');
  listRowDiv.className = 'list-row';
  listItem.appendChild(listRowDiv);

  var listColumnDiv = document.createElement('div');
  listColumnDiv.className = 'list-column';
  listRowDiv.appendChild(listColumnDiv);

  var recipeImageDiv = document.createElement('div');
  recipeImageDiv.className = 'saved-recipe-image';
  listColumnDiv.appendChild(recipeImageDiv);

  var recipeTitleDiv = document.createElement('div');
  recipeTitleDiv.className = 'saved-recipe-title flex';
  listColumnDiv.appendChild(recipeTitleDiv);

  var imageLink = document.createElement('a');
  imageLink.setAttribute('href', '#');
  recipeImageDiv.appendChild(imageLink);

  var image = document.createElement('img');
  image.setAttribute('alt', newRecipe.recipe.label);
  image.setAttribute('src', newRecipe.recipe.image);
  imageLink.appendChild(image);

  var titleLink = document.createElement('a');
  titleLink.setAttribute('href', '#');
  recipeTitleDiv.appendChild(titleLink);

  var title = document.createElement('h2');
  title.textContent = newRecipe.recipe.label;
  titleLink.appendChild(title);

  var iconLink = document.createElement('a');
  iconLink.setAttribute('href', '#');
  iconLink.className = 'options-icon';
  recipeTitleDiv.appendChild(iconLink);

  var icon = document.createElement('i');
  icon.className = 'fa-solid fa-ellipsis fa-xl';
  iconLink.appendChild(icon);

  return listItem;
}
