import * as React from 'react';
//import { Modal } from 'react-modal';
let Modal = require('react-modal') as any;
import * as FormState from '../store/Board';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as FormBoardState from '../store/Board';

const customStyles = {
    content: {
        width: '70%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: '24%',
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        zIndex: 100,
    },
};

interface FormProps {
    isOpen?: boolean;
    openForm(value: boolean, selected: FormBoardState.Card): void;
    createCard(value: FormBoardState.Card): void;
    updateCard(id: string , value: FormBoardState.Card): void;
    selectedCard: FormBoardState.Card;
    
}

interface FormState {
    card: FormBoardState.Card;
}

export default class CardForm extends React.Component<FormProps, FormState>{
    constructor(props: FormProps) {
        super(props);
        this.state = {
            card: this.props.selectedCard
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        console.log("fromcons");
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({ card: nextProps.selectedCard})
    }

    handleInputChange(event: any) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var newState = this.state.card as any;
        newState[name] = value;
        this.setState({
            card: newState
        });
    }

    createCard(card: any) {
        if (card.id == null && card.id == undefined && card.id == "") {
            this.props.createCard(card);
        } else {
            this.props.updateCard(card.id, card);
        }
    }

    render() {
        return (
            <Modal
                id="test"
                contentLabel="modalA"
                style={customStyles}
                closeTimeoutMS={150}
                isOpen={this.props.isOpen}>
           
                <form>
                    <div className="form-group row">
                        <label htmlFor='title' className="col-sm-2 col-form-label">Title</label>
                        <div className="col-sm-10">
                            <input type="text" name="title" className="form-control" id="title" placeholder="Title"
                                value={this.state.card.title}
                                onChange={this.handleInputChange}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor='description' className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-10">
                            <textarea className="form-control" name="description" id="description" placeholder="Description"
                                value={this.state.card.description}
                                onChange={this.handleInputChange}></textarea>
                        </div>
                    </div>
                    <button type='button' className="btn btn-primary close-btn" onClick={() => this.props.openForm(false, this.props.selectedCard)}>Close</button>
                    <button type='button' className="btn btn-primary save-btn" onClick={() => this.createCard(this.state.card)}>Save</button>
                </form>
            </Modal>
        );
    }
}


//export default connect(
//    (state: ApplicationState) => state.isOpen, // Selects which state properties are merged into the component's props
//    FormBoardState.actionCreators                  // Selects which action creators are merged into the component's props
//)(CardForm) as typeof CardForm;