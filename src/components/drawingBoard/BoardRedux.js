
import Konva from 'konva';

let initState = {
    drewImage: null,
    layersData: {

    }
}

const DRAW_IMAGE = 'DRAW_IMAGE/label-case/Board';
const ADD_TEMP_LAYER = 'ADD_TEMP_LAYER/label-case/Board';
const ADD_SPOT = 'ADD_SPOT/label-case/Board';
const ALTER_LINE_CLOSED = 'ALTER_LINE_CLOSED/label-case/Board';
const ALTER_LAYER_HOLD = 'ALTER_LAYER_HOLD/label-case/Board';
const EDIT_LAYER_DONE = 'EDIT_LAYER_DONE/label-case/Board';
const ALTER_LAYER_FILL = 'EDIT_LAYER_FILL/label-case/Board';
const ALTER_LAYER_SELECTED = 'EDIT_LAYER_SELECTED/label-case/Board';
const UNDO = 'UNDO/label-case/Board';
const DELETE_LAYER = 'DELETE_LAYER/label-case/Board';
const MOVE_POINT = 'MOVE_POINT/label-case/Board';
const MOVE_LAYER = 'MOVE_LAYER/label-case/Board';


export const drawImage = (url) => (dispatch, getState) =>{
    let imgObj = new window.Image();

    imgObj.onload = ()=>{
        dispatch({
            type: DRAW_IMAGE,
            drewImage: imgObj
        });
    }

    imgObj.src = url;
}

export const addTempLayer = () => ( dispatch, getState ) => {

    dispatch({
        type: ADD_TEMP_LAYER,
        curtPhotoID: getState().photos.curtPhoto.id
    });

}

export const addSpot = (x, y) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;
    let {curtLayerID} = getState().board.layersData[curtPhotoID];

    dispatch({
        type: ADD_SPOT,
        curtPhotoID,
        pointX: x,
        pointY: y,
        curtLayerID
    });

}

export const alterLineClosed = (closed) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;
    let {curtLayerID} = getState().board.layersData[curtPhotoID];

    dispatch({
        type: ALTER_LINE_CLOSED,
        curtPhotoID,
        curtLayerID,
        closed
    });

}

export const alterLayerHold = (holdingLayerID) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;

    dispatch({
        type: ALTER_LAYER_HOLD,
        holdingLayerID,
        curtPhotoID
    });

}

export const cancelAlterLayer = (cancelLayerID) => (dispatch, getState) => {

    dispatch(alterLayerHold(cancelLayerID));
}

export const editLayerDone = ( editLayerID, layerName, attr ) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;

    dispatch({
        type: EDIT_LAYER_DONE,
        editLayerID,
        curtPhotoID,
        layerName,
        attr
    });

    dispatch(addTempLayer());
}

export const alterLayerFill = ( fillLayerID, isFill ) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;

    dispatch({
        type: ALTER_LAYER_FILL,
        curtPhotoID,
        fillLayerID,
        isFill
    });

}

export const alterLayerSelected = (selectedLayerID) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;

    dispatch({
        type: ALTER_LAYER_SELECTED,
        selectedLayerID,
        curtPhotoID
    });

}

export const undo = (undoLayerID) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;

    dispatch({
        type: UNDO,
        undoLayerID,
        curtPhotoID
    });

}

export const deleteLayer = (deleteLayerID) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;

    dispatch({
        type: DELETE_LAYER,
        deleteLayerID,
        curtPhotoID
    });

}
export const movePoint = (pointMoveLayerID, pointIndx, pointX, pointY) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;

    dispatch({
        type: MOVE_POINT,
        pointMoveLayerID,
        curtPhotoID,
        pointIndx,
        pointX,
        pointY
    });

}
export const moveLayer = (points, moveLayerID) => (dispatch, getState) => {

    let curtPhotoID = getState().photos.curtPhoto.id;

    dispatch({
        type: MOVE_LAYER,
        moveLayerID,
        points,
        curtPhotoID
    });

}


