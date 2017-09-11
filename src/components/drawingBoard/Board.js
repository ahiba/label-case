
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


        this.dragLimitControl = 8;

        this.clickTime = 0;

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

        let { fixSpotHitIndex, dragLimitControl} = this;

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
            moveLayer,
            shape,
            genRect
        } = this.props;

        let layerGroup = layersData[curtPhotoID];

        if(!layerGroup) return null;

        let {layers, holdingLayerID, curtLayerID, selectedLayerID, stage: {stageWidth, stageHeight}} = layerGroup;

        let curtLayer = null;
        let holdingLayer = null;
        let selectedLayerIndx;

        layers = layers.map((layer, i)=>{

            let {id, points, lineColor, lineClosed, fill, shapeType} = layer;

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
                        moveLayer,
                        shapeType
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
                    style={{
                        width: "760px",
                        height: "500px"
                    }}
                    ref="stage"

                    onMouseDown={ev=>{

                        let {className} = ev.target;

                        if(className === 'Line') return;

                        if(selectedLayerID &&  className==='Image') {
                            alterLayerSelected(null);
                            return;
                        }

                        let {x,y} = this.getPointerPosition();

                        if(shape===0){
                            if( overPointIndex===0 && curtLayer.points.length > 2 ){
                                // 闭合线条
                                alterLineClosed(true);
                                alterLayerHold(curtLayerID);

                            } else{
                                if(ev.target.className === 'Circle') return;
                                addSpot(x, y);
                            }
                        }

                        if(shape===1){

                            if(this.clickTime===0){
                                if(ev.target.className === 'Circle') return;
                                genRect(x,y);

                                this.clickTime++;

                            }else {
                                alterLayerHold(curtLayerID);
                                this.clickTime = 0;

                            }


                        }


                    }}

                    onMouseMove={ev=>{
                        if(shape===0) return;
                        if(holdingLayerID) return;

                        if(this.clickTime !==1 ) return;

                        let {x,y} = this.getPointerPosition();
                        if( x < dragLimitControl || y < dragLimitControl || x > stageWidth || y > stageHeight  ) return;

                        movePoint(curtLayerID, 0, x,y);

                        movePoint(curtLayerID, 1, null,y);

                        movePoint(curtLayerID, 3, x, null);

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
                                cancelAlterLayer,
                                shape : holdingLayer.shapeType === null ? shape : holdingLayer.shapeType
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
        let {shape} = state;
        let {drewImage, layersData} = state.board;
        let {curtPhoto:{id}} = state.photos;
        return {
            drewImage,
            layersData,
            curtPhotoID: id,
            shape
        }
    },
    dispatch => (bindActionCreators({...actions}, dispatch))
)(Board);
