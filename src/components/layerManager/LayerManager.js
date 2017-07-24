import S from './style.scss';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {alterLayerFill, alterLayerHold, alterLayerSelected} from 'drawingBoard/BoardRedux';

import Tag from './Tag';

class LayerManager extends Component{

    constructor(props){
        super(props);
    }

    render(){

        let {layersData, curtPhotoID, alterLayerFill, alterLayerHold, alterLayerSelected} = this.props;

        let tags = null;

        let layerGroup = layersData[curtPhotoID];

        if(layerGroup){
            let {layers, selectedLayerID} = layerGroup;

            tags = layers.map(layer=>{

                let {id, layerName, everDone} = layer;

                if(!everDone) return;

                return (
                    <Tag
                        {...{
                            key: id,
                            id,
                            layerName,
                            active: selectedLayerID === id,
                            alterLayerFill,
                            alterLayerHold,
                            alterLayerSelected

                        }}
                    />
                );

            });
        }

        return (
            <div>
                <ul className={S.showData}>
                    {tags}
                </ul>
            </div>
        );
    }
}

export default connect(
    state => {
        let {board: {layersData}, photos: {curtPhoto}} = state;

        return {
            layersData, curtPhotoID: curtPhoto.id
        }
    },
    dispatch => ({
        ...bindActionCreators( {alterLayerFill, alterLayerHold, alterLayerSelected},dispatch)
    })
)(LayerManager);
