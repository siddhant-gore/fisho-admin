import { Card, Tabs, Table, Dropdown, Menu, Button } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import image from "../../assets/Images/trout-underwater-260nw-130186676.webp";
import { useGetBulkOrderByIdQuery, useUpdateBulkOrderByIdMutation } from "../../redux/slices/apiSlice";
import { FaCheck } from "react-icons/fa6";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import { BulkOrderStatuses } from "../../utils/constants";
import { useEffect, useState } from "react";
const { Meta } = Card;

const ViewBulkOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();
    const {data,isLoading} = useGetBulkOrderByIdQuery(id)  
    const [order,setOrder] = useState(null);
    const [priceByAdmin,setPriceByAdmin] = useState(null);
    const [status,setStatus] = useState(null);



    const [updateBulkOrder,{isLoading:updateLoading}] = useUpdateBulkOrderByIdMutation();
   

    useEffect(()=>{
          if(data?.data?.bulkOrder[0]){
            setOrder(data?.data?.bulkOrder[0])
            setPriceByAdmin(data?.data?.bulkOrder[0]?.priceByAdmin)
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
    >
      <div className="cursor-pointer border rounded-lg shadow-md text-center" style={{ color: BulkOrderStatuses?.find(s => s.key === currentKey)?.color }}>
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
            src={record?.image}
            alt="Product"
            className="w-12 h-12 rounded"
          />
        ),
      },
 
      
    {
      title: "Total Quantity (in KG)",
      dataIndex: "totalQuantityInKG",
      key: "totalQuantityInKG",
    },
    {
        title: "Preferred Delivery Date",
        dataIndex: "preferredDeliveryDate",
        key: "preferredDeliveryDate",
        render: (preferredDeliveryDate) => preferredDeliveryDate ? new Date(preferredDeliveryDate).toLocaleDateString() : "-"
      },
      {
        title: "Preferred Delivery Time",
        dataIndex: "preferredDeliveryTime",
        key: "preferredDeliveryTime",
      },
      {
        title: "Special Instructions",
        dataIndex: "specialInstructions",
        key: "specialInstructions",
      },
      {
        title: "Payment Mode",
        dataIndex: "paymentMode",
        key: "paymentMode",
      },
      {
        title: "Payment Made",
        key: "paymentMade",
        dataIndex: "paymentMade",
        render: (payment) => <span className={`${payment?'text-green-600':'text-red-600'}`}>{payment?'Paid':'Not Paid'}</span>

      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt) => createdAt ? new Date(createdAt).toLocaleString() : "-"
      },
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
                <p className="text-center">📅 Raised on {order?.createdAt}</p>
                  
                  <div className="text-center mx-auto">
                 <div className="max-w-[150px] text-center mx-auto font-bold">
                   <p className="text-center  mt-3">Order Status:</p>
                   {StatusBtn(order)}
                  
                  </div>   

                  {order?.orderStatus !== 'notAccepted' &&
                  <>
                  <label htmlFor="price">Price</label>
                        <input
                          type="number"
                          id="price"
                          name="priceByAdmin"
                           step="0.01"
                          placeholder="Enter Price"
                          className="border rounded-md mx-2 p-1"
                          value={priceByAdmin}
                          onChange={(e)=>setPriceByAdmin(e.target.value)}
                  />
                  <Button className="mt-3" disabled={updateLoading} loading={updateLoading} onClick={handleSave} >
                   Update price
                  </Button>
                  </>
                  } 
                  </div>
              </Card>
            ) : (
              <p className="text-center text-red-500">No data selected.</p>
            )}
          </div>

        {/* Orders Tab */}
          <div className="">
            <h2 className="font-bold mt-2">Bulk Order</h2>
            <Table
              columns={columns}
              loading={isLoading}
              dataSource={order?.items?.map((order) => ({
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

export default ViewBulkOrder;
