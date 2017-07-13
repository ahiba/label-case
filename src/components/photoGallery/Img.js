
import { Image, List} from 'semantic-ui-react';

import S from './style.scss';

export default function Img({photo, switchPhoto, active}){
    let inActive = active ? S.active : ''
    return (
        <List.Item  className={`${inActive} ${S.imgWrap}`}
            onClick={ev=>{
                switchPhoto(photo)
            }}
        >
            <Image src={photo.src} size="tiny" className={S.img} />
        </List.Item>
    );
}
