import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../models/common.interface';
import { IDataState } from './data.reducer';

export const dataState = createFeatureSelector<IState, IDataState>('data');

export const getData = createSelector(
    dataState,
    state => state.data
);
