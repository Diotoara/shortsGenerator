"use client"
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

const CustomLoading = ({loading}:{loading:boolean}) => {
  return (
    <div>
        <AlertDialog open={loading} >
        <AlertDialogContent>
            <div className="flex items-center justify-center flex-col pb-5" >
                <Image src={"/progress.gif"} alt="progress.." width={100} height={100} />
                <div className="text-lg font-semibold" >Creating Video... do not refresh</div>
            </div>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}

export default CustomLoading