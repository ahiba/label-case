
import S from './style.scss';

export default function Tag({layerName, active, id, alterLayerFill, alterLayerHold, alterLayerSelected}){

    return (
        <li
            className={active ? S.active : ''}
            onClick={ev=>alterLayerSelected(id)}
            onDoubleClick={ev=>alterLayerHold(id)}

            onMouseOver={ev=>{
                alterLayerFill(id, true);
            }}
            onMouseOut={ev=>{
                alterLayerFill(id, false);
            }}

        >{layerName}</li>
    );
}
