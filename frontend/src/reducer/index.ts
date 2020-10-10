/**
 * @file store
 */

import {combineReducers} from 'redux';
import UserReducer from './User';

export const reducer = combineReducers({
  User: UserReducer
});

export type State = ReturnType<typeof reducer>;
