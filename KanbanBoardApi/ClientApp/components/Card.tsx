import * as React from 'react';
import * as CardState from '../store/Board';
import { RouteComponentProps } from 'react-router-dom';

interface Props{
    openForm(value: boolean, selectedCard: CardState.Card): void;
    deleteCard(value: any): void;
}

type CardProps =
    CardState.CardState & Props;

export default class CardItem extends React.Component<CardProps , {}> {
    public render() {
        return <li className='card-item card'>{this.props.value.title}
            <div className='card-menu'><span>...</span>
                <ul>
                    <li onClick={(e) => this.props.openForm(true, this.props.value)}>Edit</li>
                    <li onClick={(e) => this.props.deleteCard(this.props.value)}>Delete</li>
                </ul>
            </div>
        </li>;
    }
}

