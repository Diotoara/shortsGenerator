"use client"
import axios from "axios"
import { useEffect, useState } from 'react'
import SelectTopic from './_components/selectTopic'
import SelectStyle from './_components/selectStyle';
import SelectDuration from './_components/selectDuration';
import { Button } from '@/components/ui/button';
import CustomLoading from "./_components/CustomLoading";
import {v4 as uuidv4} from 'uuid'

  type form={
    topic : string,
    duration : number,
    imageStyle : string,
  }

const Create = () => {
  const [formData,setFormData] = useState<form>({topic:"",duration:0,imageStyle:""});
  const [loading, setLoading] = useState(false)
  const [videoScript, setVideoscript] = useState<[]>()
  const [audioFileUrl, setAudioFileUrl]=useState();
  const [caption, setCaption] = useState();
  const [imageList, setImageList] = useState([]);

  const vidSCRIPT:any = [
  {
    sceneNumber: 9,
    narration: "Greatness doesn't arrive in a single moment—it's crafted quietly, in the hours nobody sees.",
    imagePrompt: "Watercolor painting style; soft pastel tones, gentle brush strokes, character sitting by a window journaling as sunlight diffuses through sheer curtains.",
    duration: 4
  },
  {
    sceneNumber: 10,
    narration: "When the world feels overwhelming, remember—your calm mind is your strongest weapon.",
    imagePrompt: "Low-poly 3D art style; geometric mountains and trees, character meditating on a cliff edge, sunrise made of polygon gradients.",
    duration: 4
  }
]


  const onHandleInputChange=async(fieldName : string,fieldValue:string)=>{
    setFormData(prev=>({
      ...prev,
      [fieldName] : fieldValue
    }))
  }
  useEffect(() => {
    console.log(formData);
    console.log( "this is the entitre post: ", videoScript)
    if (imageList.length > 0) {
            console.log("✅ STATE UPDATE CONFIRMED:", imageList);
            console.log("Total images in state:", imageList.length);
        }
  }, [formData, videoScript, imageList]);


  const getVideooScript=async()=>{
    const prompt = `
    Generate a ${formData.duration}-second video script on the topic: ${formData.topic} story. (style of story should be engaging, clever, surprising or emotionally capturing).
    Follow these rules strictly
    The video must contain scene-by-scene narration script, optimized for ${formData.duration}seconds (${formData.duration} / 5 scenes).
    Each scene must include an AI image prompt that visually matches the narration of that scene.
    Do not use special symbols such as exclamation marks, apostrophes, or continuous dots in narration text.
    Narration must only contain commas and periods as valid symbols.
   **Use the following image style for all scene prompts:** ${formData.imageStyle}.
    Image prompts should be highly relevant, cinematic, expressive, vivid, and tied to exact story details, not generic or unrelated.
    Script style should be interesting = curiosity driven, unexpected twist, appealing hook, emotional flow.
    Output must be valid JSON only, no additional text outside JSON.
    JSON must and only contain:
    scenes: (array of objects)
    Each scene object must contain:
    sceneNumber: (number)
    narration: (string)
    imagePrompt: (string)
    duration: (seconds)
    The story and visuals should be consistent and related across all scenes with strong logical flow.`
    const result = await axios.post('/api/get-video-script',{
      prompt: prompt
    })
    console.log("prompt ready");
    console.log(result);
    const myJson = result.data.result.scenes;
    setVideoscript(myJson)
    generateAudioFile(myJson)
  }

  const generateAudioFile=async(videoScript:any)=>{
    let script = '';
    const id = uuidv4();
    console.log("combining the string");
    videoScript?.forEach((item:any)=>{
      script=script+item?.narration + ' ';
    })
    console.log("this is the final string of script",script);
    try {
      const resp = await axios.post('/api/generate-audio',{
        text:script,
        id,
      })
      setAudioFileUrl(resp.data.audioUrl)
      console.log("audio url : " + resp.data.audioUrl)
      resp.data.audioUrl&&await generateAudioCaption(resp.data.audioUrl)
    } catch (error) {
      console.log("Error while generating audio from page : ", error)
    }
  }

  const generateAudioCaption=async(audioFileUrl:any)=>{
    try {
      const resp = await axios.post('/api/generate-caption',{
        audioFileUrl
      })
      console.log(resp.data.result)
      setCaption(resp?.data?.result)
      resp.data.result&&videoScript&&GenerateImage(videoScript);
    } catch (error) {
      console.log("error in generating caption : " + error)
    }
  } 

  const GenerateImage = async (videoScript: any) => {
      const imagePromises = videoScript?.map(async (element: any) => {
          const id = uuidv4();
          const resp = await axios.post('/api/generate-image', {
              prompt: element?.imagePrompt,
              id: id
          });
          console.log(resp.data.result);
          return resp.data.result;
      });
      let images:any = [];
      try {
          const results = await Promise.all(imagePromises || []);
          images = results.filter(result => result != null);
          setImageList(images)
          console.log("Successfully generated and collected images.");

      } catch (error) {
          console.error("Error in generating image batch:", error);
      }
      finally {
          console.log("all image generated", imageList);
          setLoading(false);
      }
      
  };


  return (
    <div className='pt-4 md:px-20 pb-10'>
      <div className='text-4xl text-purple-600 font-bold items-center flex justify-center' >Create New</div>
      <div className='hover:shadow-2xl transition-all ' >
        {/* selct topic */}
        <div className='bg-white p-5 mt-4 shadow-md rounded-xl' >
          <SelectTopic onUserSelect={onHandleInputChange} />

        {/* select style */}
        <div className='mt-6'>
          <SelectStyle onUserSelect={onHandleInputChange} />    
        </div>
        {/* duration */}
        <div className='mt-6' >
          <SelectDuration onUserSelect={onHandleInputChange} />
        </div>
        {/* create */}
        <Button className='w-full mt-10 text-lg' onClick={()=>{
          getVideooScript()
          // GenerateImage(vidSCRIPT);
          setLoading(true)
          }} >Create Short</Button>
        </div>
      </div>

      <CustomLoading loading={loading} />
    </div>
  )
}

export default Create