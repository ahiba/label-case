
import {Layer, Circle, Line} from 'react-konva';

export default class PaintingLayer extends Component{
    constructor(props){
        super(props);

        this.dragLimitControl = 8;

        this.oriPoints = null;
        this.newOriPoints = null;
    }

    componentWillReceiveProps(np){
        if( this.oriPoints && this.props.stageWidth !== np.stageWidth ){
            this.oriPoints = this.oriPoints.map( ({x,y}, i)=>{

                return {
                    x: np.points[i].x - this.props.points[i].x + x,
                    y: np.points[i].y - this.props.points[i].y + y

                }

            } );
        }
    }


    render(){

        let {dragLimitControl, oriPoints} = this;

        let {
            points,
            layerID,
            lineColor,
            fixSpotHitIndex,
            overPointIndex,
            lineClosed,
            fill,
            alterLayerFill,
            alterLayerSelected,
            selectedLayerID,
            curtLayerID,
            alterLayerHold,
            movePoint,
            stageWidth,
            stageHeight,
            moveLayer,
            shapeType,
        } = this.props;

        let linePoints = [];

        points.forEach(point=> (linePoints.push(point.x, point.y)) );

        let oriLinePoints = null;

        if(oriPoints){
            oriLinePoints = [];
            oriPoints.forEach(point=> (oriLinePoints.push(point.x, point.y)) );
        }



        let pointsComp = null;

        if(selectedLayerID === layerID || curtLayerID === layerID){
            pointsComp = points.map((point, i)=>{

                return (
                    <Circle
                        {...{
                            key: i,
                            x: point.x,
                            y: point.y,
                            radius: overPointIndex === i ? 8 : 6,
                            fill: overPointIndex ===0 && i === 0 && !lineClosed ? null : '#fff',
                            stroke: i===0 ? 'red' : 'black',
                            strokeWidth: 3,
                            draggable: true
                        }}

                        onMouseOver={ ev=> fixSpotHitIndex(i) }

                        onMouseOut={ ev=> fixSpotHitIndex(null) }

                        onDragStart={ev=>{
                            if(oriPoints){
                                this.newOriPoints = points.slice();
                            }
                        }}

                        onDragMove={ev=>{

                            let {x,y} = ev.target.attrs;

                            if( x < dragLimitControl || y < dragLimitControl || x > stageWidth || y > stageHeight  ) return;

                            if( oriPoints ){
                                oriPoints[i].x = (x - this.newOriPoints[i].x + oriPoints[i].x);
                                oriPoints[i].y = y - this.newOriPoints[i].y + oriPoints[i].y;

                            }

                            movePoint(layerID, i, x, y);

                            if(shapeType===1){
                                switch (i) {
                                    case 0:
                                        if( oriPoints ){
                                            oriPoints[1].y = y - this.newOriPoints[1].y + oriPoints[1].y;
                                            oriPoints[3].x = x - this.newOriPoints[3].x + oriPoints[3].x;

                                        }
                                        movePoint(layerID, 1, null,y);
                                        movePoint(layerID, 3, x, null);

                                        break;
                                    case 1:
                                        if( oriPoints ){
                                            oriPoints[0].y = y - this.newOriPoints[0].y + oriPoints[0].y;
                                            oriPoints[2].x = x - this.newOriPoints[2].x + oriPoints[2].x;

                                        }
                                        movePoint(layerID, 0, null,y);
                                        movePoint(layerID, 2, x, null);

                                        break;
                                    case 2:
                                        if( oriPoints ){
                                            oriPoints[1].x = x - this.newOriPoints[1].x + oriPoints[1].x;
                                            oriPoints[3].y = y - this.newOriPoints[3].y + oriPoints[3].y;

                                        }
                                        movePoint(layerID, 1, x, null);
                                        movePoint(layerID, 3, null, y);

                                        break;
                                    case 3:
                                        if( oriPoints ){
                                            oriPoints[0].x = x - this.newOriPoints[0].x + oriPoints[0].x;
                                            oriPoints[2].y = y - this.newOriPoints[2].y + oriPoints[2].y;

                                        }
                                        movePoint(layerID, 0, x, null);
                                        movePoint(layerID, 2, null, y);

                                        break;
                                    default:

                                }
                            }

                        }}

                        dragBoundFunc={
                            ({x,y})=>{

                                if(x > stageWidth-dragLimitControl){
                                    x = stageWidth-dragLimitControl;
                                }

                                if(x < dragLimitControl){
                                    x = dragLimitControl;
                                }
                                if(y > stageHeight-dragLimitControl){
                                    y = stageHeight-dragLimitControl;
                                }

                                if(y < dragLimitControl){
                                    y = dragLimitControl;
                                }

                                return { x, y }
                            }
                        }

                    />
                );
            });
        }



        return (
            <Layer>
                <Line
                    {...{
                        points: oriLinePoints || linePoints,
                        stroke: lineColor,
                        strokeWidth: 4,
                        closed: lineClosed,
                        fill: fill || selectedLayerID === layerID ? 'rgba(255,0,0,0.3)' : null,
                        listening: selectedLayerID === layerID ? true : false,
                        lineJoin: 'round',
                        draggable: true

                    }}

                    onDblClick={ev=>{alterLayerHold(layerID)}}

                    onDragStart={ev=>{
                        if( !oriPoints ){
                            this.oriPoints = points.slice();
                        }
                    }}

                    onDragMove={ev=>{
                        let {x,y, points} = ev.target.attrs;

                        let newPointsArr = this.oriPoints.map( (point, i)=>{

                            return {
                                x: point.x + x,
                                y: point.y + y
                            }

                        } );
                        moveLayer( newPointsArr, layerID);

                    }}


                />
                {
                    lineClosed ? (
                        <Line
                            {...{
                                points: [...linePoints, linePoints[0], linePoints[1]],
                                strokeWidth: 14,
                                stroke: 'red',
                                opacity: 0
                            }}

                            onMouseOver={ev=>{
                                alterLayerFill(layerID, true);
                            }}
                            onMouseOut={ev=>{
                                alterLayerFill(layerID, false);
                            }}

                            onClick={ev=>alterLayerSelected(layerID)}

                            onDblClick={ev=>{alterLayerHold(layerID)}}
                        />
                    ) : null

                }
                {pointsComp}
            </Layer>
        );
    }
}