export default function board( state=initState, action ) {
    let {
        type,
        drewImage,
        curtPhotoID,
        curtLayerID,
        pointX,
        pointY,
        closed,
        holdingLayerID,
        editLayerID,
        layerName,
        attr,
        fillLayerID,
        isFill,
        selectedLayerID,
        undoLayerID,
        deleteLayerID,
        pointMoveLayerID,
        pointIndx,
        moveLayerID,
        points
    } = action;

    let {layersData} = state;

    let layerGroup = layersData[curtPhotoID];

    if(!layerGroup) layerGroup = {};

    let {layers} = layerGroup;

    if(!layers) layers = [];

    switch (type) {
        case DRAW_IMAGE:
            return {...state, drewImage}
            break;
        case ADD_TEMP_LAYER:

            let tempLayerID = Math.random();

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {
                    layers: [...layers, {
                        id: tempLayerID,
                        layerName: '',
                        attr: '',
                        points: [],
                        lineColor: Konva.Util.getRandomColor(),
                        fill: false,
                        lineClosed: false,
                        everDone: false
                    }],
                    curtLayerID: tempLayerID,
                    holdingLayerID: null,
                    selectedLayerID: null
                }
            }}
            break;
        case ADD_SPOT:

            layers = layers.map(layer=>{

                if( layer.id === curtLayerID ){
                    layer.points = [...layer.points, {x: pointX, y: pointY}];
                }

                return layer;

            });

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, layers  }
            }}
            break;
        case ALTER_LINE_CLOSED:

            layers = layers.map(layer=>{

                if( layer.id === curtLayerID ){
                    layer.lineClosed = closed;
                }

                return layer;

            });

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, layers  }
            }}
            break;
        case ALTER_LAYER_HOLD:

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, holdingLayerID  }
            }}
            break;
        case EDIT_LAYER_DONE:

            layers = layers.map(layer=>{

                if( layer.id === editLayerID ){
                    layer.layerName = layerName;
                    layer.attr = attr;
                    layer.everDone = true;
                }

                return layer;

            });

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, layers, holdingLayerID: null  }
            }}
        case ALTER_LAYER_FILL:

            layers = layers.map(layer=>{

                if( layer.id === fillLayerID ){
                    layer.fill = isFill;
                }

                return layer;

            });

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, layers }
            }}
        case UNDO:

            layers = layers.map(layer=>{

                if( layer.id === undoLayerID ){

                    if( layer.lineClosed ){
                        layer.lineClosed = false;
                    }else {
                        layer.points.pop();
                    }

                }

                return layer;

            });

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, layers, holdingLayerID: null }
            }}
        case DELETE_LAYER:

            let shouldDeleteIndex = null;

            layers = layers.map((layer, i)=>{

                if( layer.id === deleteLayerID ){

                    if(layer.everDone){
                        shouldDeleteIndex = i;
                    }else{
                        layer.lineClosed = false;
                        layer.points = [];
                    }
                }
                return layer;

            });

            if(shouldDeleteIndex !== null){
                layers.splice( shouldDeleteIndex ,1);
            }

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, layers, holdingLayerID: null, selectedLayerID: null }
            }}
        case MOVE_POINT:

            layers = layers.map((layer, i)=>{

                if( layer.id === pointMoveLayerID ){

                    let pt = layer.points[pointIndx];
                    pt.x = pointX;
                    pt.y = pointY;
                }
                return layer;

            });

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, layers}
            }}
        case MOVE_LAYER:

            layers = layers.map((layer, i)=>{

                if( layer.id === moveLayerID ){

                    layer.points = points;
                }
                return layer;

            });

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, layers}
            }}

        case ALTER_LAYER_SELECTED:

            return {...state, layersData: {
                ...layersData,
                [curtPhotoID]: {...layerGroup, selectedLayerID  }
            }}
        default:
            return state;
    }
}
