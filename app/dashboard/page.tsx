"use client"
import Link from "next/link"
import { useState } from "react"
import EmptyList from "./_components/emptylist";

const Dashboard = () => {
  const [vids, setVids] = useState([]);
  return (
    <div className="pt-10 px-5 md:px-15" >
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-purple-600" >Dashboard</div>
        <Link href={"/dashboard/create-new"} >
          <div className="bg-purple-500 p-2 cursor-pointer text-white rounded-md ">Create New + </div>
        </Link>
      </div>
        {vids?.length===0&&<div><EmptyList/></div>}
    </div>
  )
}

export default Dashboard


