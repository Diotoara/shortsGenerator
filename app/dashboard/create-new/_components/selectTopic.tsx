"use client"
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';

type OnUserSelect = (fieldName: string, fieldValue: string) => void;

const SelectTopic = ({onUserSelect}:{onUserSelect:OnUserSelect}) => {
  const options = ['Custom Prompt', 'Random AI Story', 'Horror Story', 'Historical Facts', 'Motivational', 'Fun and Chill']
  const [selectedOpt, setSelectedOpt] = useState<string | undefined>();
  return (
    <div>
        <div className='text-3xl text-purple-600 font-bold' >Content</div>
        <div className='text-gray-500 text-lg '>what is the topic of your video?</div>
        <div className='mt-2'>
        <Select onValueChange={(value)=>{
            setSelectedOpt(value)
            value!='Custom Prompt' && onUserSelect('topic',value) 
            }}> 
            <SelectTrigger className="w-full p-6 text-lg"> <SelectValue placeholder="Content Type" /> </SelectTrigger>
            <SelectContent>
                {options.map((item,index)=>(
                    <SelectItem key={index} value={item}>{item}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        </div>

        {selectedOpt=='Custom Prompt'&&
            <Textarea  className='mt-3 p-5' onChange={(e)=>{
                onUserSelect('topic',e.target.value)
            }} placeholder='write your prompt here' />
        }

    </div>
  )
}

export default SelectTopic