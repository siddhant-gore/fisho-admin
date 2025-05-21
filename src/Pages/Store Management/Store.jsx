import { useState, useEffect } from "react";
import { Table, Modal, Input, Button, Upload, message } from "antd";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDeleteStoreByIdMutation, useGetAllStoresQuery, useUpdateStoreByIdMutation } from "../../redux/slices/apiSlice";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStore, setEditStore] = useState(null);
  const [imageList, setImageList] = useState([]);
  const navigate = useNavigate();

  const {data} = useGetAllStoresQuery();
  const [deleteStoreById,{isLoading:deleteLoading}] = useDeleteStoreByIdMutation();
  const [updateStoreById,{isLoading:updateLoading}] = useUpdateStoreByIdMutation()

  
  useEffect(()=>{
    if(data?.data){
        setStores(data?.data);

    }
  },[data])

  

  // Handle edit button click
  const handleEdit = (store) => {
    setEditStore(store);
    setImageList(
      store.image
        ? [
            {
              uid: "-1",
              name: "store_image.png",
              status: "done",
              url: store.image,
            },
          ]
        : []
    );
    setIsEditModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this store?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const data = await deleteStoreById(id).unwrap();
          
        } catch (error) {
          message.error(
            error.response?.data?.message || "Error deleting store."
          );
        }
      },
    });
  };

  // Handle input change for edit
  const handleEditChange = (e) => {
    setEditStore({ ...editStore, [e.target.name]: e.target.value });
  };

  // Handle image upload change
  const handleImageChange = ({ fileList }) => {
    setImageList(fileList.slice(-1)); // Keep only the latest image
  };

  // Handle save for editing
  const handleSaveEdit = async () => {
    const formData = new FormData();
    Object.entries(editStore).forEach(([key, value]) => {
      if (key !== "image") formData.append(key, value);
    });

    if (imageList[0]?.originFileObj) {
      formData.append("image", imageList[0].originFileObj);
    }

    try {

      const data = await updateStoreById({id:editStore?.id,data:formData})

     
        message.success("Store updated successfully.");
        setIsEditModalOpen(false);
     
    } catch (error) {
      message.error(error.response?.data?.message || "Error updating store.");
    }
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Store Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img src={image} alt="Store" className="w-10 h-10 rounded-md" />
        ) : (
          "N/A"
        ),
    },
    { title: "Store Name", dataIndex: "name", key: "name" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Phone Number", dataIndex: "phone_number", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <FiEye
            className="cursor-pointer text-green-500"
            size={18}
            onClick={() =>
              navigate("/store-details", { state: { store: record } })
            }
          />
          <FiEdit
            className="cursor-pointer text-blue-500"
            size={18}
            onClick={() => handleEdit(record)}
          />
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
      <div className="flex justify-end w-full mb-4">
        <Button type="primary" onClick={() => navigate("/add-store")}>
          Add Store
        </Button>
      </div>
      <div className="p-4">
        <Table
          columns={columns}
          dataSource={stores.map((store) => ({ ...store, key: store.id }))}
          pagination={false}
        />
      </div>

      {/* Edit Store Modal */}
      <Modal
        title="Edit Store"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <label>Store Image:</label>
          <Upload
            listType="picture"
            fileList={imageList}
            onChange={handleImageChange}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload New Image</Button>
          </Upload>
          {editStore?.image && (
            <img
              src={editStore.image}
              alt="Store"
              className="w-20 h-20 rounded-md mt-2"
            />
          )}

          <label>Store Name:</label>
          <Input
            name="name"
            value={editStore?.name || ""}
            onChange={handleEditChange}
          />

          <label>Address:</label>
          <Input
            name="address"
            value={editStore?.address || ""}
            onChange={handleEditChange}
          />

          <label>Phone Number:</label>
          <Input
            name="phone_number"
            value={editStore?.phone_number || ""}
            onChange={handleEditChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Stores;
