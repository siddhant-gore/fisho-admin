import { useEffect, useRef, useState } from "react";
import { Table, Modal, Input, Button, Upload, Dropdown } from "antd";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import defaultProfile from "../../assets/Images/profile (1).png";
import { useNavigate } from "react-router-dom";
import { useDeleteBulkOrderByIdMutation, useGetBulkOrdersQuery, useGetExportBulkOrdersMutation, useGetUserQuery, useUpdateBulkOrderByIdMutation } from "../../redux/slices/apiSlice";
import { selectAuth } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { OrderStatuses } from "../../utils/constants";
import { toast } from "react-toastify";
import { getError } from "../../utils/error";
import { FaCheck } from "react-icons/fa6";
import { newSocket } from "../../utils/socket";
import Search from "antd/es/input/Search";
import DateRangePicker from "../../Components/DateRangePicker";



const BulkOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  const [currentPage,setCurrentPage] = useState(1);
  const [limit,setLimit] = useState(10);
  const [start,setStart] = useState('');
  const [end,setEnd] = useState('');
  const [search,setSearch] = useState('');

  const {data,isFetching,refetch} = useGetBulkOrdersQuery({page:currentPage,limit,search});
  const [getExport, {isLoading}] = useGetExportBulkOrdersMutation({start,end});


  const {token} = useSelector(selectAuth);
  const [socket, setSocket] = useState(null);
  const [updateBulkOrder,{isLoading:updateLoading}] = useUpdateBulkOrderByIdMutation();
  const [deleteBulkOrder,{isLoading:deleteLoading}] = useDeleteBulkOrderByIdMutation();

  useEffect(() => {
     const socketInstance = newSocket(token);
     
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

  socket.on("newBulkOrder", handler);

  return () => socket.off("newBulkOrder", handler);
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

  const handleExport = async()=>{
    try {
      const data = await getExport({start,end}).unwrap();
      console.log(data);
      if (data?.url) {
    // window.open(data.url, '_blank');
    const link = document.createElement('a');
    link.href = data.url;
    link.setAttribute('download', 'bulkorders-report.xlsx'); 
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
    } catch (error) {
      getError(error)
    }
  }
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
            onClick={() => navigate(`/bulk-orders/view/${record?.groupId}`, { state: { user: record } })}
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
    // { title: "Id", 
    //    key: "groupId",
    //    render: (data) =><span>#{data?.groupId}</span>,
    //   },
     {
      title: "Products",
      // dataIndex: "ite",
      key: "items",
      render: (data) => data?.items?.map((item)=>item?.name).join(' | ')
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
    { title: "Order Price", 
       key: "priceByAdmin",
      //  dataIndex:"priceByAdmin"
       render: (data) => data?.priceByAdmin || 'N/A'
      },
      {
        title: "Order Status",
        key: "orderStatus",
        render: (_, record) => {
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
                disabled
                className="pointer-events-none"
                menu={{
                  items: menuItems,
                  onClick: ({ key }) => handleStatusChange(key, record),
                }}
              >
                <div className=" border rounded-lg  text-center" style={{ color: OrderStatuses.find(s => s.key === currentKey)?.color }}>
                  {OrderStatuses?.find((s) => s.key === currentKey)?.label || "Select Status"}
                </div>
              </Dropdown>
            );
          },
        
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
      <div className="p-4">

       <div className="border bg-white rounded mb-2 p-3 flex gap-10">
                 <Search
                  placeholder="Search by id..."
                  allowClear
                  className="max-w-64"
                  size="middle"
                  onChange={(e)=>setSearch(e.target.value)}
                />
               <div>
               <DateRangePicker 
                 onSelect={(date)=>{
                  setStart(date[0]);
                  setEnd(date[1]);
                 }}
               />
          
              <Button onClick={handleExport} className="bg-sky-400 ms-2"  loading={isLoading}>
                Export {!start || !end ?'All':'Data' }
              </Button>
              </div>
               </div>
      <Table
  title={()=><h1 className="text-xl font-semibold">Bulk Orders</h1>}
  columns={columns}
  dataSource={data?.data?.data?.map((user) => ({ ...user, key: user?.id }))}
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

export default BulkOrders;
