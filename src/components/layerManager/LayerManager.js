import S from './style.scss';

export default class LayerManager extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <ul className={S.showData}>

                </ul>
            </div>
        );
    }
}
