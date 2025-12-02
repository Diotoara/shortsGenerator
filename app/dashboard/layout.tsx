import Header from "./_components/Header";
import Sidebar from "./_components/sidebar";

const DashBoardLayout = ({children}:Readonly<{children: React.ReactNode;}>) => {
  return (
    <div>
      <div className="hidden md:block h-screen w-64 fixed mt-16 bg-[#F3E8FF] ">
        <Sidebar/>
      </div>
      <div>
        <div className="z-1 fixed w-full" >
          <Header/>
        </div>
        <div className="md:ml-64 pt-16 h-screen bg-linear-to-b from-[#89fffd] to-[#ffffff]" >
        {/* <div className="md:ml-64 pt-16 h-screen bg-linear-to-b from-[#ffffff] to-[#93C5FD]" > */}
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashBoardLayout