import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const PlayerDialog = ({playVideo, videoId}:{playVideo:any, videoId:any}) => {

    const [openDialog, setOpenDialog]=useState(true);
    const [videoData, setVideoData] = useState<any>();
    const [durationInFrames, setDurationinFrame] = useState(1)
    const router = useRouter();

    useEffect(()=>{
        setOpenDialog(!openDialog)
        videoId&&getVideoData(videoId)
    },[playVideo])

    const getVideoData = async(id:any) => {
        const result = await axios.post("/api/get-data",{
            id : id
        })
        const allData = result.data.result
        console.log(allData);
        setVideoData(allData)
    }

  return (
    <Dialog open={openDialog} >
  <DialogContent className="flex flex-col items-center" >
    <DialogHeader>
      <DialogTitle className="text-3xl font-bold my-5" >Your video is ready</DialogTitle>
      
        <Player
            component={RemotionVideo}
            durationInFrames={Number(durationInFrames.toFixed(0))}      //if in decimal, converts to number. no error rn.
            // durationInFrames={durationInFrames}
            compositionWidth={300}
            compositionHeight={450}
            fps={30}
            controls={true}
            inputProps={{
                ...videoData,
                setDurationinFrame:(frameValue:any)=>setDurationinFrame(frameValue)
            }}
            />
        <div className="flex justify-center gap-10 py-4" >
            <Button variant={"ghost"} onClick={()=>{router.replace('/dashboard');setOpenDialog(false)}} className="rounded-md hover:cursor-pointer p-2" >Cancel</Button>
            <Button variant={"link"} className="bg-purple-600 text-md text-white rounded-md hover:cursor-pointer p-2" >Export</Button>
        </div>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}
