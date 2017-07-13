
import {Provider, connect} from 'react-redux';
import {bindActionCreators, combineReducers} from 'redux';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import configureStore, {history} from 'reduxes/configureStore';

import Board from 'drawingBoard/Board';
import PhotoGallery from 'photoGallery/PhotoGallery';
import ToolBox from 'toolBox/ToolBox';
import LayerManager from 'layerManager/LayerManager';


import 'style/main.scss';
import S from './style.scss';
import 'semantic-ui-css/semantic.min.css';
let store = configureStore();

class App extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className={`${S.gridWrap}`}>
                <div className={S.topRow}>
                    <div className={S.logo}>
                        <div className={S.imgWrap}>
                            <a href="http://art.microbu.com"><img src={require("img/logo.png")} alt="miaov.com"/></a>
                        </div>
                    </div>
                    <div className={S.gallery}>
                        <PhotoGallery/>
                    </div>
                </div>
                <div className={S.bottomRow}>
                    <div className={S.tool}>
                        <ToolBox/>
                    </div>
                    <div className={S.board}>
                        <Board/>
                        <LayerManager />
                    </div>
                </div>
            </div>
        );
    }
}



ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>

            <Route path="/" component={App}/>

        </ConnectedRouter>

    </Provider>
    ,
    document.getElementById('root')
);
