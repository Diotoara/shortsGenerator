"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import EmptyList from "./_components/emptylist";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import VideoList from "./_components/VideoList";



const Dashboard = () => {
  const {user} = useUser();
  const [vids, setVids] = useState([]);

  useEffect(()=>{
    user&&getVideoList();
  }, [user])

  const getVideoList=async()=>{
    const result:any = await axios.post("/api/get-videoes",{
      user : user?.primaryEmailAddress?.emailAddress
    })
    const data = result.data.result
    console.log(data);
    setVids(data)
  }

  return (
    <div className="pt-10 px-5 md:px-15" >
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-purple-600" >Dashboard</div>
        <Link href={"/dashboard/create-new"} >
          <div className="bg-purple-500 p-2 cursor-pointer text-white rounded-md ">Create New + </div>
        </Link>
      </div>
        {vids?.length===0&&<div><EmptyList/></div>}
        <VideoList videoList={vids} />
    </div>
  )
}

export default Dashboard

