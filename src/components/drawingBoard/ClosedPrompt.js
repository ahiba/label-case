
import S from './style.scss';

export default class ClosedPrompt extends Component{
    constructor(props){
        super(props);

        this.state = {
            layerName: props.layerName,
            attr: props.attr
        };

        this.editDone = this.editDone.bind(this);
    }

    editDone(ev){
        ev.preventDefault();
        ev.stopPropagation();

        let {holdingLayerID, editLayerDone} = this.props;

        let {layerName, attr} = this.state;

        if(!layerName || Number(layerName)===0){
            window.alert('你应该填写一个名字');
            return;
        }

        editLayerDone(holdingLayerID, layerName, attr);
    }

    render(){

        let {editDone} = this;

        let {layerName, attr} = this.state;

        let {top, left, editLayerDone, everDone, holdingLayerID, undo, deleteLayer, cancelAlterLayer} = this.props;

        return (
            <div className={S.closedPrompt} style={{
                top, left
            }}>

                <input
                    type="text"
                    placeholder="name"
                    value={layerName}
                    onChange={ev=> this.setState({layerName: ev.target.value}) }
                />
                <textarea
                    className={S.area}
                    value={attr}
                    onChange={ev=> this.setState({attr: ev.target.value}) }
                    placeholder="attr"
                    cols="30"
                    rows="2"
                ></textarea>



                <button
                    onClick={editDone}
                >done</button>

                {
                    !everDone ? (
                        <button
                            onClick={ev=>undo(holdingLayerID)}
                        >undo</button>
                    ) : null


                }

                <button
                    onClick={ev=>deleteLayer(holdingLayerID)}
                >delete</button>

                {
                    everDone ? (
                        <button
                            onClick={ev=>cancelAlterLayer(null)}
                        >cancel</button>
                    ) : null


                }

            </div>
        );
    }
}
