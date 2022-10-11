import Immutable from 'immutable';
import produce from 'immer';


export const apiReducer = (routine, initialState = {}, options = {}) => (state = initialState, action) => {
  let useImmerjs = options.useImmerjs || false;
  
  const key = action.payload && (action.payload.key || action.payload.id);
  if(useImmerjs){
    switch (action.type) {
      case routine.TRIGGER:
        return produce(state, draftState => {
          draftState[key].loading = true;
          draftState[key].succeeded = false;
          draftState[key].error = null;
        })
        // return state
        //   .setIn(getPath(key, 'loading'), true)
        //   .setIn(getPath(key, 'succeeded'), false)
        //   .setIn(getPath(key, 'error'), null);
      case routine.SUCCESS:
        return produce(state, draftState => {
          draftState[key].data = action.payload.response.data;
          draftState[key].succeeded = true;
          
        })
        // return state
        //   .setIn(getPath(key, 'data'), Immutable.fromJS(action.payload.response.data))
        //   .setIn(getPath(key, 'succeeded'), true);
      case routine.FAILURE:
        return produce(state, draftState => {
          draftState[key].succeeded = true;
          draftState[key].error = action.error; 
        })
        // return state
        //   .setIn(getPath(key, 'succeeded'), false)
        //   .setIn(getPath(key, 'error'), action.error);
      case routine.FULFILL:
        return produce(state, draftState => {
          draftState[key].loading = false;
        })
        
      default:
        return state;
    }
  } else {

    switch (action.type) {
      case routine.TRIGGER:
        return state
          .setIn(getPath(key, 'loading'), true)
          .setIn(getPath(key, 'succeeded'), false)
          .setIn(getPath(key, 'error'), null);
      case routine.SUCCESS:
        return state
          .setIn(getPath(key, 'data'), Immutable.fromJS(action.payload.response.data))
          .setIn(getPath(key, 'succeeded'), true);
      case routine.FAILURE:
        return state
          .setIn(getPath(key, 'succeeded'), false)
          .setIn(getPath(key, 'error'), action.error);
      case routine.FULFILL:
        return state
          .setIn(getPath(key, 'loading'), false);
      default:
        return state;
    }
  }
};

export const paginationApiReducer = (routine, continuous = false, initialState = {}, options = {}) => (state = initialState, action) => {
  let useImmerjs = options.useImmerjs || false;
  const key = action.payload && (action.payload.key || action.payload.id);
  if(useImmerjs){
    switch (action.type) {
      case routine.TRIGGER:
        if (!action.payload) {
          action.payload = {};
        }
  
        if (!(action.payload.page >= 0)) {
          throw new Error('Page parameter is missing!');
        }
  
        const isFirstPage = action.payload.page === 0;
        if (isFirstPage)
          state = produce(state, draftState => {
            draftState[key].data = [];
          })
        // if (isFirstPage)
        //   state = state.setIn(getPath(key, 'data'), Immutable.List());
        
        return produce(state, draftState => {
            draftState[key].page = action.payload.page;
            draftState[key].loading = true;
            draftState[key].succeeded = false;
            draftState[key].error = null;
          })
        // return state
        //   .setIn(getPath(key, 'loading'), true)
        //   .setIn(getPath(key, 'succeeded'), false)
        //   .setIn(getPath(key, 'error'), null)
        //   .setIn(getPath(key, 'page'), action.payload.page);
  
      case routine.SUCCESS:
        const {items, total} = action.payload.response.data;
        const immutableItems = items;
        //const immutableItems = Immutable.fromJS(items);
        return produce(state, draftState => {
          draftState[key].page = oldData => continuous ? oldData.concat(immutableItems) : immutableItems;
          draftState[key].total = total;
          draftState[key].succeeded = true;
        })
        // return state
        //   .updateIn(getPath(key, 'data'), oldData => continuous ? oldData.concat(immutableItems) : immutableItems)
        //   .setIn(getPath(key, 'succeeded'), true)
        //   .setIn(getPath(key, 'total'), total);
  
      case routine.FAILURE:
        return produce(state, draftState => {
          draftState[key].succeeded = true;
          draftState[key].error = action.error;
        })
        // return state
        //   .setIn(getPath(key, 'succeeded'), false)
        //   .setIn(getPath(key, 'error'), action.error);
  
      case routine.FULFILL:
        return produce(state, draftState => {
          draftState[key].loading = false;
        })
        // return state
        //   .setIn(getPath(key, 'loading'), false);
  
      default:
        return state;
    }
  } else {
    switch (action.type) {
      case routine.TRIGGER:
        if (!action.payload) {
          action.payload = {};
        }
  
        if (!(action.payload.page >= 0)) {
          throw new Error('Page parameter is missing!');
        }
  
        const isFirstPage = action.payload.page === 0;
        if (isFirstPage)
          state = state.setIn(getPath(key, 'data'), Immutable.List());
  
        return state
          .setIn(getPath(key, 'loading'), true)
          .setIn(getPath(key, 'succeeded'), false)
          .setIn(getPath(key, 'error'), null)
          .setIn(getPath(key, 'page'), action.payload.page);
  
      case routine.SUCCESS:
        const {items, total} = action.payload.response.data;
        const immutableItems = Immutable.fromJS(items);
  
        return state
          .updateIn(getPath(key, 'data'), oldData => continuous ? oldData.concat(immutableItems) : immutableItems)
          .setIn(getPath(key, 'succeeded'), true)
          .setIn(getPath(key, 'total'), total);
  
      case routine.FAILURE:
        return state
          .setIn(getPath(key, 'succeeded'), false)
          .setIn(getPath(key, 'error'), action.error);
  
      case routine.FULFILL:
        return state
          .setIn(getPath(key, 'loading'), false);
  
      default:
        return state;
    }
  }
  
};

const getPath = (key, property) => key ? [key, property] : [property];