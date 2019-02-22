import { STORE_NAME } from './../models/store.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LibraryState } from '../models/store.interface';

export const getRootState = createFeatureSelector<LibraryState>(STORE_NAME);

export const getUiState = createSelector(
    getRootState,
    state => state.uiState
);

export const getStoreData = createSelector(
    getRootState,
    state => state.storeData
);

export const getSchema = createSelector(
    getStoreData,
    state => state.schema
);

export const getDataEntity = createSelector(
    getStoreData,
    state => state.data
);

export const getAllItems = createSelector(
    getDataEntity,
    state => state.items
);

export const getSelectedItem = createSelector(
    getAllItems,
    getUiState,
    (items, ui) => ui.selectedKey ? items[ui.selectedKey] : null
);
