import { STORE_NAME } from './../models/store.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LibraryState } from '../models/store.interface';
import * as _ from 'lodash';

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
    state => _.values(state.items)
);

export const getSelectedItem = createSelector(
    getDataEntity,
    getUiState,
    (data, ui) => ui.selectedKey ? data.items[ui.selectedKey] : null
);
