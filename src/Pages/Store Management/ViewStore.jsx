import React from 'react'
import StoreCard from '../../Components/Cards/StoreCard'
import { useGetStoreByIdQuery } from '../../redux/slices/apiSlice'
import { useParams } from 'react-router-dom';

function ViewStore() {

    const {id} = useParams();

    const { data} = useGetStoreByIdQuery(id,{skip: !id});


  return (
    <div>

    <h3>View Store</h3>
    <StoreCard data={data?.data}/>
    </div>
  )
}

export default ViewStore