import {hintFinish, finishFirst} from 'common/util/Util';
const CHANGE_SHAPE = 'CHANGE_SHAPE/label-case/ToolBox';

export const changeShape = (shape) => (dispatch, getState) =>{

    let {
        photos:{curtPhoto:{id: curtPhotoID}},
        board:{layersData}
    } = getState();

    let layerGroup = layersData[curtPhotoID];

    if(layerGroup){

        let {holdingLayerID, layers, curtLayerID} = layerGroup;

        if(holdingLayerID || finishFirst(layers, curtLayerID)){
            hintFinish();
            return;
        }
    }

    dispatch({
        type: CHANGE_SHAPE,
        shape
    });

}

export default function shape(state=0, action) {
    let {type, shape} = action;

    switch (type) {
        case CHANGE_SHAPE:
            return shape;
        default:
            return state;
    }

}
