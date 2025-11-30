import { UserButton } from "@clerk/nextjs"
import Image from "next/image"

const Header = () => {
  return (
    <div className="bg-linear-to-bl from-[#ffc0cb]  to-[#ffffff] border-b border-black h-16 px-5 flex justify-between">
        <div className="flex gap-3 items-center h-full">
          <Image className="cursor-pointer" src={"/logo.svg"} alt="img" width={35} height={35}/>
          <div className="text-2xl cursor-pointer font-bold" >Shorts Hub</div>
        </div>
        <div className="flex items-center h-full gap-4">
          <div className="cursor-pointer p-2 text-white bg-purple-600 rounded-md shadow hover:scale-105 tracking-normal" >Dashboard</div>
          <div className="scale-115 flex hover:scale-125 tracking-normal"><UserButton/></div>
        </div>
    </div>
  )
}

export default Header