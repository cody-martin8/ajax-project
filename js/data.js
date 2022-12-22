/* exported data */
let data = {
  view: '',
  savedRecipes: [],
  createdRecipes: [],
  editing: null,
  nextSavedRecipeId: 1,
  nextCreatedRecipeId: 1
};

const previousDataJSON = localStorage.getItem('recipes-local-storage');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
  data.editing = null;
}

window.addEventListener('beforeunload', function beforeUnload(event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('recipes-local-storage', dataJSON);
});

window.addEventListener('pagehide', function pageHide(event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('recipes-local-storage', dataJSON);
});
