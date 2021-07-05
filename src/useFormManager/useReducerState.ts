import { Reducer, useCallback, useReducer } from "react";

interface Action<TFormData> {
    updatedState: Partial<TFormData>;
}

function shallowEqual(object1: Record<string, unknown>, object2: Record<string, unknown>) {
    const object1keys = Object.keys(object1);
    const object2keys = Object.keys(object2);

    if (object1keys.length !== object2keys.length) {
        return false;
    }

    for (const key of object1keys) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }

    return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer<TFormData extends Record<string, any>>(
    state: TFormData,
    action: Action<TFormData>,
) {
    const newState = {
        ...state,
        ...action.updatedState,
    };

    if (shallowEqual(newState, state)) {
        return state;
    }

    return newState;
}

export const useReducerState = <TFormData>(
    initialState: TFormData,
): [TFormData, (data: Partial<TFormData>) => void] => {
    const [state, dispatch] = useReducer<Reducer<TFormData, Action<TFormData>>>(
        reducer,
        initialState,
    );

    const setState = useCallback(
        (updatedState: Partial<TFormData>) => {
            dispatch({ updatedState });
        },
        [dispatch],
    );

    return [state, setState];
};
