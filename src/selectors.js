import Immutable from 'immutable';

export const requestSelector = (state, routine, key) => {
  let path = ['api', routine.toString()];
  if (key) {
    path.push(key);
  }
  return state.getIn(path, Immutable.Map());
};

export const requestSelectorImmer = (state, routine, key) => {
  let finalVal = state.api[routine.toString()];
  if (key) {
    finalVal = finalVal.key;
  }
  return finalVal;
};
