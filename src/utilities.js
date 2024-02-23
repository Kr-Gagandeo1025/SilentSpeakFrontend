// define label map
const labelMap = {
    1:{name:'Hello',color:'red'},
    2:{name:'Thank You',color:'yellow'},
    3:{name:'I Love You',color:'lime'},
    4:{name:'Yes',color:'blue'},
    5:{name:'No',color:'purple'},
}

//drawing the detection box
export const drawRect = (boxes,classes,scores,threshold,imgWidth,imgHeight,ctx,setSilentText)=>{
    for(let i=0; i<=boxes.length;i++){
        if(boxes[i] && classes[i] && scores[i]>=threshold){
            const [y,x,height,width] = boxes[i];
            const text = classes[i];
            setSilentText(labelMap[text]['name']);

            // style
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 5
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'

            //draw
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] +' - '+Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight)
            ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/1.5, height*imgHeight/2);
            ctx.stroke();
        }
    }
}