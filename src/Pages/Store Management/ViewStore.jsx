import React from 'react'
import StoreCard from '../../Components/Cards/StoreCard'
import { useGetStoreByIdQuery } from '../../redux/slices/apiSlice'
import { useParams } from 'react-router-dom';
import ProfileCard from '../../Components/Cards/ProfileCard';
import { Spin } from 'antd';

function ViewStore() {

    const {id} = useParams();

    const { data,isLoading} = useGetStoreByIdQuery(id,{skip: !id});


  return (
    <div>

    <h3>View Store</h3>
    {isLoading?
    
      <div className="text-center mt-5">
            <Spin size="large" className="m-auto"/>
            </div>
            :
    <StoreCard data={data?.data}/>
    }
    </div>
  )
}

export default ViewStore