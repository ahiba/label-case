
import Konva from 'konva';

import {Stage, Layer, Rect, Image} from 'react-konva';
import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';

import {getDrewImageBodyInfo} from 'util/KonvaUtil';

import * as actions from './BoardRedux';

import S from './style.scss';

import PaintingLayer from './Layer';
import ClosedPrompt from './ClosedPrompt';

class Board extends Component{
    constructor(props){
        super(props);

        this.state = {
            overPointIndex: null
        };

        this.stageWidth = 760;
        this.stageHeight = 500;

        this.fixSpotHitIndex = this.fixSpotHitIndex.bind(this);

    }

    fixSpotHitIndex(index){
        this.setState({
            overPointIndex: index
        });
    }

    getPointerPosition(){
        return this.refs.stage.getStage().getPointerPosition();
    }

    componentWillReceiveProps(nProp){
    }

    componentDidMount(){

    }

    render(){

        let {stageWidth, stageHeight, fixSpotHitIndex} = this;

        let {overPointIndex} = this.state;

        let {
            drewImage,
            addSpot,
            layersData,
            curtPhotoID,
            alterLineClosed,
            addTempLayer,
            alterLayerHold,
            editLayerDone,
            alterLayerFill,
            alterLayerSelected,
            undo,
            deleteLayer,
            cancelAlterLayer,
            movePoint,
            moveLayer
        } = this.props;

        let layerGroup = layersData[curtPhotoID];

        if(!layerGroup) return null;

        let {layers, holdingLayerID, curtLayerID, selectedLayerID} = layerGroup;

        let curtLayer = null;
        let holdingLayer = null;
        let selectedLayerIndx;

        layers = layers.map((layer, i)=>{

            let {id, points, lineColor, lineClosed, fill} = layer;

            if(holdingLayerID && holdingLayerID === id) holdingLayer = layer;
            if(curtLayerID && curtLayerID === id) curtLayer = layer;
            if(selectedLayerID && selectedLayerID === id) selectedLayerIndx = i;

            return (
                <PaintingLayer
                    {...{
                        key: id,
                        layerID: id,
                        points,
                        lineColor,
                        fixSpotHitIndex,
                        overPointIndex,
                        lineClosed,
                        alterLayerFill,
                        fill,
                        alterLayerSelected,
                        selectedLayerID,
                        alterLayerHold,
                        movePoint,
                        stageWidth,
                        stageHeight,
                        curtLayerID,
                        moveLayer
                    }}
                />
            )
        });


        if(selectedLayerID){
            let tempArr = layers.splice( selectedLayerIndx,1);
            layers = [...layers, ...tempArr];
        }

        // 计算出 ClosedPrompt 的 left 和 top

        let {x: left, y: top} = holdingLayer ? holdingLayer.points[0] : {x:0,y:0};

        left = stageWidth - left > 240 ? left : left - 230,
        top = stageHeight - top > 210 ? top : top - 200;

        // end 计算出 ClosedPrompt 的 left 和 top

        let imageBodyInfo = null;

        if( drewImage ) {
            let {width: imgWidth, height: imgHeight} = drewImage;

            imageBodyInfo = getDrewImageBodyInfo(imgWidth, imgHeight, stageWidth, stageHeight);

        }

        return (
            <div className={S.fl} >
                <Stage
                    width={stageWidth}
                    height={stageHeight}

                    ref="stage"

                    onMouseDown={ev=>{

                        let {className} = ev.target;

                        if(className === 'Line') return;

                        if(selectedLayerID &&  className==='Image') {
                            alterLayerSelected(null);
                            return;
                        }

                        let {x,y} = this.getPointerPosition();

                        if( overPointIndex===0 && curtLayer.points.length > 2 ){
                            // 闭合线条
                            alterLineClosed(true);
                            alterLayerHold(curtLayerID);

                        } else{
                            if(ev.target.className === 'Circle') return;
                            addSpot(x, y);
                        }


                    }}
                >
                    <Layer>
                        {
                            drewImage ? (
                                <Image
                                    {...{
                                        width: imageBodyInfo.w,
                                        height: imageBodyInfo.h,
                                        x: imageBodyInfo.x,
                                        y: imageBodyInfo.y,
                                        image: drewImage
                                    }}
                                />
                            ) : null
                        }

                    </Layer>
                    {layers}
                </Stage>

                {
                    holdingLayer ? (
                        <ClosedPrompt
                            {...{
                                left,
                                top,
                                editLayerDone,
                                holdingLayerID,
                                layerName: holdingLayer.layerName,
                                attr: holdingLayer.attr,
                                everDone: holdingLayer.everDone,
                                undo,
                                deleteLayer,
                                cancelAlterLayer
                            }}
                        />
                    ) : null
                }
            </div>
        );
    }
}

export default connect(
    state => {
        let {drewImage, layersData} = state.board;
        let {curtPhoto:{id}} = state.photos;
        return {
            drewImage,
            layersData,
            curtPhotoID: id
        }
    },
    dispatch => (bindActionCreators({...actions}, dispatch))
)(Board);
