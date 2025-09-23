import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
    useGetPartnerByIdQuery,
  useGetUserByIdQuery,
  useGetUserOrdersByIdQuery,
} from "../../redux/slices/apiSlice";
import ProfileCard from "../../Components/Cards/ProfileCard";

function ViewPartner() {
  const { id } = useParams();

  const { data, isLoading } = useGetPartnerByIdQuery(id);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const { data: orderData,isFetching } = useGetUserOrdersByIdQuery({id,page:currentPage,limit});
  return (
    <div>
      <h2 className="font-bold mt-2">View Partner</h2>

      <ProfileCard
        user={data?.data}
        // orders={orderData}
        // orderLoading={isFetching}
        // currentPage={currentPage}
        // setCurrentPage={setCurrentPage}
        // limit={limit}
        // setLimit={setLimit}
      />
    </div>
  );
}

export default ViewPartner;
