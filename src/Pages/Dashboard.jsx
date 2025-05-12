import DashCard from "../Components/Cards/DashCard";
// import { LiaTruckPickupSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";
// import { IoSettingsOutline } from "react-icons/io5";
// import { HiOutlineCurrencyEuro } from "react-icons/hi2";
import { AiOutlineProduct } from "react-icons/ai";
// import { TfiShoppingCart } from "react-icons/tfi";
import { BsCart4 } from "react-icons/bs";

import { io } from "socket.io-client";

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
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 md:justify-start lg:justify-start ">
        <DashCard
          type={"users"}
          count={"3"}
          icon={<CgProfile size={30} />}
          title="Users"
        />
        <DashCard
          type={"category"}
          count={"3"}
          icon={<AiOutlineProduct size={30} />}
          title="Category"
        />
        <DashCard
          type={"products"}
          count={"3"}
          icon={<BsCart4 size={30} />}
          title="Products"
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
    </div>
  );
}

export default Dashboard;
