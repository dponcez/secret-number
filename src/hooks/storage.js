import { selector } from '_fns/custom_functions.js';

const STORAGE_KEY = 'max-level-reached';

export function showLevelRecord(){
  const levelReached = selector('[data-record]');
  const savedRecord = localStorage.getItem(STORAGE_KEY);

  savedRecord ?
  levelReached.innerText = `level ${savedRecord}` :
  levelReached.innerText = 'not yet. ¡Start today!' 
}

export function savedLevelReached(completedLevel){
  const lastRecord = localStorage.getItem(STORAGE_KEY) || 0;
  
  if(completedLevel > parseInt(lastRecord)){
    localStorage.setItem(STORAGE_KEY, completedLevel)
  }
}