import React, { useEffect, useState } from 'react'
import TextEditor from '../../Components/TextEditor'
import { useGetDeliveryTcQuery, useUpdateTcMutation } from '../../redux/slices/apiSlice';
import { Button, message } from 'antd';

function DeliveryTc() {

    
    const {data} = useGetDeliveryTcQuery();
    const [ form,setForm] = useState(null);

    const [updateTc,{isLoading}] = useUpdateTcMutation();

    useEffect(()=>{
            if(data){
                setForm(data?.data)
            }
    },[data])


    const handleUpdate = async()=>{
        try {
          const data = await updateTc({id:form?.id,data:{tos:form?.tos}}).unwrap();
          message.success('Updated')

        } catch (error) {
          message.error(error);
          console.log(error)
        }
    }


  return (
    <div>

    
    <div>Delivery T&C</div>
<TextEditor 
  description={form?.tos} 
  onChange={(text) => setForm((prev) => ({ ...prev, tos: text }))}
/>

<Button className='mt-5 bg-green-500' disabled={isLoading} loading={isLoading} onClick={handleUpdate}>
  Update
</Button>
  </div>
  )
}

export default DeliveryTc