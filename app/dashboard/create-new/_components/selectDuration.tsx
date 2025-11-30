
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

type OnUserSelect = (fieldName: string, fieldValue: string) => void;

const SelectDuration = ({onUserSelect} : {onUserSelect : OnUserSelect}) => {
  return (
    <div>
        <div className='text-3xl text-purple-600 font-bold' >Duration</div>
        <div className='text-gray-500 text-lg '>Time length of your video (in seconds)</div>
        <div className="mt-2" >
        <Select onValueChange={(value)=>{
            onUserSelect('duration', value )
        }} >
        <SelectTrigger className="w-full text-lg p-6"> <SelectValue placeholder="Select the Time Duration" /> </SelectTrigger>
        <SelectContent>
            <SelectGroup>
            <SelectItem value="20 seconds">20 seconds</SelectItem>
            <SelectItem value="30 seconds">30 seconds</SelectItem>
            <SelectItem value="60 seconds">60 seconds</SelectItem>
            </SelectGroup>
        </SelectContent>
        </Select>
        </div>
    </div>
  )
}

export default SelectDuration