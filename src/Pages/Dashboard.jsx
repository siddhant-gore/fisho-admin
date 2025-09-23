import DashCard from "../Components/Cards/DashCard";
// import { LiaTruckPickupSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";
// import { IoSettingsOutline } from "react-icons/io5";
// import { HiOutlineCurrencyEuro } from "react-icons/hi2";
import { AiOutlineProduct } from "react-icons/ai";
// import { TfiShoppingCart } from "react-icons/tfi";
import { BsCart4 } from "react-icons/bs";
import { IoFishOutline, IoStorefrontOutline } from "react-icons/io5";
import { MdOutlineDeliveryDining } from "react-icons/md";

import { io } from "socket.io-client";
import { useGetStatsQuery, useGetSubadminStatsQuery } from "../redux/slices/apiSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/slices/authSlice";


// const socket = io("http://localhost:3000", {
//   extraHeaders: {
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwicGhvbmVfbm8iOiI3OTg2MDMzNzA3Iiwicm9sZSI6ImRlbGl2ZXJ5X3BhcnRuZXIiLCJmaXJzdG5hbWUiOiJkaGlyZW4iLCJsYXN0bmFtZSI6InBhdHlhbCIsImlhdCI6MTc0MzA3NjIxMywiZXhwIjoxNzQzMTE5NDEzfQ.YqjZPzPkVzb2xIyAgqyD_f6uuu5Z5xuHoCcmI3ZAy-k",
//   },
// });

// socket.on("connect", () => {
//   console.log("Connected to WebSocket with ID:", socket.id);

//   socket.emit("rejectOrder", JSON.stringify({ orderId: 28 }), (response) => {
//     console.log("Server Response:", response);
//   });
// });

function Dashboard() {

  const { user } = useSelector(selectAuth);
  const {data:adminData,refetch:adminRefetch} = useGetStatsQuery({},{skip: user?.role === 'subadmin'});

  const {data:subadminData,refetch:subadminRefetch} = useGetSubadminStatsQuery({},{skip: user?.role ==='admin'});
  

  // useEffect(()=>{
  //   adminRefetch();
  // },[])

  return (
    <div>


    {user?.role === 'admin' &&
      <div className="flex flex-wrap justify-center gap-5 md:justify-start lg:justify-start ">
      
        <DashCard
          type={"users"}
          count={adminData?.data?.totalUsers}
          icon={<CgProfile size={30} />}
          title="Users"
          className={"bg-sky-500"}
        />
        <DashCard
          type={"category"}
          count={adminData?.data?.totalCategories}
          icon={<AiOutlineProduct size={30} />}
          title="Category"
          className={"bg-green-500"}

        />
        <DashCard
          type={"products"}
          count={adminData?.data?.totalProducts}
          icon={<BsCart4 size={30} />}
          title="Products"
          className={"bg-pink-500"}

        />
        <DashCard
          type={"products-variant"}
          count={adminData?.data?.totalVariants}
          icon={<IoFishOutline  size={30} />}
          title="Variants"
          className={"bg-purple-500"}

        />
        <DashCard
          type={"partners"}
          count={adminData?.data?.totalDeliveryPartners}
          icon={<MdOutlineDeliveryDining  size={30} />}
          title="Delivery Partners"
          className={"bg-teal-500"}

        />
        <DashCard
          type={"stores"}
          count={adminData?.data?.totalStore}
          icon={<IoStorefrontOutline  size={30} />}
          title="Stores Partners"
          className={"bg-rose-500"}

        />

        {/* <DashCard
          type={"services"}
          count={"10"}
          icon={<IoSettingsOutline size={29} />}
          title="services"
        /> */}

        {/* <DashCard
          type={"orders"}
          count={"10"}
          icon={<TfiShoppingCart size={30} />}
          title="orders"
        /> */}

        {/* <DashCard
          type={"transactions"}
          count={"0"}
          icon={<HiOutlineCurrencyEuro size={30} />}
          title="transactions"
        /> */}
      </div>
}

      {user?.role === 'subadmin' 
      &&
      <div className="flex flex-wrap justify-center gap-5 md:justify-start lg:justify-start ">
        <DashCard
          type={"orders"}
          count={subadminData?.data?.pendingCount}
          icon={<MdOutlineDeliveryDining size={30} />}
          title="Pending Orders"
          className={'bg-orange-500'}
        />
        <DashCard
          type={"orders"}
          count={subadminData?.data?.deliveredCount}
          icon={<MdOutlineDeliveryDining size={30} />}
          title="Delivered Orders"
          className={'bg-green-500'}
        />
          <DashCard
            type={"orders"}
            count={subadminData?.data?.ongoingCount}
            icon={<MdOutlineDeliveryDining  size={30} />}
            title="Ongoing Orders"
            className={'bg-yellow-500'}
          />
        <DashCard
          type={"orders"}
          count={subadminData?.data?.refundedCount}
          icon={<MdOutlineDeliveryDining size={30} />}
          title="Refunded Orders"
          className={'bg-red-500'}
        />
   

      </div>
      }
    </div>
  );
}

export default Dashboard;
