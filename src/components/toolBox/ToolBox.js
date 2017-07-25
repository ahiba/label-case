import S from './style.scss';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from './ToolBoxRedux';
import {adaptStage, incrementStage, decrementStage, undo} from 'drawingBoard/BoardRedux';

class ToolBox extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let {shape, changeShape, adaptStage, incrementStage, decrementStage, undo, layersData, curtPhotoID}  = this.props;

        let layerGroup = layersData[curtPhotoID];

        return (
            <ul className={S.toolButton}>
                <li
                    onClick={ev=>incrementStage()}
                >
                    <i></i>
                    放大
                </li>
                <li
                    onClick={ev=>decrementStage()}
                >
                    <i></i>
                    缩小
                </li>
                <li
                    onClick={ev=>adaptStage()}
                >
                    <i></i>
                    适应
                </li>
                <li className={shape===0? S.active : ''}
                    onClick={ev=>changeShape(0)}
                >
                    <i></i>
                    点描

                </li>
                <li className={shape===1? S.active : ''}
                    onClick={ev=>changeShape(1)}
                >
                    <i></i>
                    框选
                </li>

                <li
                    onClick={ev=>{
                        if(layerGroup && shape===0){
                            undo(layerGroup.curtLayerID);
                        }
                    }}
                >
                    <i></i>
                    上一步
                </li>
            </ul>
        );
    }
}

export default connect(
    state => {

        let {shape, board:{layersData}, photos:{curtPhoto:{id}}} = state;

        return {shape, layersData, curtPhotoID:id}
    },
    dispatch => ({
        ...bindActionCreators(actions, dispatch),
        ...bindActionCreators({adaptStage, incrementStage, decrementStage,undo}, dispatch)
    })
)(ToolBox);
