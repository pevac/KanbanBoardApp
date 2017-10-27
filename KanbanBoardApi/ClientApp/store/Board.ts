import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface BoardState {
    isLoading: boolean;
    cards: Card[];
}

export interface Card {
    id: string;
    title: number;
    desctiption: number;
    state: State;
}

export enum State {
    new = 0,
    todo = 1,
    inProgress = 2,
    done = 3

}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestCardsAction {
    type: 'REQUEST_CARDS';
}

interface ReceiveCardsAction {
    type: 'RECEIVE_CARDS';
    cards: Card[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestCardsAction | ReceiveCardsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    getCards: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
            let fetchTask = fetch(`api/Cards`)
                .then(response => response.json() as Promise<Card[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_CARDS', cards: data });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_CARDS'});
    },
    updateCard: (cardId: any, value: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        var headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        console.log(value);
        let fetchTask = fetch(`api/Cards/${cardId}`, { method: "PUT", body: JSON.stringify(value), headers: headers })
            .then(response => console.log( response.text()))
            .then(data => {
                dispatch({ type: 'RECEIVE_CARDS', cards: value });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        //dispatch({ type: 'REQUEST_CARDS' });
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: BoardState = { cards: [], isLoading: false };

export const reducer: Reducer<BoardState> = (state: BoardState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CARDS':
            return {
                cards: state.cards,
                isLoading: true
            };
        case 'RECEIVE_CARDS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
                return {
                    cards: action.cards,
                    isLoading: false
                };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
