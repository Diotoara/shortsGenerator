"use client"

import { CircleUserIcon, FileVideo, PanelsTopLeft, ShieldPlus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MenuOption {
    id: number
    name: string
    path: string
    icon: any
}
const Sidebar = () => {
    const MenuOptions : MenuOption[] = [
        {
            id:1,
            name:'DashBoard',
            path:'/dashboard',
            icon:PanelsTopLeft
        },
        {
            id:2,
            name:'Create New',
            path:'/dashboard/create-new',
            icon:FileVideo
        },
        {
            id:3,
            name:'Upgrade',
            path:'/dashboard/upgrade',
            icon:ShieldPlus
        },
        {
            id:4,
            name:'Account',
            path:'/dashboard/account',
            icon:CircleUserIcon
        }
    ];
    const path = usePathname();
  return (
    <div className="bg-[#f3e8ff] rounded-r-md h-screen w-64 p-5 ">
        <div className="grid gap-3 mt-3" >
            {MenuOptions.map((item,index)=>(
                <Link href={item.path} key={index} >
                    <div className={`flex gap-3 p-3 items-center font-medium rounded-md  ${path===item.path ? `text-white bg-purple-600 cursor-default ` : `hover:bg-black hover:text-white cursor-pointer transition-all`}`}>
                        <item.icon/>
                        <h2>{item.name}</h2>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default Sidebar