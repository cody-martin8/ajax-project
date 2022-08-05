/* exported data */
var data = {
  view: '',
  savedRecipes: [],
  createdRecipes: [],
  editing: null,
  nextSavedRecipeId: 1,
  nextCreatedRecipeId: 1
};

// var previousDataJSON = localStorage.getItem('recipes-local-storage');
// if (previousDataJSON !== null) {
//   data = JSON.parse(previousDataJSON);
// }

// window.addEventListener('beforeunload', function beforeUnload(event) {
//   var dataJSON = JSON.stringify(data);
//   localStorage.setItem('recipes-local-storage', dataJSON);
// });
