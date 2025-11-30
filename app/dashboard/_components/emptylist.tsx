import Link from 'next/link'
import React from 'react'

const EmptyList = () => {
  return (
    <Link href={"/dashboard/create-new"}>
    <div className=' my-10 bg-white h-80 flex flex-col gap-2 border border-dashed border-black justify-center items-center' >
        <div>You dont have any short video created</div>
        <div className='bg-purple-500 p-1 px-2 text-white rounded-md' >Create New Short +</div>
    </div>
    </Link>
  )
}

export default EmptyList