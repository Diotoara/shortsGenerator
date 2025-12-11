import React, { useState } from 'react'
import {Thumbnail} from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import { PlayerDialog } from './PlayerDialog';
function VideoList({videoList}:{videoList:any}){
  const[openPlayerDialog, setOpenPlayerDialog] = useState<any>(false)
  const [videoId, setVideoId] = useState();
  return (
    <div className='mt-10 grid grid-cols-2 md:grid-cols-3 rounded-md '>
      {videoList?.map((video:any,index:any)=>(
        <div key={index} onClick={()=>{setOpenPlayerDialog(Date.now());setVideoId(video?.id)}} >
          <Thumbnail className='rounded-md cursor-pointer hover:scale-110 transition-all '
            component={RemotionVideo}
            compositionWidth={300}
            compositionHeight={450}
            frameToDisplay={30}
            durationInFrames={120}
            fps={30}
            inputProps={{
              ...video,
              setDurationinFrame:(v:any)=>console.log(v)
            }}
          />
        </div>
      ))}
      <PlayerDialog playVideo={openPlayerDialog} videoId={videoId}/>
    </div>
  )
}

export default VideoList