"use client"
import axios from "axios"
import { useEffect, useState } from 'react'
import SelectTopic from './_components/selectTopic'
import SelectStyle from './_components/selectStyle';
import SelectDuration from './_components/selectDuration';
import { Button } from '@/components/ui/button';
import CustomLoading from "./_components/CustomLoading";
import {v4 as uuidv4} from 'uuid'


type form = {
  topic: string,
  duration: number,
  imageStyle: string,
}

const Create = () => {
  const [formData, setFormData] = useState<form>({ topic: "", duration: 0, imageStyle: "" });
  const [loading, setLoading] = useState(false)
  const [videoScript, setVideoscript] = useState<any>() // Changed to 'any' for simpler type handling with arrays of objects
  const [audioFileUrl, setAudioFileUrl] = useState<string | undefined>(); // Added type
  const [caption, setCaption] = useState<any>(); // Changed to 'any'
  const [imageList, setImageList] = useState<string[]>([]); // Added type

  useEffect(() => {
    // console.log(formData);
    // console.log("this is the entitre post: ", videoScript)
    if (imageList.length > 0) {
      console.log("✅ STATE UPDATE CONFIRMED: Image List Updated");
      // console.log("Total images in state:", imageList.length);
    }
    // console.log("Captions updated : ", caption)
    // console.log("audio file generated : ", audioFileUrl)
  }, [formData, videoScript, imageList, caption, audioFileUrl]);


  // Placeholder script (Not used in final flow, but kept for context)
  // const vidSCRIPT: any = [...]


  // --- Core Functions ---

  const saveToDatabase = async (videoScript: any, audioFileUrl: string, caption: any, imageList: any) => {
    const dataToSave = {
      script: videoScript,
      audioUrl: audioFileUrl,
      caption: caption,
      imageUrls: imageList,
    }
    console.log("Attempting to save data to database:", dataToSave);
    try {
      const resp = await axios.post('/api/save-video-project', dataToSave);
      console.log("✅ Project saved successfully! ID:", resp.data.projectId);
    } catch (error) {
      console.error("❌ Error saving project to database:", error);
    } finally {
      setLoading(false);
    }
  }

  const onHandleInputChange = async (fieldName: string, fieldValue: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  // 1. Get Video Script (Initiator)
  const getVideooScript = async () => {
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
    Output must be valid JSON object only, no Markdown or extra text outside JSON. Do not wrap the JSON in triple backticks.
    The story and visuals should be consistent and related across all scenes with strong logical flow.`
    try {
      const result = await axios.post('/api/get-video-script', {
        prompt: prompt
      })
      console.log("prompt ready");
      if (result.data.result?.scenes) {
        const myJson = result.data.result.scenes;
        console.log("Script received:", myJson.length, "scenes.");
        setVideoscript(myJson);
        // Start the next chain: Audio Generation
        generateAudioFile(myJson)
      }
      else {
        console.log("error while creating script, please try again later")
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching video script:", error);
      setLoading(false);
    }
  }

  // 2. Generate Audio File
  const generateAudioFile = async (videoScript: any) => {
    let script = '';
    const id = uuidv4();
    console.log("combining the string");
    videoScript?.forEach((item: any) => {
      script = script + item?.narration + ' ';
    })
    try {
      const resp = await axios.post('/api/generate-audio', {
        text: script,
        id,
      })
      const newAudioUrl = resp.data.audioUrl;
      setAudioFileUrl(newAudioUrl)
      console.log("audio url : " + newAudioUrl)

      // Start the next chain: Caption Generation, passing the fresh URL
      newAudioUrl && await generateAudioCaption(newAudioUrl, videoScript) 
    } catch (error) {
      console.log("Error while generating audio from page : ", error)
      setLoading(false);
    }
  }

  // 3. Generate Audio Caption
  // Must accept the script and the fresh audioUrl to pass to the next function
  const generateAudioCaption = async (audioFileUrl: string, videoScript: any) => {
    try {
      const resp = await axios.post('/api/generate-caption', {
        audioFileUrl
      })
      
      const newCaption = resp?.data?.result;
      console.log("Caption data received:", newCaption);
      setCaption(newCaption) 
      console.log("caption generation ended")
      
      // Start the final chain: Image Generation, passing ALL necessary data
      videoScript && GenerateImage(videoScript, audioFileUrl, newCaption); 
      console.log("called for image generation")
      
    } catch (error) {
      console.log("error in generating caption : " + error)
      setLoading(false);
    }
  }

  // 4. Generate Image (Sequential & Finalizer)
  // Must accept the audioUrl and finalCaption arguments
  const GenerateImage = async (videoScript: any, audioUrl: string, finalCaption: any) => {
    console.log("image generation started sequentially")
    let images: string[] = []
    
    try {
      // SEQUENTIAL PROCESSING using for...of loop
      for (const item of videoScript || []) {
        const id = uuidv4();
        const prompt = item?.imagePrompt;
        console.log(`Starting image generation for prompt: ${prompt}`);
        
        // Await the response
        const resp = await axios.post('/api/generate-image', {
          prompt: prompt,
          id: id
        });
        
        const imageUrl = resp.data.result;
        console.log("image generated link : ", imageUrl);
        
        if (imageUrl) {
          images.push(imageUrl);
        }
      }
      
      setImageList(images)
      console.log("Successfully generated and collected images.");

      // Check using the PASSED ARGUMENTS (audioUrl, finalCaption)
      if (images.length > 0 && audioUrl && finalCaption) { 
        console.log("Saving to database...")
        // Call saveToDatabase with the fresh, explicit data
        await saveToDatabase(videoScript, audioUrl, finalCaption, images); 
      }
      else {
        console.log("didnt save to database. Missing data.");
        setLoading(false)
      }
      
    } catch (error) {
      console.log("Error in generating image in page.tsx: ", error)
      setLoading(false)
    }
  };


  // --- UI Render ---

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
          <Button className='w-full mt-10 text-lg' onClick={() => {
            // Start the process and set loading
            setLoading(true)
            getVideooScript()
          }} >Create Short</Button>
        </div>
      </div>

      <CustomLoading loading={loading} />
    </div>
  )
}

export default Create


// "use client"
  // import axios from "axios"
  // import { useEffect, useState } from 'react'
  // import SelectTopic from './_components/selectTopic'
  // import SelectStyle from './_components/selectStyle';
  // import SelectDuration from './_components/selectDuration';
  // import { Button } from '@/components/ui/button';
  // import CustomLoading from "./_components/CustomLoading";
  // import {v4 as uuidv4} from 'uuid'


  //   type form={
  //     topic : string,
  //     duration : number,
  //     imageStyle : string,
  //   }

  // const Create = () => {
  //   const [formData,setFormData] = useState<form>({topic:"",duration:0,imageStyle:""});
  //   const [loading, setLoading] = useState(false)
  //   const [videoScript, setVideoscript] = useState<[]>()
  //   const [audioFileUrl, setAudioFileUrl]=useState();
  //   const [caption, setCaption] = useState<[]>();
  //   const [imageList, setImageList] = useState([]);
    
  //   useEffect(() => {
  //     console.log(formData);
  //     console.log( "this is the entitre post: ", videoScript)
  //     if (imageList.length > 0) {
  //             console.log("✅ STATE UPDATE CONFIRMED:", imageList);
  //             console.log("Total images in state:", imageList.length);
  //         }
  //     console.log("Captions updated : ", caption)
  //     console.log("audio file generated : ", audioFileUrl)
  //   }, [formData, videoScript, imageList, caption, audioFileUrl]);



  //   const vidSCRIPT:any = [
  // {
  //   sceneNumber: 4,
  //   narration: "The girl realized the figure was her, trapped in an eternal nightmare, begging for release",
  //   imagePrompt: "A neon representation of the girl facing a twisted glowing reflection, showing her haunted reflection pleading for freedom",
  //   duration: 4
  // },
  // {
  //   sceneNumber: 5,
  //   narration: "She closed her eyes, wishing for light, and suddenly awoke, the clock tower still struck midnight",
  //   imagePrompt: "A neon scene of the girl awakening in a dark room, a faint clock tower glow through a window, still with hands pointing to midnight",
  //   duration: 4
  // }

  // ]

  //   const saveToDatabase=async(videoScript:any, audioFileUrl: string, caption:any, imageList:any)=>{
  //     const dataToSave = {
  //       script: videoScript,
  //       audioUrl: audioFileUrl,
  //       caption: caption,
  //       imageUrls: imageList,
  //     }
  //     console.log("Attempting to save data to database:", dataToSave);
  //     try {
  //         const resp = await axios.post('/api/save-video-project', dataToSave);
  //         console.log("✅ Project saved successfully! ID:", resp.data.projectId);
  //     } catch (error) {
  //         console.error("❌ Error saving project to database:", error);
  //     } finally {
  //         setLoading(false);
  //     }
  //   }

  //   const onHandleInputChange=async(fieldName : string,fieldValue:string)=>{
  //     setFormData(prev=>({
  //       ...prev,
  //       [fieldName] : fieldValue
  //     }))
  //   }

  //   const getVideooScript=async()=>{
  //     const prompt = `
  //     Generate a ${formData.duration}-second video script on the topic: ${formData.topic} story. (style of story should be engaging, clever, surprising or emotionally capturing).
  //     Follow these rules strictly
  //     The video must contain scene-by-scene narration script, optimized for ${formData.duration}seconds (${formData.duration} / 5 scenes).
  //     Each scene must include an AI image prompt that visually matches the narration of that scene.
  //     Do not use special symbols such as exclamation marks, apostrophes, or continuous dots in narration text.
  //     Narration must only contain commas and periods as valid symbols.
  //   **Use the following image style for all scene prompts:** ${formData.imageStyle}.
  //     Image prompts should be highly relevant, cinematic, expressive, vivid, and tied to exact story details, not generic or unrelated.
  //     Script style should be interesting = curiosity driven, unexpected twist, appealing hook, emotional flow.
  //     Output must be valid JSON only, no additional text outside JSON.
  //     JSON must and only contain:
  //     scenes: (array of objects)
  //     Each scene object must contain:
  //     sceneNumber: (number)
  //     narration: (string)
  //     imagePrompt: (string)
  //     duration: (seconds)
  //     Output must be valid JSON object only, no Markdown or extra text outside JSON. Do not wrap the JSON in triple backticks.
  //     The story and visuals should be consistent and related across all scenes with strong logical flow.`
  //     const result = await axios.post('/api/get-video-script',{
  //       prompt: prompt
  //     })
  //     console.log("prompt ready");
  //     console.log(result.data)
  //     if(result.data.result?.scenes){
  //       const myJson = result.data.result.scenes;
  //       console.log(result.data.result.scenes);
  //       setVideoscript(myJson);
  //       generateAudioFile(myJson)
  //     }
  //     else {
  //       return console.log("error while creating script, please try again later")
  //     }
  //   }

  //   const generateAudioFile=async(videoScript:any)=>{
  //     let script = '';
  //     const id = uuidv4();
  //     console.log("combining the string");
  //     videoScript?.forEach((item:any)=>{
  //       script=script+item?.narration + ' ';
  //     })
  //     console.log("this is the final string of script",script);
  //     try {
  //       const resp = await axios.post('/api/generate-audio',{
  //         text:script,
  //         id,
  //       })
  //       setAudioFileUrl(resp.data.audioUrl)
  //       console.log("audio url : " + resp.data.audioUrl)
  //       resp.data.audioUrl&&await generateAudioCaption(resp.data.audioUrl)
  //     } catch (error) {
  //       console.log("Error while generating audio from page : ", error)
  //     }
  //   }

  //   const generateAudioCaption=async(audioFileUrl:any)=>{
  //     try {
  //       const resp = await axios.post('/api/generate-caption',{
  //         audioFileUrl
  //       })
  //       console.log(resp.data.result)
  //       setCaption(resp?.data?.result)
  //       console.log("caption generation ended")
  //       GenerateImage(videoScript);
  //       console.log("callled for image generation")
        
  //     } catch (error) {
  //       console.log("error in generating caption : " + error)
  //     }
  //   }

  //   const GenerateImage = async (videoScript: any) => {
  //     console.log("image generation started")
  //     let images:any = []
  //     try {
  //       for (const item of videoScript || []) {
  //         const id = uuidv4();
  //         console.log(item.imagePrompt)
  //         const prompt=item?.imagePrompt;
  //         const resp = await axios.post('/api/generate-image', {
  //                 prompt: prompt,
  //                 id: id
  //             });
  //         console.log("image generated link : ",resp.data.result);
  //         images.push(resp.data.result)
  //       }
  //       setImageList(images)
  //       console.log("Successfully generated and collected images.");
  //       console.log(imageList)
  //       if (images.length > 0 && audioFileUrl && caption) {
  //         console.log("Saving to database...")
  //         await saveToDatabase(videoScript, audioFileUrl, caption, images);
  //       }
  //       else{
  //         console.log("didnt save to database");
  //         setLoading(false)
  //       }
  //     } catch (error) {
  //     console.log("Error in generating image in page.tsx, ", error) 
  //     }
  //   };


  //   return (
  //     <div className='pt-4 md:px-20 pb-10'>
  //       <div className='text-4xl text-purple-600 font-bold items-center flex justify-center' >Create New</div>
  //       <div className='hover:shadow-2xl transition-all ' >
  //         {/* selct topic */}
  //         <div className='bg-white p-5 mt-4 shadow-md rounded-xl' >
  //           <SelectTopic onUserSelect={onHandleInputChange} />

  //         {/* select style */}
  //         <div className='mt-6'>
  //           <SelectStyle onUserSelect={onHandleInputChange} />    
  //         </div>
  //         {/* duration */}
  //         <div className='mt-6' >
  //           <SelectDuration onUserSelect={onHandleInputChange} />
  //         </div>
  //         {/* create */}
  //         <Button className='w-full mt-10 text-lg' onClick={()=>{
  //           getVideooScript()
  //           // GenerateImage(vidSCRIPT);
  //           setLoading(true)
  //           }} >Create Short</Button>
  //         </div>
  //       </div>

  //       <CustomLoading loading={loading} />
  //     </div>
  //   )
  // }

  // export default Create