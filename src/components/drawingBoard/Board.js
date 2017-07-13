
import Konva from 'konva';

import {Stage, Layer, Rect} from 'react-konva';

import S from './style.scss';

export default class Board extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){

    }

    render(){
        return (
            <div className={S.fl} >
                <Stage
                    width={760}
                    height={500}
                >
                    <Layer>
                        <Rect
                            {...{
                                width: 100,
                                height: 50,
                                x: 50,
                                y: 50,
                                fill: 'red'
                            }}
                        />
                    </Layer>

                </Stage>
                {/* <div
                    ref="stageContainer"
                    className={S.stageContainer}
                    >

                </div> */}
            </div>
        );
    }
}
