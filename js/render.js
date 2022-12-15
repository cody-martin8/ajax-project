// <li class="search-result-item" data-entry-id="#">
//   <div class="list-row">
//     <div class="list-column">
//       <div class="search-result-image">
//         <a href="#"><img alt="bruschetta" src="https://imagesvc.meredithcorp.io/v3/"></a>
//       </div>
//       <div class="search-result-title">
//         <a href="#"><h2>Bruschetta</h2></a>
//       </div>
//     </div>
//   </div>
// </li>

function renderSearchResults(response, searchId) { // eslint-disable-line
  const listItem = document.createElement('li');
  listItem.className = 'search-result-item';

  const listRowDiv = document.createElement('div');
  listRowDiv.className = 'list-row';
  listItem.appendChild(listRowDiv);

  const listColumnDiv = document.createElement('div');
  listColumnDiv.className = 'list-column';
  listRowDiv.appendChild(listColumnDiv);

  const resultImageDiv = document.createElement('div');
  resultImageDiv.className = 'search-result-image';
  listColumnDiv.appendChild(resultImageDiv);

  const resultTitleDiv = document.createElement('div');
  resultTitleDiv.className = 'search-result-title';
  listColumnDiv.appendChild(resultTitleDiv);

  const imageLink = document.createElement('a');
  imageLink.setAttribute('href', '#');
  resultImageDiv.appendChild(imageLink);

  const image = document.createElement('img');
  image.setAttribute('alt', response.recipe.label);
  image.setAttribute('src', response.recipe.image);
  image.setAttribute('data-entry-id', searchId);
  imageLink.appendChild(image);

  const titleLink = document.createElement('a');
  titleLink.setAttribute('href', '#');
  resultTitleDiv.appendChild(titleLink);

  const title = document.createElement('h2');
  title.textContent = response.recipe.label;
  title.setAttribute('data-entry-id', searchId);
  titleLink.appendChild(title);

  return listItem;
}

// < li class="saved-recipe" data - entry - id="#" >
//   <div class="list-row">
//     <div class="list-column relative">
//       <div class="saved-recipe-image">
//         <a href="#"><img alt="bruschetta"
//           src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2022%2F03%2F19%2F54165-Balsamic-Bruschetta-mfs_002.jpg"></a>
//       </div>
//       <div class="saved-recipe-title flex-space-between">
//         <a href="#">
//           <h2>Bruschetta</h2>
//         </a>
//         <a href="#" class="options-icon"><i class="fa-solid fa-ellipsis fa-xl"></i></a>
//       </div>
//       <div class="options-menu hidden">
//         <div class="justify-right padding-right" >
//           <a href="#"><i class="fa-solid fa-xmark"></i></a>
//         </div >
//         <a href='#' class='notes-navigation'><p class="notes-button theme-font-color">Notes</p></a>
//         <a href='#' class='delete-saved-recipe'><p class="delete-button warning-font-color">Delete</p></a>
//       </div >
//     </div>
//   </div>
// </li >

function renderSavedRecipes(newRecipe) { // eslint-disable-line
  const listItem = document.createElement('li');
  listItem.className = 'saved-recipe';

  const listRowDiv = document.createElement('div');
  listRowDiv.className = 'list-row';
  listItem.appendChild(listRowDiv);

  const listColumnDiv = document.createElement('div');
  listColumnDiv.className = 'list-column relative';
  listRowDiv.appendChild(listColumnDiv);

  const recipeImageDiv = document.createElement('div');
  recipeImageDiv.className = 'saved-recipe-image';
  listColumnDiv.appendChild(recipeImageDiv);

  const recipeTitleDiv = document.createElement('div');
  recipeTitleDiv.className = 'saved-recipe-title flex-space-between';
  listColumnDiv.appendChild(recipeTitleDiv);

  const optionsMenu = document.createElement('div');
  optionsMenu.className = 'options-menu hidden';
  listColumnDiv.appendChild(optionsMenu);

  const imageLink = document.createElement('a');
  imageLink.setAttribute('href', '#');
  recipeImageDiv.appendChild(imageLink);

  const image = document.createElement('img');
  image.setAttribute('alt', newRecipe.recipe.label);
  image.setAttribute('src', newRecipe.recipe.image);
  image.setAttribute('data-entry-id', newRecipe.savedRecipeId);
  imageLink.appendChild(image);

  const titleLink = document.createElement('a');
  titleLink.setAttribute('href', '#');
  recipeTitleDiv.appendChild(titleLink);

  const title = document.createElement('h2');
  title.textContent = newRecipe.recipe.label;
  title.setAttribute('data-entry-id', newRecipe.savedRecipeId);
  titleLink.appendChild(title);

  const iconLink = document.createElement('a');
  iconLink.setAttribute('href', '#');
  iconLink.className = 'options-icon';
  recipeTitleDiv.appendChild(iconLink);

  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-ellipsis fa-xl';
  iconLink.appendChild(icon);

  const closingIconDiv = document.createElement('div');
  closingIconDiv.className = 'justify-right padding-right';
  optionsMenu.appendChild(closingIconDiv);

  const closingIconLink = document.createElement('a');
  closingIconLink.setAttribute('href', '#');
  closingIconLink.className = 'closing-options-icon';
  closingIconDiv.appendChild(closingIconLink);

  const closingIcon = document.createElement('i');
  closingIcon.className = 'fa-solid fa-xmark';
  closingIconLink.appendChild(closingIcon);

  const notesLink = document.createElement('a');
  notesLink.setAttribute('href', '#');
  notesLink.className = 'notes-navigation';
  optionsMenu.appendChild(notesLink);

  const notesText = document.createElement('p');
  notesText.className = 'notes-button theme-font-color';
  notesText.textContent = 'Notes';
  notesText.setAttribute('data-entry-id', newRecipe.savedRecipeId);
  notesLink.appendChild(notesText);

  const deleteLink = document.createElement('a');
  deleteLink.setAttribute('href', '#');
  deleteLink.className = 'delete-saved-recipe';
  optionsMenu.appendChild(deleteLink);

  const deleteText = document.createElement('p');
  deleteText.className = 'delete-button warning-font-color';
  deleteText.textContent = 'Delete';
  deleteText.setAttribute('data-entry-id', newRecipe.savedRecipeId);
  deleteLink.appendChild(deleteText);

  return listItem;
}

