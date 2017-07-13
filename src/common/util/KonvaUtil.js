
export function fitStageIntoParentContainer(container, stageWidth, stageHeight, stage) {

    // now we need to fit stage into parent
    let containerWidth = container.offsetWidth;
    // to do this we need to scale the stage
    let scale = containerWidth / stageWidth;
    stage.width(stageWidth * scale);
    stage.height(stageHeight * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
}

export function drawImgCenter(imgW, imgH, cvsW, cvsH){
    let scale = imgW / imgH;
    let res = {};

    // 第一种情况 图片的宽度比高度大

    if(imgW >= imgH){
        res.w = cvsW;
        res.h = res.w / scale;
        res.x = (cvsW - res.w) / 2;
        res.y = (cvsH - res.h) / 2;
        res.scale = imgW / res.w;
    }

    // 第二种情况 图片的高度比宽度大
    if(imgW <= imgH){
        res.h = cvsH;
        res.w = res.h * scale;
        res.x = (cvsW - res.w) / 2;
        res.y = (cvsH - res.h) / 2;
        res.scale = imgH / res.h;
    }

    return res;
}

export function getRectToImg(currentX, currentY, result){
    let {x, y, scale} = result;

    let disW = (currentX - x) * scale;
    let disT = (currentY - y) * scale;

    return {disW, disT};

}
