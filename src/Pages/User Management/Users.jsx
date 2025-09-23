import { useEffect, useRef, useState } from "react";
import { Table, Modal, Input, Button, Upload, message } from "antd";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import defaultProfile from "../../assets/Images/profile (1).png";
import { useNavigate } from "react-router-dom";
import { useDeleteUserByIdMutation, useGetExportUsersMutation, useGetUserQuery } from "../../redux/slices/apiSlice";
import DateRangePicker from "../../Components/DateRangePicker";
import Search from "antd/es/input/Search";
import { getError } from "../../utils/error";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  const [currentPage,setCurrentPage] = useState(1);
  const [limit,setLimit] = useState(10);
  const [start,setStart] = useState('');
  const [end,setEnd] = useState('');
  const [search,setSearch] = useState('');


  const {data,isFetching} = useGetUserQuery({page:currentPage,limit,search});
  const [getExport, {isLoading}] = useGetExportUsersMutation({start,end});

  const [deleteUser,{isLoading:deleteLoading}] = useDeleteUserByIdMutation();

  



  
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
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const data = await deleteUser(id).unwrap();
       
            message.success(
              data?.message || "User deleted successfully."
            );
          
        } catch (error) {
          getError(error)
        }
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
    setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
    setIsEditModalOpen(false);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
     setLimit(pagination.pageSize);
  };

  const handleExport = async()=>{
    try {
      const data = await getExport({start,end}).unwrap();
      console.log(data);
      if (data?.url) {
    // window.open(data.url, '_blank');
    const link = document.createElement('a');
    link.href = data.url;
    link.setAttribute('download', 'users-report.xlsx'); 
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
    } catch (error) {
      getError(error)
    }
  }
  
  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1 + limit * (currentPage - 1) ,
    },
    {
      title: "Profile Image",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (image) => (
        image ? <img src={image} alt="Profile" className="w-10 h-10 rounded-full" /> : 'N/A'
      ),
    },
    { title: "First Name", dataIndex: "firstname", key: "firstname" },
    { title: "Last Name", dataIndex: "lastname", key: "lastname" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phone_no", key: "phone_no" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleString() : "-"
    },
        {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <FiEye
            className="cursor-pointer text-green-500"
            size={18}
            onClick={() => navigate(`/users/profile/${record?.id}`, { state: { user: record } })}
          />
          {/* <FiEdit
            className="cursor-pointer text-blue-500"
            size={18}
            onClick={() => handleEdit(record)}
          /> */}
          <FiTrash
            className="cursor-pointer text-red-500"
            size={18}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="p-4 overflow-x-auto">
     
     <div className="border bg-white rounded mb-2 p-3 flex justify-between">
       <Search
        placeholder="Search by name or email..."
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
   title={()=><h1 className="text-xl font-semibold">Users</h1>}
    
  columns={columns}
  dataSource={data?.data?.data?.map((user) => ({ ...user, key: user?.id }))}
  pagination={{
    position:['bottomLeft'],
    current: currentPage,
    pageSize: limit,
    total: data?.data?.total, 
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

export default Users;
