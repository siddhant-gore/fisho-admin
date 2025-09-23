import { Card, Tabs, Table, Dropdown, Menu, Button, Image, Popconfirm } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import image from "../../assets/Images/trout-underwater-260nw-130186676.webp";
import { useGetBulkOrderByIdQuery, useGetOrderByIdQuery, useGetRefundByIdQuery, useRefundAmountMutation, useUpdateBulkOrderByIdMutation } from "../../redux/slices/apiSlice";
import { FaCheck, FaLocationDot } from "react-icons/fa6";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import { OrderStatuses, statusColorMap } from "../../utils/constants";
import { useEffect, useState } from "react";
import { newSocket } from "../../utils/socket";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/slices/authSlice";
import { newUserSocket } from "../../utils/userSocket";
import DirhamSymbol from "../../Components/DirhamSymbol";
import { toOrderStatus } from "../../utils/func";


const { Meta } = Card;

const ViewRefund = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();
    const {data,isLoading,refetch} = useGetRefundByIdQuery(id)  
    const [order,setOrder] = useState(null);
    const [priceByAdmin,setPriceByAdmin] = useState(null);
    const [status,setStatus] = useState(null);
    const [loading,setLoading] = useState(false)

  const {token} = useSelector(selectAuth);


    const [updateBulkOrder,{isLoading:updateLoading}] = useUpdateBulkOrderByIdMutation();
    const [refundAmount,{isLoading:refundLoading}] = useRefundAmountMutation();
   

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

            console.log('amount',priceByAdmin);
            
            const data = await refundAmount({
              orderId:order?.order?.id,
              amount:priceByAdmin,
            });

            toast.success("Amount added to user's wallet"); 

            setPriceByAdmin(null)
            //     status: newStatus,
    //   });
  
    } catch (error) {
      getError(error);
    }
  };

const alreadyRefunded = Number(order?.order?.refundAmount ?? 0);
const totalOrderAmount = Number(order?.order?.amount ?? 0);
const maxRefundableAmount = totalOrderAmount - alreadyRefunded;

   
  
 
  
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
        title: "Quantity (in Kg)",
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
                title={<div className="flex justify-between">
                <p className=" "><span className="font-semibold">Order Id:</span> <span className={`text-green-600`}>#{order?.order?.id}</span></p>
                <p className=" "><span className="font-semibold">Refund Id:</span> <span className={`text-orange-600`}>#{order?.id}</span></p>
                </div>
                }
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
                <p className="my-0 text-center">House Name: {order?.user?.addresses?.address?.houseName}</p>
                <p className="my-0 text-center">House Number: {order?.user?.addresses?.address?.houseNumber}</p>
                <p className="my-0 text-center">Flat Number {order?.user?.addresses?.address?.flatNumber}</p>
                <p className="my-0 text-center">Address: {order?.user?.addresses?.address?.address}</p>


                <div className="text-center mx-auto">
                 <div className="max-w-[150px] text-center mx-auto font-bold">
                   <p className="text-center  mt-3">Order Status:</p>
                   {orderBtn(order?.order)}
                  
                  </div>   
                    <div className="max-w-[150px] text-center mx-auto font-bold">
                   <p className="text-center  mt-3">Order Amount:</p>
                  <DirhamSymbol/> {order?.order?.amount}
                  </div>   
                 {/* <div className="max-w-[150px] text-center mx-auto font-bold">
                   <p className="text-center  mt-3">Delivery Status:</p>
                   {StatusBtn(order)}
                  
                  </div>    */}

                  </div>

                  

<div className="grid grid-cols-2 mt-3 gap-1">
                <p className=""><span className="font-semibold">Created on:</span> {order?.createdAt

                 ? new Date(order?.createdAt).toLocaleString() : "-"}
                </p>
<p className=" "><span className="font-semibold">Payment Made:</span> <span className={`${order?.order?.paymentMade?'text-green-600':'text-red-600'}`}>{order?.order?.paymentMade?'Paid':'Not Paid'}</span></p>
<p className=""><span className="font-semibold">Payment Mode:</span> {order?.order?.paymentMode}</p>
<p className=""><span className="font-semibold">Delivery Partner Earnings:</span> <DirhamSymbol/> {order?.order?.earnings}</p>
<p className=""><span className="font-semibold">Delivery Type:</span> {order?.order?.delivery}</p>
<p className=""><span className="font-semibold">Delivery cost:</span> <DirhamSymbol/> {order?.order?.delivery_cost}</p>
<p className=""><span className="font-semibold">Store:</span> {order?.order?.store?.name}</p>
<p className=""><span className="font-semibold">Delivered By:</span> {order?.order?.deliveryBy

? new Date(order?.order?.deliveryBy).toLocaleString() : "-"}</p>

</div>

<div>
  <h6 className="font-semibold mt-3">Refund Reason:</h6>
   <p>{order?.badQuality ? "Bad Quality": order?.lateDelivery?"Late Delivery":''}</p>
   <p>Comment: {order?.comment || 'N/A'}</p>
</div>
{order?.special_req &&
<p className="mt-2 font-semibold">Special Request:<span className="border rounded-md ms-2 px-2">{order?.special_req}</span></p>
}                  
        <div className="text-center">
          {alreadyRefunded < totalOrderAmount &&
  <>
    <label htmlFor="price">
      Refund Amount (<DirhamSymbol />)
    </label>

    <input
      type="number"
      id="price"
      name="priceByAdmin"
      step="0.01"
      min={1}
      max={maxRefundableAmount}
      placeholder="Enter Price"
      className="border rounded-md mx-2 p-1"
      value={priceByAdmin}
      onChange={(e) => setPriceByAdmin(e.target.value)}
    />

    {Number(priceByAdmin) > maxRefundableAmount && (
      <p className="text-red-500 mt-1">
        Refund amount cannot exceed {maxRefundableAmount}.
      </p>
    )}

    <Popconfirm
      title="Are you sure you want to refund the amount?"
      onConfirm={handleSave}
      okText="Yes"
      cancelText="No"
      disabled={
        refundLoading || 
        !priceByAdmin || Number(priceByAdmin) <=0 ||
        Number(priceByAdmin) > maxRefundableAmount
      }
    >
      <Button 
        className="mt-3"
        disabled={
          refundLoading || 
          !priceByAdmin || Number(priceByAdmin) <=0 || 
          Number(priceByAdmin) > maxRefundableAmount
        }
        loading={refundLoading}
      >
        Refund
      </Button>
    </Popconfirm>
  </>
}
  <p className="">
    <span className="font-semibold">Refunded Amount:</span> <DirhamSymbol/> {alreadyRefunded}/-
  </p>
  {totalOrderAmount === alreadyRefunded &&
  <span className="text-xs font-semibold text-red-600">Complete amount refunded</span>
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
              dataSource={order?.order?.order_items?.map((order) => ({
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

export default ViewRefund;
