import React, { useEffect, useState } from 'react'
import TextEditor from '../../Components/TextEditor'
import { useGetUserPolicyQuery,  useUpdatePolicyMutation } from '../../redux/slices/apiSlice';
import { Button, message } from 'antd';

function UserPolicy() {

    
    const {data,isLoading:getLoading} = useGetUserPolicyQuery();
    const [ form,setForm] = useState(null);

    const [updateTc,{isLoading}] = useUpdatePolicyMutation();

    useEffect(()=>{
            if(data){
                setForm(data?.data?.privacyPolicy)
            }
    },[data])


    const handleUpdate = async()=>{
        try {
          const data = await updateTc({id:form?.id,data:{content:form?.content}}).unwrap();
          message.success('Updated')

        } catch (error) {
          message.error(error);
          console.log(error)
        }
    }


  return (
    <div>

    
    <div>User Privacy Policy</div>
    
<TextEditor 
  description={form?.content} 
  onChange={(text) => setForm((prev) => ({ ...prev, content: text }))}
/>

<Button className='mt-5 bg-green-500' disabled={isLoading} loading={isLoading} onClick={handleUpdate}>
  Update
</Button>
  </div>
  )
}

export default UserPolicy