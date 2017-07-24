
import {drawImage, addTempLayer} from 'drawingBoard/BoardRedux';

import {hintFinish, finishFirst} from 'common/util/Util';

let imgData = [
    {id: Math.random(), src: require("img/2.jpg")},
    {id: Math.random(), src: require("img/3.jpg")},
    {id: Math.random(), src: require("img/4.jpg")},
    {id: Math.random(), src: require("img/5.jpg")},
    {id: Math.random(), src: require("img/1.jpg")}
];

let initState = {
    imgData: [],
    curtPhoto: {
        id: '',
        src: ''
    }
}

const LOAD_IMAGE = 'label-case/PhotoGallery/LOAD_IMAGE';
const SWITCH_PHOTO = 'label-case/PhotoGallery/SWITCH_PHOTO';

export const loadImage = () => (dispatch, getState) => {

    let {photos:{curtPhoto}} = getState();

    dispatch({
        type: LOAD_IMAGE,
        imgData
    });

    if(!curtPhoto.id){
        dispatch(switchPhoto(imgData[0]));
    }

}

export const switchPhoto = (photo) => (dispatch, getState) => {

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
        type: SWITCH_PHOTO,
        photo
    });



    dispatch(drawImage(photo.src));

    if( !getState().board.layersData[photo.id] ){
        dispatch(addTempLayer());
    }

}

export const nextPhoto = () => (dispatch, getState) => {

    let {photos:{imgData,curtPhoto: {id}}} = getState();

    imgData.forEach((photo, i, arr)=>{
        if(id===photo.id && i<arr.length-1){
            dispatch(switchPhoto(arr[i+1]))
        }
    });
}

export const previousPhoto = () => (dispatch, getState) => {

    let {photos:{imgData,curtPhoto: {id}}} = getState();

    imgData.forEach((photo, i, arr)=>{
        if(id===photo.id && i>0){
            dispatch(switchPhoto(arr[i-1]))
        }
    });
}

export default function photos( state=initState, action ) {
    let { type, imgData, photo, nextPhoto } = action;


    switch (type) {
        case LOAD_IMAGE:
            return {...state, imgData}
            break;
        case SWITCH_PHOTO:
            return {...state, curtPhoto: photo}
            break;
        default:
            return state;
    }

}
