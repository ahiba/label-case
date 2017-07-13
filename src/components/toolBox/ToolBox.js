import S from './style.scss';

export default class ToolBox extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <ul className={S.toolButton}>
                <li>
                    <i></i>
                    放大
                </li>
                <li>
                    <i></i>
                    缩小
                </li>
                <li>
                    <i></i>
                    适应
                </li>
                <li>
                    <i></i>
                    点描

                </li>
                <li>
                    <i></i>
                    框选
                </li>

                <li>
                    <i></i>
                    上一步
                </li>
            </ul>
        );
    }
}
