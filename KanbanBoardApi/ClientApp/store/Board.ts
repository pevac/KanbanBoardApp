import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface BoardState {
    cards: Card[];
    isOpen: boolean;
    selectedCard: Card;
}

export interface CardState {
    value: Card;
}

export interface Card {
    id?: string;
    title: string;
    description: string;
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
    type: 'LOAD_SUCCESS_CARDS';
    cards: Card[];
}

interface UpdateLocalCards {
    type: 'UPDATE_LOCAL_CARDS';
    card: Card;
}

interface DeleteLocalCards {
    type: 'DELETE_LOCAL_CARDS';
    card: Card;
}

interface CreateCards {
    type: 'CREATE_LOCAL_CARDS';
    card: Card;
}


interface OpenForm {
    type: 'OPEN_FORM';
    isOpen: boolean;
    selectedCard: Card;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestCardsAction | ReceiveCardsAction | OpenForm | UpdateLocalCards | DeleteLocalCards | CreateCards;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    getCards: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
         fetch(`api/Cards`)
                .then(response => response.json() as Promise<Card[]>)
                .then(data => {
                    dispatch({ type: 'LOAD_SUCCESS_CARDS', cards: data });
                });

    },
    updateCard: (cardId: any, value: any): (dispatch: any) => Promise<any> => {
        return (dispatch: any) => {
            // Only load data if it's something we don't already have (and are not already loading)
            dispatch({ type: 'UPDATE_LOCAL_CARDS', card: value })
            var headers = new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });
            return fetch(`api/Cards/${cardId}`, { method: "PUT", body: JSON.stringify(value), headers: headers })
                .then(res => {
                    if (!res.ok) {
                        fetch(`api/Cards`)
                            .then(response => response.json() as Promise<Card[]>)
                            .then(data => {
                                dispatch({ type: 'LOAD_SUCCESS_CARDS', cards: data });
                            });
                    }
                }
            );
        }
    },
    createCard: (value: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        var headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        return fetch(`api/Cards`, { method: "POST", body: JSON.stringify(value), headers: headers })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                dispatch({ type: 'CREATE_LOCAL_CARDS', card: data})
            });
    },
    deleteCard: (value: Card): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        dispatch({ type: 'DELETE_LOCAL_CARDS', card: value })
        var headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        return fetch(`api/Cards/${value.id}`, { method: "DELETE" });
    },
    openForm: (value: boolean, selectedCard: Card): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'OPEN_FORM', isOpen: value, selectedCard: selectedCard })
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var selectedCard = { title: "", description: "", state: 0 }
const unloadedState: BoardState = { cards: [], isOpen: false, selectedCard: selectedCard };

export const reducer: Reducer<BoardState> = (state: BoardState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'OPEN_FORM':
            return {
                isOpen: action.isOpen,
                cards: state.cards,
                selectedCard: action.selectedCard
            };
        case 'REQUEST_CARDS':
            return {
                cards: state.cards,
                isOpen: state.isOpen,
                isLoading: true,
                selectedCard: selectedCard
            };
        case 'UPDATE_LOCAL_CARDS':
            var cards = state.cards.map((value: Card) => {
                if (value.id == action.card.id) {
                    return  action.card;
                }
                return value;
            })
            return {
                cards: cards,
                isOpen: false,
                isLoading: false,
                selectedCard: selectedCard
            };
        case 'CREATE_LOCAL_CARDS':
            var cards = state.cards;
            cards.push(action.card);
            return {
                cards: cards,
                isOpen: false,
                isLoading: false,
                selectedCard: selectedCard
            };
        case 'DELETE_LOCAL_CARDS':
            var cards = state.cards.filter((value: Card) => value.id != action.card.id)
            return {
                cards: cards,
                isOpen: state.isOpen,
                isLoading: false,
                selectedCard: selectedCard
            };
        case 'LOAD_SUCCESS_CARDS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                isOpen: state.isOpen,
                cards: action.cards,
                selectedCard: state.selectedCard
                };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            //const exhaustiveCheck: never = action;
            return state || unloadedState;
    }
};
