import { Card, Tabs, Table, Dropdown, Menu, Button } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import image from "../../assets/Images/trout-underwater-260nw-130186676.webp";
import { useGetBulkOrderByIdQuery, useGetOrderByIdQuery, useUpdateBulkOrderByIdMutation } from "../../redux/slices/apiSlice";
import { FaCheck, FaLocationDot } from "react-icons/fa6";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import { BulkOrderStatuses } from "../../utils/constants";
import { useEffect, useState } from "react";
const { Meta } = Card;

const ViewOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();
    const {data,isLoading} = useGetOrderByIdQuery(id)  
    const [order,setOrder] = useState(null);
    const [priceByAdmin,setPriceByAdmin] = useState(null);
    const [status,setStatus] = useState(null);



    const [updateBulkOrder,{isLoading:updateLoading}] = useUpdateBulkOrderByIdMutation();
   

    useEffect(()=>{
          if(data?.data){
            setOrder(data?.data)
            setPriceByAdmin(data?.data?.priceByAdmin)
          }
    },[data])

const handleStatusChange = async (status,record) => {
    try {

            console.log('status',status);
            const data = await updateBulkOrder({data:{
              orderStatus:status,
            },groupId:order?.groupId});

            toast.success("Status updated"); 
            //     status: newStatus,
    //   });
  
    } catch (error) {
      getError(error);
    }
  };
const handleSave = async () => {
    try {

            console.log('status',priceByAdmin);
            
            const data = await updateBulkOrder({data:{
              priceByAdmin:priceByAdmin
            },groupId:order?.groupId});

            toast.success("Price updated"); 
            //     status: newStatus,
    //   });
  
    } catch (error) {
      getError(error);
    }
  };



  const StatusBtn =(record)=>{
  const currentKey = record?.orderStatus;
      
  const menuItems = BulkOrderStatuses?.map((status) => ({
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
      menu={{
        items: menuItems,
        onClick: ({ key }) => handleStatusChange(key,record),
      }}
      disabled
    >
      <div className=" border rounded-lg text-center" style={{ color: BulkOrderStatuses?.find(s => s.key === currentKey)?.color }}>
        {BulkOrderStatuses?.find((s) => s.key === currentKey)?.label || "Select Status"}
      </div>
    </Dropdown>
  );
}

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
        title: "Product Image",
        key: "productImage",
        render: (_, record) => (
          <img
            src={record?.product_variant?.image}
            alt="Product"
            className="w-12 h-12 rounded"
          />
        ),
      },
    {
        title: "Product Name",
        key: "productName",
        render: (_, record) => record?.product_variant?.name,
      },
 
    //   {
    //     title: "Created At",
    //     dataIndex: "createdAt",
    //     key: "createdAt",
    //     render: (createdAt) => createdAt ? new Date(createdAt).toLocaleString() : "-"
    //   },
  ];




  return (
    <div>
      {/* Tabs at the Top */}
      
          <div className="flex w-full justify-center mt-6">
            {order ? (
              <Card
                hoverable
                style={{
                  width: "100%",
                }}
                cover={
                  order?.user?.profileImage &&
                  <img
                    alt="Profile"
                    src={order?.user?.profileImage}
                    className="!w-40 h-40 rounded-full mx-auto mt-4"
                  />
                
                }
              >
                <Meta
                  className="text-center"
                  title={order?.user?.firstname + ' ' + order?.user?.lastname }
                  description={order?.user?.email}
                />
                <p className="mt-2 text-center">📞 {order?.user?.phone_no}</p>
                <p className="mt-2 text-center">📍 {order?.address?.address}</p>


                <div className="text-center mx-auto">
                 <div className="max-w-[150px] text-center mx-auto font-bold">
                   <p className="text-center  mt-3">Order Status:</p>
                   {StatusBtn(order)}
                  
                  </div>   

                  </div>

<div className="grid grid-cols-2 mt-3 gap-1">
                <p className=""><span className="font-semibold">Created on:</span> {order?.createdAt

                 ? new Date(order?.createdAt).toLocaleString() : "-"}
                </p>
<p className=" "><span className="font-semibold">Payment Made:</span> <span className={`${order?.paymentMade?'text-green-600':'text-red-600'}`}>{order?.paymentMade?'Paid':'Not Paid'}</span></p>
<p className=""><span className="font-semibold">Payment Mode:</span> {order?.paymentMode}</p>
<p className=""><span className="font-semibold">Earnings:</span> ${order?.earnings}</p>
<p className=""><span className="font-semibold">Fast delivery:</span> {order?.isFastDelivery?'Yes':'No'}</p>
<p className=""><span className="font-semibold">Delivery cost:</span> ${order?.delivery_cost}</p>
<p className=""><span className="font-semibold">Store:</span> {order?.store?.name}</p>
<p className=""><span className="font-semibold">Delivery By:</span> {order?.deliveryBy

? new Date(order?.deliveryBy).toLocaleString() : "-"}</p>

</div>

<p className="mt-2">Special Request:<span className="border rounded-md ms-2 px-2">{order?.special_req}</span></p>
                  


                 
              </Card>
            ) : (
              <p className="text-center text-red-500">No data selected.</p>
            )}
          </div>

        {/* Orders Tab */}
          <div className="">
            <h2 className="font-bold mt-2">Order</h2>
            <Table
              columns={columns}
              loading={isLoading}
              dataSource={order?.order_items?.map((order) => ({
                ...order,
                key: order.id,
              }))}
              pagination={false}
            />
          </div>
     

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

export default ViewOrder;
