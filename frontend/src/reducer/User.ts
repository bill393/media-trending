/**
 * @file reducer User
 */

export const CHANGE_NAME = 'CHANGE_NAME';

export type UserState = {
  name: string,
  age: number
};

export type ChangeNameAction = {
  type: typeof CHANGE_NAME,
  payload: {
    name: string
  }
};

export type Action = ChangeNameAction;

const initState: UserState = {
  name: 'ruofee',
  age: 21
};

export default (state: UserState = initState, action: Action) => {
  switch (action.type) {
    case 'CHANGE_NAME': {
      return Object.assign({}, state, {
        name: action.payload.name
      });
    }
    default: {
      return state;
    }
  }
};

export const userName = (state: {
  User: UserState
}): string => {
  return state.User.name;
};

export const userAge = (state: {
  User: UserState
}): number => state.User.age;
