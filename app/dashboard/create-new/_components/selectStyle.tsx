import Image from 'next/image'
import React, { useState } from 'react'
type OnUserSelect = (fieldName: string, fieldValue: string) => void;
const SelectStyle = ({onUserSelect} : {onUserSelect : OnUserSelect}) => {
    const [selOpt,setSelopt] = useState<string | undefined>();
    const options = [
        {
            name : 'minecraft',
            image : '/minecraft.jpg',
        },
        {
            name:'ghibli',
            image:'/ghibli.jpg'
        },
        {
            name:'manga',
            image:'/mangaa.jpg'
        },
        {
            name:'water color',
            image:'/watercolor.jpg'
        },
        {
            name:'pencil sketch',
            image:'/sketch.jpg'
        },
    ]
  return (
    <>
    <div>
        <div className='text-3xl text-purple-600 font-bold' >Style</div>
        <div className='text-gray-500 text-lg '>select the style of your video</div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-3' >
            {options.map((item,index)=>(
                <div key={index} className={`relative hover:scale-105 transition-all ${item.name==selOpt&&'outline-4 rounded-xl outline-purple-600'}`}>
                    <Image src={item.image} alt={item.name} width={100} height={100} 
                    className={`cursor-pointer h-48 object-cover w-full rounded-lg transition-all `}
                    onClick={()=>{
                        setSelopt(item.name)
                        onUserSelect('imageStyle',item.name)
                        }} />
                    <div className='absolute p-1 bg-black bottom-0 w-full text-white text-center rounded-b-lg' >{item.name}</div>
                </div>
                
            ))}
        </div>
    </div>
    </>
  )
}

export default SelectStyle