import { Card, Tabs, Table, Dropdown, Button, Form, Input, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../../assets/Images/trout-underwater-260nw-130186676.webp";
import LocationPicker from "../LocationPicker";
import { formatStatusLabel, toOrderStatus } from "../../utils/func";
import { OrderStatuses, statusColorMap } from "../../utils/constants";
import { FiEye } from "react-icons/fi";
import { FaCheck, FaPen } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useGetCommunitiesQuery, useUpdateUserAddressByIdMutation } from "../../redux/slices/apiSlice";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
const { Meta } = Card;

// Sample Orders Data


const ProfileCard = ({user,orders,ordersLoading,currentPage,setCurrentPage,limit,setLimit}) => {
  const location = useLocation();
  const navigate = useNavigate();
  // const user = location.state?.user; 
 const [edit,setEdit] = useState(false);
 const [formData,setFormData] = useState(null);
 const [updateUserAddress,{isLoading}] = useUpdateUserAddressByIdMutation();
 const {data} = useGetCommunitiesQuery();



 useEffect(()=>{
    if(user){
setFormData({
   flatNumber: user?.address?.address?.flatNumber,
   houseNumber: user?.address?.address?.houseNumber,
   houseName: user?.address?.address?.houseName,
   address: user?.address?.address?.address,
   latitude: user?.address?.latitude,
   longitude: user?.address?.longitude,
   communityId: user?.communityName?.id 
})
    }
 },[user])
  // Order Table Columns
   const columns = [
      {
        title: "S.No",
        dataIndex: "id",
        key: "id",
        render: (_, record, index) => {
          const createdAt = new Date(record.createdAt);
          const isNew = (new Date() - createdAt) / 60000 < 15;
      
          return (
            <div className="relative pl-6">
              {isNew && (
                <span className="new-badge ">
                  NEW
                </span>
              )}
              {index + 1 + limit * (currentPage - 1)}
            </div>
          );
        },      
      },
          {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <div className="flex gap-3 justify-around">
            <FiEye
              className="cursor-pointer text-green-500 "
              size={18}
              onClick={() => navigate(`/orders/view/${record?.orderId}`, { state: { user: record } })}
            />
            {/* <FiEdit
              className="cursor-pointer text-blue-500"
              size={18}
              onClick={() => handleEdit(record)}
            /> */}
            {/* <FiTrash
              className="cursor-pointer text-red-500"
              size={18}
              onClick={() => handleDelete(record?.groupId)}
            /> */}
          </div>
        ),
      },
      { title: "Id", 
         key: "orderId",
         render: (data) =><span>#{data?.orderId}</span>,
        },
         {
        title: "Raised At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt) => createdAt ? new Date(createdAt).toLocaleString() : "-"
      },
        //  { title: "Delivery Type", 
        //  key: "delivery",
        //  render: (data) => data?.delivery,
        //  className:"text-nowrap"
  
        // },
        {
    title: "Order Status",
    key: "status",
    render: (_, record) => {
      const mappedStatus = toOrderStatus(record?.status);
      const colorClass = statusColorMap[mappedStatus] || "text-gray-600 bg-gray-100";
      const label = formatStatusLabel(mappedStatus);
  
      return (
        <span className={`px-2 py-1 rounded-full text-sm  text-nowrap font-medium ${colorClass}`}>
          {label}
        </span>
      );
    },
  }
  ,
        {
          title: "Delivery Status",
          key: "deliveryStatus",
          render: (_, record) => {
              const currentKey = record?.status;
        
              const menuItems = OrderStatuses?.map((status) => ({
                key: status.key,
                label: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontWeight: status.key === currentKey ? "bold" : "normal",
                      backgroundColor: status.key === currentKey ? "#f0f5ff" : undefined,
                      color: status.color,
                    }}
                  >
                    {status.key === currentKey && <FaCheck />}
                    {status.label}
                  </div>
                ),
              }));
        
              return (
                <Dropdown
                  disabled
                  className="pointer-events-none"
                  menu={{
                    items: menuItems,
                    onClick: ({ key }) => handleStatusChange(key, record),
                  }}
                >
                  <div className=" border rounded-full  text-nowrap text-center" style={{ color: OrderStatuses.find(s => s.key === currentKey)?.color }}>
                    {OrderStatuses?.find((s) => s.key === currentKey)?.label || "Select Status"}
                  </div>
                </Dropdown>
              );
            },
          
        },
  
      {
        title: "Products",
        // dataIndex: "ite",
        key: "items",
        render: (data) => data?.items?.map((item)=>item?.name).join(' | '),
        className:"text-nowrap"
      },
      {
        title: "Product Quantity",
        // dataIndex: "ite",
        key: "items",
        render: (data) => data?.items?.map((item)=>item?.quantity).join(' | '),
      },
      
     
      // { title: "Order Price ($)", 
      //    key: "priceByAdmin",
      //    render: (data) => data?.priceByAdmin || 'N/A'
      //   },
     
     
     
      
    ];

     const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleChange = (e)=>{
    const {name,value} = e.target;

    setFormData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const handleUpdate = async()=>{
    if(!formData?.communityId){
      toast.error("Please select a community.")
      return;
    }
    try {
      console.log('data',formData)
    
      const data = await updateUserAddress({id:user?.id,data:formData}).unwrap();

      toast.success("Address Updated")
      setEdit(false)

    } catch (error) {
      getError(error)
    }
  }

 const handleLocationSelect = (loc) => {
    if (formData?.latitude !== loc?.lat || formData?.longitude !== loc?.lng) {
      // setLat(loc?.lat);
      // setLng(loc?.lng);
      setFormData((prev) => ({
        ...prev,
        latitude: loc?.lat,
        longitude: loc?.lng,
        address: loc?.address
      }));
    }
  };

  return (
    <div>
      {/* Tabs at the Top */}
      <Tabs defaultActiveKey="1" centered>
        {/* Personal Information Tab */}
        <Tabs.TabPane tab="Personal Information" key="1">
          <div className="flex w-full justify-center mt-6">
            {user ? (
              <>
              <Card
                hoverable
                style={{
                  width: "100%",
                }}
                cover={
                   user?.profile &&     
                  <img
                    alt="Profile"
                    src={user?.profile}
                    className="!w-40 h-40 rounded-full mx-auto mt-4"
                  />
                }
              >
                <Meta
                  className="text-center"
                  title={user?.firstname + ' '+ user?.lastname}
                  description={user.email}
                />
                <p className="mt-2 text-center">📞 {user?.phone_no}</p>
                <p className="text-center mb-2">📅 Joined on: {new Date(user?.createdAt).toLocaleString()}</p>

               
               <>
               <Button  className={`${edit?'bg-red-500':'bg-blue-600'} my-2 text-white`} onClick={()=>
                setEdit(!edit)
                
                }>{edit?'Cancel editing':<span className="flex items-center gap-2 ">Edit Address <FaPen/></span>}</Button>
               {edit ?
               <div className=" mb-4">
                  <div>
                <Form.Item label="Floor Number">
                   <Input name="flatNumber" value={formData?.flatNumber}  onChange={handleChange}/>
                </Form.Item>
                <Form.Item label="Flat/Villa Number">
                   <Input name="houseNumber" value={formData?.houseNumber} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Building Name">
                   <Input name="houseName" value={formData?.houseName}  onChange={handleChange}/>
                </Form.Item>

             <div className="mb-4">
            <label className="font-bold ">Community Id</label>
            <Select
              name="communityId"
              value={formData?.communityId}
              onChange={(value) =>
                setFormData({ ...formData, communityId: value })
              }
              className="w-full"
            >
              <Select.Option value="">Select Community</Select.Option>
              {data?.map((cat) => (
                <Select.Option key={cat?.id} value={cat?.id}>
                  {cat?.name}
                {cat?.expressDelivery && <span className="ms-1 text-green-600">-Express Delivery</span>}
                </Select.Option>
              ))}
            </Select>
           </div>
                <Form.Item label="Select location">
            <LocationPicker initialLocation={{ lat:formData?.latitude, lng:formData?.longitude}} onLocationSelect={handleLocationSelect} />
          </Form.Item>

           <Form.Item label="Address">
            <Input.TextArea name="address" value={formData?.address} onChange={handleChange} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
          <Form.Item label="Latitude">
            <Input
              type="number"
              step="any"
              value={formData?.latitude}
              disabled
             onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Longitude">
            <Input
              type="number"
              step="any"
              value={formData?.longitude}
              disabled
              onChange={handleChange}
            />
          </Form.Item>
              </div>
                  </div>
                  
                  <Button loading={isLoading} onClick={handleUpdate} className="bg-green-800 text-white">
                    Update
                  </Button>
               </div>
              :
              <>
               <div className="flex justify-around mb-4">
               <div>
               <p>Floor Number: {user?.address?.address?.flatNumber ?? 'N/A'}</p>
               <p>Flat/Villa Number: {user?.address?.address?.houseNumber ?? 'N/A'}</p>
               <p>Building Name: {user?.address?.address?.houseName ?? 'N/A'}</p>
               <p>Latitude: {user?.address?.latitude ?? 'N/A'}</p>
               </div>
               <div>
               <p>Community Id: {user?.communityName?.id ?? 'N/A'}</p>
               <p>Community Name: {user?.communityName?.name ?? 'N/A'}</p>
               <p>Express Delivery Zone: {user?.communityName?.expressDelivery?'Yes':'No'}</p>
               <p>Longitude: {user?.address?.longitude ?? 'N/A'}</p>

                 </div> 
                 </div>

                 <p className="text-center mb-2">
                📍 Address: {user?.address?.address?.address ?? 'N/A'}
                 </p>
                                <Meta
                                  className="text-center mt-1"
                                  // title={store?.name}
                                />
                              
                              
                                <div className=" max-w-md mx-auto my-3 rounded-xl overflow-hidden">
                                <LocationPicker viewOnly={true} initialLocation={{ lat:user?.address?.latitude, lng:user?.address?.longitude}} />
                
                                </div>
                                </>
   }
                  </>
               
                
              </Card>

              </>    
            ) : (
              <p className="text-center text-red-500">No Data.</p>
            )}
          </div>
        </Tabs.TabPane>

        {/* Orders Tab */}
        {currentPage &&
        <Tabs.TabPane tab="Orders" key="2">
          <div className="p-4">
            <Table
      className="responsive"
     title={()=><h1 className="text-xl font-semibold">Orders (Total: {orders?.total})</h1>}
   
  columns={columns}
  dataSource={orders?.orders?.map((user) => ({ ...user, key: user?.id }))}
  pagination={{
    position:['bottomLeft'],
    current: currentPage,
    pageSize: limit,
    total: orders?.total,
     
  }}

  rowClassName={(record) => {
    const createdAt = new Date(record.createdAt);
    const now = new Date();
    const diffInMinutes = (now - createdAt) / 60000;
    return diffInMinutes < 15 ? "new-order-row" : "";
  }}
  loading={ordersLoading}
  onChange={handleTableChange}
/>
          </div>
        </Tabs.TabPane>
       }
      </Tabs>

      {/* Go Back Button */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
