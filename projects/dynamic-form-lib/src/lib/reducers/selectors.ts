import { STORE_NAME } from './../models/store.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LibraryState } from '../models/store.interface';
import * as _ from 'lodash';
import { deepCopy, mergeChanges } from '../utility/utility.functions';
import { Entity } from '../models/common.interface';

export const getRootState = createFeatureSelector<LibraryState>(STORE_NAME);

export const getUiState = createSelector(
    getRootState,
    (state, props) => state.items.has(props.formId) ? state.items.get(props.formId).uiState : null
);

export const getStoreData = createSelector(
    getRootState,
    (state, props) => state.items.has(props.formId) ? state.items.get(props.formId).storeData : null
);

export const getSchema = createSelector(
    getStoreData,
    state => state.schema
);

export const getListSchema = createSelector(
    getSchema,
    state => state.loaded ? state.item.list : null
);

export const getDetailSchema = createSelector(
    getSchema,
    state => state.loaded ? state.item.form : null
)

export const getDataEntity = createSelector(
    getStoreData,
    state => state.data
);

export const getPaging = createSelector(
    getDataEntity,
    state => state.paging
);

export const getItemsAsMap = createSelector(
    getDataEntity,
    state => {
        if (!state.items) {
            return null;
        }
        const mer = mergeChanges(state.items, state.changes, true);
        const merged: Map<string, Entity> = new Map(mer);
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

export const getItemsCount = createSelector(
    getItemsAsMap,
    state => state ? state.size : 0
);

export const getCurrentKey = createSelector(
    getUiState,
    state => state.selectedKey
);

export const getCurrentIndex = createSelector(
    getAllItems,
    getUiState,
    (items, ui) => {
        if (!items) {
            return 0;
        }
        let index = 0;
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            if (el.Id === ui.selectedKey) {
                index = i + 1;
                break;
            }
        }
        return index;
    }
);

export const getSelectedItem = createSelector(
    getItemsAsMap,
    getUiState,
    (data, ui) => ui.selectedKey && data && data.has(ui.selectedKey) ? deepCopy(data.get(ui.selectedKey)) : null
);

export const getDataChanged = createSelector(
    getDataEntity,
    state => state.changes.size > 0
);
