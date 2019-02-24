import { STORE_NAME } from './../models/store.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LibraryState } from '../models/store.interface';
import * as _ from 'lodash';
import { deepCopy } from '../utility/utility.functions';
import { Entity } from '../models/common.interface';
import { merge } from 'rxjs/operators';

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

export const getItemsAsMap = createSelector(
    getDataEntity,
    state => {
        if (!state.items) {
            return null;
        }
        const merged: Map<string, Entity> = new Map([...Array.from(state.items.entries()),
         ...Array.from(state.changes.entries())]);
        return merged;
    }
);

export const getAllItems = createSelector(
    getItemsAsMap,
    state => {
        if (!state) {
            return null;
        }
        return [...state.values()];
    }
);

export const getSelectedItem = createSelector(
    getItemsAsMap,
    getUiState,
    (data, ui) => ui.selectedKey ? deepCopy(data.get(ui.selectedKey)) : null
);

export const getDataChanged = createSelector(
    getDataEntity,
    state => state.changes.size > 0
);
