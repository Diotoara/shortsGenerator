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
  const onHandleInputChange=async(fieldName : string,fieldValue:string)=>{
    setFormData(prev=>({
      ...prev,
      [fieldName] : fieldValue
    }))
  }
  useEffect(() => {
    console.log(formData);
    console.log( "this is the entitre post: ", videoScript)
  }, [formData, videoScript]);


  const getVideooScript=async()=>{
    const prompt = `
    Generate a ${formData.duration}-second video script on the topic: ${formData.topic} story. (style of story should be engaging, clever, surprising or emotionally capturing).
    Follow these rules strictly
    The video must contain scene-by-scene narration script, optimized for ${formData.duration}seconds (${formData.duration} / 5 scenes).
    Each scene must include an AI image prompt that visually matches the narration of that scene.
    Keep the script tone as if it's being narrated/voiced by Peter Griffin, with his signature sarcastic, goofy, overly-casual satirical delivery.
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
    console.log({prompt})
    const result = await axios.post('/api/get-video-script',{
      prompt: prompt
    })
    const myJson = result.data.result.scenes
    setVideoscript(myJson)
    generateAudioFile()
    setLoading(false)
  }

  const generateAudioFile=async()=>{
    let script = '';
    script = `Alright, listen up, Lois! This is the story of a haunted house... where the ghost wasn't a ghost, but... a really good cook! Yeah, that's right! So, these dumb kids move in, right? Thinking it's all spooky, cobwebs and all that jazz... but then, BAM! Smells of lasagna! They follow the smell... find the ghost-chef, and he's like, 'Wanna taste my meatloaf?' Honestly, what a twist! They eat the meatloaf... it's amazing. Turns out, the house wasn't haunted, just a guy with a culinary obsession and terrible social skills! And the twist? The ghost-chef... he's actually a relative of mine! That explains the cholesterol issues. Heh heh heh. Giggity! `
    const id = uuidv4();
    // videoScript?.forEach((item:any)=>{
    //   script=script+item?.narration + ' ';
    // })
    console.log("this is the final string of script",script);
    try {
      const resp = await axios.post('/api/generate-audio',{
        text:script,
        id,
      })
      console.log("done?: ", resp.data)
    } catch (error) {
      console.log("Error from page : ", error)
    }
    setLoading(false)
  }

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
          // getVideooScript()
          generateAudioFile();
          setLoading(true)
          }} >Create Short</Button>
        </div>
      </div>

      <CustomLoading loading={loading} />
    </div>
  )
}

export default Create