// Reference renderSavedRecipes for sample HTML structure
function renderCreatedRecipes(newRecipe) { // eslint-disable-line
  const listItem = document.createElement('li');
  listItem.className = 'created-recipe';

  const listRowDiv = document.createElement('div');
  listRowDiv.className = 'list-row';
  listItem.appendChild(listRowDiv);

  const listColumnDiv = document.createElement('div');
  listColumnDiv.className = 'list-column relative';
  listRowDiv.appendChild(listColumnDiv);

  const recipeImageDiv = document.createElement('div');
  recipeImageDiv.className = 'created-recipe-image';
  listColumnDiv.appendChild(recipeImageDiv);

  const recipeTitleDiv = document.createElement('div');
  recipeTitleDiv.className = 'created-recipe-title flex-space-between';
  listColumnDiv.appendChild(recipeTitleDiv);

  const optionsMenu = document.createElement('div');
  optionsMenu.className = 'options-menu hidden';
  listColumnDiv.appendChild(optionsMenu);

  const imageLink = document.createElement('a');
  imageLink.setAttribute('href', '#');
  recipeImageDiv.appendChild(imageLink);

  const image = document.createElement('img');
  image.setAttribute('alt', newRecipe.title);
  image.setAttribute('src', newRecipe.photoUrl);
  image.setAttribute('data-entry-id', newRecipe.createdRecipeId);
  imageLink.appendChild(image);

  const titleLink = document.createElement('a');
  titleLink.setAttribute('href', '#');
  recipeTitleDiv.appendChild(titleLink);

  const title = document.createElement('h2');
  title.textContent = newRecipe.title;
  title.setAttribute('data-entry-id', newRecipe.createdRecipeId);
  titleLink.appendChild(title);

  const iconLink = document.createElement('a');
  iconLink.setAttribute('href', '#');
  iconLink.className = 'options-icon';
  recipeTitleDiv.appendChild(iconLink);

  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-ellipsis fa-xl';
  iconLink.appendChild(icon);

  const closingIconDiv = document.createElement('div');
  closingIconDiv.className = 'justify-right padding-right';
  optionsMenu.appendChild(closingIconDiv);

  const closingIconLink = document.createElement('a');
  closingIconLink.setAttribute('href', '#');
  closingIconLink.className = 'closing-options-icon';
  closingIconDiv.appendChild(closingIconLink);

  const closingIcon = document.createElement('i');
  closingIcon.className = 'fa-solid fa-xmark';
  closingIconLink.appendChild(closingIcon);

  const editLink = document.createElement('a');
  editLink.setAttribute('href', '#');
  editLink.className = 'edit-navigation';
  optionsMenu.appendChild(editLink);

  const editText = document.createElement('p');
  editText.className = 'edit-button theme-font-color';
  editText.textContent = 'Edit';
  editText.setAttribute('data-entry-id', newRecipe.createdRecipeId);
  editLink.appendChild(editText);

  const deleteLink = document.createElement('a');
  deleteLink.setAttribute('href', '#');
  deleteLink.className = 'delete-created-recipe';
  optionsMenu.appendChild(deleteLink);

  const deleteText = document.createElement('p');
  deleteText.className = 'delete-button warning-font-color';
  deleteText.textContent = 'Delete';
  deleteText.setAttribute('data-entry-id', newRecipe.createdRecipeId);
  deleteLink.appendChild(deleteText);

  return listItem;
}

//    <li>
//      <input required name="ingredient" type="text" class="ingredient create-recipe-input">
//    </li>

function renderIngrInput() { // eslint-disable-line
  const listItem = document.createElement('li');

  const ingrInput = document.createElement('input');
  ingrInput.required = true;
  ingrInput.setAttribute('name', 'ingredient');
  ingrInput.setAttribute('type', 'text');
  ingrInput.className = 'ingredient create-recipe-input';

  listItem.appendChild(ingrInput);

  return listItem;
}

//    <li>
//      <textarea name="directions" rows="7" class="directions create-recipe-textarea"></textarea>
//    </li>

function renderDirInput() { // eslint-disable-line
  const listItem = document.createElement('li');

  const dirInput = document.createElement('textarea');
  dirInput.required = true;
  dirInput.setAttribute('name', 'directions');
  dirInput.setAttribute('rows', '7');
  dirInput.className = 'directions create-recipe-textarea';

  listItem.appendChild(dirInput);

  return listItem;
}
