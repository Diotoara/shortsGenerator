import { useEffect, useState } from "react";
import { AbsoluteFill, Html5Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion"
const RemotionVideo = ({script, imageUrls, audioUrl, caption, setDurationinFrame} : {script:any, imageUrls:any, audioUrl:any, caption:any, setDurationinFrame:any} ) => {
  
  const {fps}=useVideoConfig();
  const frame = useCurrentFrame();

  const getDurationFrame = ()=>{
    setDurationinFrame(caption[caption?.length-1]?.end/1000*fps)
    return caption[caption?.length-1]?.end/1000*fps
  }
  
  const getCurrentCaption=()=>{
    const currentTime = frame/30*1000   //frame to ms
    const currentCaption = caption.find((word:any)=>currentTime>=word.start &&  currentTime<=word.end);
    return currentCaption?currentCaption?.text : '';
  }

  return imageUrls && (
    <AbsoluteFill className="bg-black" >
      {imageUrls?.map((item:any,index:any)=>{
        const startTime = (index*getDurationFrame())/imageUrls?.length;
        const duration = getDurationFrame();
        const scale=interpolate(
          frame,
          [startTime, startTime+(duration/2), startTime+duration], //zoom in zooomout logic
          index%2==0 ? [1,1.7,1] : [2,1,1.7] ,
          {extrapolateLeft:'clamp', extrapolateRight:'clamp'}
        )
        return(
        <div key={index} >
          <Sequence key={index} from={startTime} durationInFrames={duration} >
            <Img src={item} style={{width:'100%', height:'100%', objectFit:'cover', transform:`scale(${scale})`}} />
            <AbsoluteFill className="text-white flex justify-center items-center mt-32 " >
              <h2 className="p-1 rounded-md font-extralight bg-black" >
                {getCurrentCaption()}
              </h2>
            </AbsoluteFill>
          </Sequence>
        </div>
      )})}
      {audioUrl && (<Html5Audio src={audioUrl} />) }
    </AbsoluteFill>
  )
}

export default RemotionVideo