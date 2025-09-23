import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useGetUserOrdersByIdQuery,
} from "../../redux/slices/apiSlice";
import ProfileCard from "../../Components/Cards/ProfileCard";
import { Spin } from "antd";

function ViewUsers() {
  const { id } = useParams();

  const { data, isLoading } = useGetUserByIdQuery(id);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: orderData,isFetching } = useGetUserOrdersByIdQuery({id,page:currentPage,limit});
  return (
    <div>
      <h2 className="font-bold mt-2">View User</h2>

      {isLoading ?
      <div className="text-center mt-5">
        <Spin size="large" className="m-auto"/>
        </div>
      :
      <ProfileCard
        user={data?.data?.user}
        orders={orderData}
        orderLoading={isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
      />
}
    </div>
  );
}

export default ViewUsers;
