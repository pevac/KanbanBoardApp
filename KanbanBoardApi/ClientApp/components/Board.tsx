import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as BoardState from '../store/Board';
import { Card } from '../store/Board';
import CardItem from './Card';
import Form from './CardForm';
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

    onDrop(data: any, e: any, state: any) {
        var card = this.props.cards.filter((value: any) => value.id == data.card)[0];
        card.state = state;
        this.props.updateCard(card.id, card);
    }


    public renderList(state: any) {
        var list = this.props.cards.map((value: BoardState.Card, index: any) => {
            var card = value;
            if (value.state == state) {
                return (<Draggable key={index} type="card" data={value.id}><CardItem value={value} {...this.props}></CardItem></Draggable>);
            }
        })
        return list;
    }

    public render() {
        return (
            <div>
            <div className='main-board-container'>
                <div className="kanban-header-container">
                        <div className='member-header-content'>New</div>
                    <div className='member-header-content'>To do</div>
                    <div className='member-header-content'>In Progress</div>
                    <div className='member-header-content'>Done</div>
                </div>
                <div className="kanban-board-container">
                    <Droppable
                        types={['card']} // <= allowed drop types
                            onDrop={(data: any, e: any) => { this.onDrop.apply(this, [data, e, 0]) }}>
                            <button type="button" className="btn  board-add-card" onClick={() => this.props.openForm(true, this.props.selectedCard)}>New</button>
                        <ul>
                            {this.renderList(0)}
                        </ul>
                    </Droppable>
                    <Droppable
                        types={['card']} // <= allowed drop types
                        onDrop={(data: any, e: any) => { this.onDrop.apply(this, [data, e, 1]) }}>
                        <ul>
                            {this.renderList(1)}
                        </ul>
                    </Droppable>
                    <Droppable
                        types={['card']} // <= allowed drop types
                        onDrop={(data: any, e: any) => { this.onDrop.apply(this, [data, e, 2]) }}>
                        <ul>
                            {this.renderList(2)}
                        </ul>
                    </Droppable>
                    <Droppable
                        types={['card']} // <= allowed drop types
                        onDrop={(data: any, e: any) => { this.onDrop.apply(this, [data, e, 3]) }}>
                        <ul>
                            {this.renderList(3)}
                        </ul>
                    </Droppable>
                </div>
            </div>
            <Form {...this.props}></Form>
            </div>)
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.cards, // Selects which state properties are merged into the component's props
    BoardState.actionCreators                  // Selects which action creators are merged into the component's props
)(Board) as typeof Board;
