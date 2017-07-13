
import { Button, List, Container} from 'semantic-ui-react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './PhotoGalleryRedux';

import S from './style.scss';

import Img from './Img';

class PhotoGallery extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.loadImage();
    }

    render(){

        let { imgData, switchPhoto, curtPhoto, nextPhoto, previousPhoto } = this.props;

        return (
            <Container textAlign="center" className={S.container}>
                <Button basic icon='chevron left' size="massive" className={S.button}
                    onClick={ev=>{
                        previousPhoto()
                    }}
                />
                <List horizontal className={S.listWrap}>
                    {
                        imgData.map(photo => (
                            <Img
                                {...{
                                    key: photo.id,
                                    photo,
                                    switchPhoto,
                                    active: curtPhoto.id === photo.id
                                }}
                            />
                        ) )
                    }
                </List>
                <Button basic icon='chevron right' size="massive" className={S.button}
                    onClick={ev=>{
                        nextPhoto()
                    }}
                />
            </Container>
        );
    }
}


export default connect(
    state => {
        let {photos: {imgData, curtPhoto}} = state;
        return {
            imgData,
            curtPhoto
        }
    },
    dispatch => bindActionCreators( {...actions}, dispatch )
)(PhotoGallery);
