import { useEffect, useRef, useState } from "react";
import { Table, Modal, Input, Button, Upload, Dropdown } from "antd";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import defaultProfile from "../../assets/Images/profile (1).png";
import { useNavigate } from "react-router-dom";
import { useDeleteBulkOrderByIdMutation, useGetBulkOrdersQuery, useGetOrdersQuery, useGetRefundsQuery, useGetUserQuery, useUpdateBulkOrderByIdMutation } from "../../redux/slices/apiSlice";
import { selectAuth } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { OrderStatuses, statusColorMap } from "../../utils/constants";
import { toast } from "react-toastify";
import { getError } from "../../utils/error";
import { FaCheck } from "react-icons/fa6";
import { newUserSocket } from "../../utils/userSocket";
import DirhamSymbol from "../../Components/DirhamSymbol";
import { formatStatusLabel, toOrderStatus } from "../../utils/func";



const Refunds = () => {
  const [orders, setOrders] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  const [currentPage,setCurrentPage] = useState(1);
  const [limit,setLimit] = useState(10);


  const {data,isFetching,refetch} = useGetRefundsQuery({page:currentPage,limit});


  const {token} = useSelector(selectAuth);
  const [socket, setSocket] = useState(null);
  const [updateBulkOrder,{isLoading:updateLoading}] = useUpdateBulkOrderByIdMutation();
  const [deleteBulkOrder,{isLoading:deleteLoading}] = useDeleteBulkOrderByIdMutation();

  
  useEffect(() => {
    const socketInstance = newUserSocket(token);
    
    setSocket(socketInstance);

    return () => socketInstance.close();
  }, []);

 useEffect(() => {
  if (socket == null) return;

  const handler = (data) => {
    setTimeout(() => {
      refetch();
    }, 3000); // 1 second delay
  };

  socket.on("newNotification", handler);

  return () => socket.off("newNotification", handler);
}, [socket]);


  const handleSend = async () => {
    try {
     

      console.log('sending');
      
      socket.emit("acceptBulkOrder", { groupId:"ba984b7a-4bbd-4fda-98e8-a57c7ce4432f" });
      console.log('sent');

     
    } catch (error) {
        console.log(error)
    }
  };

  
  const handleStatusChange = async (newStatus, record) => {
      try {

           console.log(record?.priceByAdmin)
  
              if(!record?.priceByAdmin){

                toast.warn("Update the price before  the status"); 
                return;

              }
                
                const data = await updateBulkOrder({data:{orderStatus:newStatus},groupId:record?.groupId});
  
                 toast.success("Status updated"); 
              //     status: newStatus,
      //   });
    
      } catch (error) {
        getError(error);
      }
    };


  const handleDeleteBulkOrder = async (id) => {
      try {
  
              const data = await deleteBulkOrder(id);
  
                 toast.success("Order deleted"); 
              //     status: newStatus,
      //   });
    
      } catch (error) {
        getError(error);
      }
    };

 

  
  // useEffect(() => {
  //   if (!token) return;

  //   socketRef.current = socket(token);

  //   socketRef.current.on("connect", () => {
  //     console.log("Connected to socket:", socketRef.current.id);
  //   });

  //   socketRef.current.on("newBulkOrder", (orderData) => {
  //     console.log("Received new bulk order:", orderData);

  //   });

  //   return () => {
  //     socketRef.current.off("newBulkOrder");
  //     socketRef.current.disconnect();
  //   };
  // }, [token]);



  const handleEdit = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Order?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async() => {
       await handleDeleteBulkOrder(id)
      },
    });
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setEditUser({
        ...editUser,
        profileImage: URL.createObjectURL(info.file.originFileObj),
      });
    }
  };

  const handleSaveEdit = () => {
    setOrders(orders.map((user) => (user.id === editUser.id ? editUser : user)));
    setIsEditModalOpen(false);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  
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
        <div className="flex justify-around gap-3">
          <FiEye
            className="cursor-pointer text-green-500"
            size={18}
            onClick={() => navigate(`/orders/refunds/${record?.id}`, { state: { user: record } })}
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
    { title: "Refund Id", 
       key: "refundId",
       render: (data) =><span>#{data?.id}</span>,
      },
    { title: "Order Id", 
       key: "orderId",
       render: (data) =><span>#{data?.order?.id}</span>,
      },
       {
      title: "Order Status",
      key: "orderStatus",
      render: (_, record) => {
        const mappedStatus = toOrderStatus(record?.order?.orderStatus);
        const colorClass = statusColorMap[mappedStatus] || "text-gray-600 bg-gray-100";
        const label = formatStatusLabel(mappedStatus);
    
        return (
          <span className={`px-2 py-1 rounded-full text-sm  text-nowrap font-medium ${colorClass}`}>
            {label}
          </span>
        );
      },
    },
    { title: "First Name", 
       key: "firstname",
       render: (data) => data?.user?.firstname
      },
    { title: "Last Name", 
       key: "lastname",
       render: (data) => data?.user?.lastname
      },
    { title: "Email", 
       key: "email",
       render: (data) => data?.user?.email
      },
    { title: "Phone", 
       key: "phone",
       render: (data) => data?.user?.phone_no
      },
    // { title: "Order Price ($)", 
    //    key: "priceByAdmin",
    //    render: (data) => data?.priceByAdmin || 'N/A'
    //   },
     
    { title: "Delivery Type", 
       key: "delivery",
       render: (data) => data?.order?.delivery,
       className:"text-nowrap"

      },
//       {
//   title: "Order Status",
//   key: "orderStatus",
//   render: (_, record) => {
//     const mappedStatus = toOrderStatus(record?.order?.orderStatus);
//     const colorClass = statusColorMap[mappedStatus] || "text-gray-600 bg-gray-100";
//     const label = formatStatusLabel(mappedStatus);

//     return (
//       <span className={`px-2 py-1 rounded-full text-sm  text-nowrap font-medium ${colorClass}`}>
//         {label}
//       </span>
//     );
//   },
// }
// ,
    //   {
    //     title: "Delivery Status",
    //     key: "deliveryStatus",
    //     render: (_, record) => {
    //         const currentKey = record?.orderStatus;
      
    //         const menuItems = OrderStatuses?.map((status) => ({
    //           key: status.key,
    //           label: (
    //             <div
    //               style={{
    //                 display: "flex",
    //                 alignItems: "center",
    //                 gap: 8,
    //                 fontWeight: status.key === currentKey ? "bold" : "normal",
    //                 backgroundColor: status.key === currentKey ? "#f0f5ff" : undefined,
    //                 color: status.color,
    //               }}
    //             >
    //               {status.key === currentKey && <FaCheck />}
    //               {status.label}
    //             </div>
    //           ),
    //         }));
      
    //         return (
    //           <Dropdown
    //             disabled
    //             className="pointer-events-none"
    //             menu={{
    //               items: menuItems,
    //               onClick: ({ key }) => handleStatusChange(key, record),
    //             }}
    //           >
    //             <div className=" border rounded-full  text-nowrap text-center" style={{ color: OrderStatuses.find(s => s.key === currentKey)?.color }}>
    //               {OrderStatuses?.find((s) => s.key === currentKey)?.label || "Select Status"}
    //             </div>
    //           </Dropdown>
    //         );
    //       },
        
    //   },

    // {
    //   title: "Products",
    //   // dataIndex: "ite",
    //   key: "items",
    //   render: (data) => data?.items?.map((item)=>item?.productVariant?.name).join(' | '),
    //   className:"text-nowrap"
    // },
    // {
    //   title: "Product Quantity",
    //   // dataIndex: "ite",
    //   key: "items",
    //   render: (data) => data?.items?.map((item)=>item?.quantity).join(' | '),
    // },
   
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleString() : "-"
    },
     
  ];

  return (
    <div>
      <div className="p-4">
     <h1 className="text-2xl mb-2"> Refunds</h1>

      <Table
      className="responsive"
  columns={columns}
  dataSource={data?.data?.map((user) => ({ ...user, key: user?.id }))}
  pagination={{
    position:['bottomLeft'],
    current: currentPage,
    pageSize: limit,
    total: data?.data?.total,
     
  }}

  rowClassName={(record) => {
    const createdAt = new Date(record.createdAt);
    const now = new Date();
    const diffInMinutes = (now - createdAt) / 60000;
    return diffInMinutes < 15 ? "new-order-row" : "";
  }}
  loading={isFetching}
  onChange={handleTableChange}
/>

      </div>

      <Modal
        title="Edit User"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <label>Profile Image:</label>
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Upload New Image</Button>
          </Upload>
          <img
            src={editUser?.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full mt-2"
          />

          <label>Name:</label>
          <Input
            name="name"
            value={editUser?.name}
            onChange={handleEditChange}
          />

          <label>Email:</label>
          <Input
            name="email"
            value={editUser?.email}
            onChange={handleEditChange}
          />

          <label>Phone Number:</label>
          <Input
            name="phone"
            value={editUser?.phone}
            onChange={handleEditChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Refunds;
