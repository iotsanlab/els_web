import { SvgIcons } from "../../assets/icons/SvgIcons";
import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <div className="w-screen h-screen bg-red-200">

      <div className="flex w-screen h-[530px] bg-black justify-center">

      <div className="bg-white h-[100%] w-[600px]">
          <h1>resim</h1>
        </div>

        <div className="w-[30px]"></div>

        <div className="bg-red-200 h-[100%] w-[600px]">
        <h1>7/24/365 Destek</h1>
        <br></br>
        <p className="w-[500px]">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste estm ipsum dolor sit, amet consectetur adipisicing elit. Ism ipsum dolor sit, amet consectetur adipisicing elit. Is nobis distinctio nesciunt. Ex tempore iure perspiciatis accusamus esse nostrum voluptatem distinctio voluptatum, molestias consequuntur sunt impedit quod amet enim?</p>
        <br></br>
        <p>Freepick kiclk</p>
        <br></br>
        <h1>buttton</h1>

        </div>

      </div>

      <div className="flex w-screen h-[220px] bg-white items-center justify-between px-[80px]">

        <div className="h-[170px] w-[250px] bg-blue-200 flex">
          <div className="w-1/4 bg-red-200">
          <SvgIcons iconName="Profile"/>
          </div>
          <div className="bg-green-200 w-3/4 bg-orange-200">
            <h5>Bizi Arayın</h5>
            <br></br>
            <h5>0530 449 1998</h5>

          </div>

        </div>

        <div className="h-[170px] w-[250px] bg-blue-200">

        </div>

        <div className="h-[170px] w-[250px] bg-blue-200">

        </div>

        <div className="h-[170px] w-[250px] bg-blue-200">

        </div>





      </div>



    </div>
  );
};

export default ProfilePage;
