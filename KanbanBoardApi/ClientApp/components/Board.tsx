import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as BoardState from '../store/Board';
var DaD = require('react-drag-and-drop') as any;
var Draggable = DaD.Draggable;
var Droppable = DaD.Droppable;

// At runtime, Redux will merge together...
type BoardProps =
    BoardState.BoardState        // ... state we've requested from the Redux store
    & typeof BoardState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ }>; // ... plus incoming routing parameters

class Board extends React.Component<BoardProps, {}> {
    componentWillMount() {
        this.props.getCards();
    }

    onDrop(data: any) {
        console.log(data)
        // => banana 
    }

    updateCard(value: any) {
        var newValue = value;
        newValue.title = "fromDrag";
        this.props.updateCard(newValue.id, newValue);
    }

    public render() {
        var list = this.props.cards.map((value: any, index: any) => {
            console.log(value);
            return (<Draggable key={index} onDragStart={(e: any) => { this.updateCard(value) }} type="cards" data={value.id}><li>{value.title}</li></Draggable>);
        })
        return (
            <div className="kanban-board">
                <Droppable
                    types={['cards']} // <= allowed drop types
                    onDrop={this.onDrop.bind(this)}>
                    <ul>
                        {list}
                    </ul>
                </Droppable>
            </div>)
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.cards, // Selects which state properties are merged into the component's props
    BoardState.actionCreators                  // Selects which action creators are merged into the component's props
)(Board) as typeof Board;
