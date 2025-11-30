import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div  className=" bg-[#292c3d] flex justify-center h-screen items-center" >
      <Button variant={"default"}>Press me</Button>
      <UserButton/>
    </div>
  );
}
