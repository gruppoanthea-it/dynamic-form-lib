import { UiState } from './../models/store.interface';
import { ActionTypes } from '../actions/types';
import { UiActions } from '../actions/ui.actions';

const initialState: UiState = {
    selectedKey: null,
    lastSelectedKey: null,
    error: null
};

export function uiStateReducer(state = initialState, action: UiActions) {
    switch (action.type) {
        case ActionTypes.UI_ERROR:
            if (state.error && (state.error.context === action.context && state.error.message === action.message)) {
                return state;
            }
            return {...state, error: {context: action.context, message: action.message}};
        case ActionTypes.UI_CHANGE_ROW:
            if (!state.lastSelectedKey && !action.rowKey) {
                return state;
            }
            if (state.selectedKey === action.rowKey) {
                return state;
            }
            return {...state, selectedKey: action.rowKey || state.lastSelectedKey, lastSelectedKey: state.selectedKey};
        default:
            return state;
    }
}
