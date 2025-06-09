import { Card, Tabs, Table, Dropdown, Menu, Button, Image } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import image from "../../assets/Images/trout-underwater-260nw-130186676.webp";
import { useGetBulkOrderByIdQuery, useGetOrderByIdQuery, useUpdateBulkOrderByIdMutation } from "../../redux/slices/apiSlice";
import { FaCheck, FaLocationDot } from "react-icons/fa6";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import { OrderStatuses } from "../../utils/constants";
import { useEffect, useState } from "react";
import { newSocket } from "../../utils/socket";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/slices/authSlice";
import { newUserSocket } from "../../utils/userSocket";


const { Meta } = Card;

const ViewOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();
    const {data,isLoading,refetch} = useGetOrderByIdQuery(id)  
    const [order,setOrder] = useState(null);
    const [priceByAdmin,setPriceByAdmin] = useState(null);
    const [status,setStatus] = useState(null);
    const [loading,setLoading] = useState(false)

  const {token} = useSelector(selectAuth);


    const [updateBulkOrder,{isLoading:updateLoading}] = useUpdateBulkOrderByIdMutation();
   

    useEffect(()=>{
          if(data?.data){
            setOrder(data?.data)
            setPriceByAdmin(data?.data?.priceByAdmin)
          }
    },[data])

const handleStatusChange = async (status,record) => {
    try {

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

    const [socket, setSocket] = useState(null);
    
    useEffect(() => {
      const socketInstance = newUserSocket(token);
      
      setSocket(socketInstance);
  
      return () => socketInstance.close();
    }, []);

   const handleFireOrder = async (e) => {
    e.preventDefault();
    try {
      console.log('order',order?.id);

     setLoading(true);

     await socket.emit("fire-order", {
    orderId: order?.id
    }
   );

   setLoading(false)
   toast.success("Order ready to pickup"); 

  refetch();
     
    } catch (error) {
      setLoading(false);
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

    function toOrderStatus(statusKey) {
    switch (statusKey) {
      case "notAccepted":
      case "pickup":
      case "confirmDetails":
        return "PLACED";
      case "drop":
      case "dropped":
        return "OUT_FOR_DELIVERY";
      case "proof":
        return "DELIVERED";
      case "cancelled":
        return "CANCELLED";
      default:
        return null;
    }
  }
  
  const statusColorMap = {
    PLACED: "text-blue-600 bg-blue-50",
    OUT_FOR_DELIVERY: "text-orange-600 bg-orange-50",
    DELIVERED: "text-green-600 bg-green-50",
    CANCELLED: "text-red-600 bg-red-50",
  };
  
  function formatStatusLabel(status) {
    if (!status) return "Unknown";
    return status
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }


  const orderBtn=(record) => {
    const mappedStatus = toOrderStatus(record?.orderStatus);
    const colorClass = statusColorMap[mappedStatus] || "text-gray-600 bg-gray-100";
    const label = formatStatusLabel(mappedStatus);

    return (
      <span className={`px-2 py-1 rounded-full text-sm  text-nowrap font-medium ${colorClass}`}>
        {label}
      </span>
    );
  }

  const StatusBtn =(record)=>{
  const currentKey = record?.orderStatus;
      
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
      menu={{
        items: menuItems,
        onClick: ({ key }) => handleStatusChange(key,record),
      }}
      disabled
    >
      <div className=" border rounded-lg text-center" style={{ color: OrderStatuses?.find(s => s.key === currentKey)?.color }}>
        {OrderStatuses?.find((s) => s.key === currentKey)?.label || "Select Status"}
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
        render: (_, record) => record?.product_variant?.product?.name,
      },
    {
        title: "Product Variant Name",
        key: "productVariantName",
        render: (_, record) => record?.product_variant?.name,
      },
    {
        title: "Quantity",
        key: "quantity",
        render: (_, record) => record?.quantity,
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
                <p className="mt-2 text-center">📍 Address</p>
                <p className="my-0 text-center">House Name: {order?.address?.address?.houseName}</p>
                <p className="my-0 text-center">House Number: {order?.address?.address?.houseNumber}</p>
                <p className="my-0 text-center">Flat Number {order?.address?.address?.flatNumber}</p>
                <p className="my-0 text-center">Address: {order?.address?.address?.address}</p>


                <div className="text-center mx-auto">
                 <div className="max-w-[150px] text-center mx-auto font-bold">
                   <p className="text-center  mt-3">Order Status:</p>
                   {orderBtn(order)}
                  
                  </div>   
                 <div className="max-w-[150px] text-center mx-auto font-bold">
                   <p className="text-center  mt-3">Delivery Status:</p>
                   {StatusBtn(order)}
                  
                  </div>   

                  </div>

                  

<div className="grid grid-cols-2 mt-3 gap-1">
                <p className=""><span className="font-semibold">Created on:</span> {order?.createdAt

                 ? new Date(order?.createdAt).toLocaleString() : "-"}
                </p>
<p className=" "><span className="font-semibold">Payment Made:</span> <span className={`${order?.paymentMade?'text-green-600':'text-red-600'}`}>{order?.paymentMade?'Paid':'Not Paid'}</span></p>
<p className=""><span className="font-semibold">Payment Mode:</span> {order?.paymentMode}</p>
<p className=""><span className="font-semibold">Delivery Partner Earnings:</span> AED {order?.earnings}</p>
<p className=""><span className="font-semibold">Delivery Type:</span> {order?.delivery}</p>
<p className=""><span className="font-semibold">Delivery cost:</span> AED {order?.delivery_cost}</p>
<p className=""><span className="font-semibold">Store:</span> {order?.store?.name}</p>
<p className=""><span className="font-semibold">Delivery By:</span> {order?.deliveryBy

? new Date(order?.deliveryBy).toLocaleString() : "-"}</p>

</div>

<p className="mt-2 font-semibold">Special Request:<span className="border rounded-md ms-2 px-2">{order?.special_req}</span></p>
                  
                  <div className="text-center">

{order?.delivery === 'Next-Day Delivery' &&
   <Button loading={loading} disabled={order?.readytoPickUp} onClick={handleFireOrder} className={`bg-green-500 mt-2 font-semibold`}>
            Order Ready to Pickup ?
    </Button>
}
                  </div>

                 
              </Card>
            ) : (
              <p className="text-center text-red-500">No data selected.</p>
            )}
          </div>

       

        {/* Orders Tab */}
             <Card title="Items" className="mt-3">

            <Table
            columns={columns}
              loading={isLoading}
              dataSource={order?.order_items?.map((order) => ({
                ...order,
                key: order.id,
              }))}
              pagination={false}
            />
            </Card>

                {order?.image &&
           <Card title="Delivery Proofs" className="mt-3">
      <Image.PreviewGroup>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {Object.values(order?.image).map((url, index) => (
            <Image
              key={index}
              width={120}
              height={120}
              src={url}
              alt={`Proof ${index + 1}`}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          ))}
        </div>
      </Image.PreviewGroup>
     </Card>

        }

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
