import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserByIdQuery } from '../../redux/slices/apiSlice';
import ProfileCard from '../../Components/Cards/ProfileCard';

function ViewUsers() {

    const {id} = useParams();

    const {data,isLoading} = useGetUserByIdQuery(id);

  return (
    <div>
            <h2 className="font-bold mt-2">View Users</h2>


       <ProfileCard user={data?.data?.user}/>


    </div>
  )
}

export default ViewUsers