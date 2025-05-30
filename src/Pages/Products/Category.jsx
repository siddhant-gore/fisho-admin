import { useState, useEffect } from "react";
import { Table, Modal, Input, Button, Upload, message } from "antd";
import { useAxiosInstance } from "../../AxiosInstance";
import { FiEdit, FiTrash } from "react-icons/fi";
import { PlusOutlined } from "@ant-design/icons";
import defaultImage from "../../assets/Images/trout-underwater-260nw-130186676.webp"; // Default category image
import { useCreateCategoryMutation, useDeleteCategoryByIdMutation, useGetAllCategoriesQuery, useUpdateCategoryByIdMutation } from "../../redux/slices/apiSlice";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    image: "",
    imagePreview: "",
  });


  const {data,isLoading} = useGetAllCategoriesQuery();
  const [createCategory,{isLoading:createLoading}] = useCreateCategoryMutation();
  const [updateCategory,{isLoading:updateLoading}] = useUpdateCategoryByIdMutation();
  const [deleteCategory,{isLoading:deleteLoading}] = useDeleteCategoryByIdMutation();

  // Fetch categories from backend

  useEffect(()=>{
 if(data?.data){
      setCategories(data?.data);

 }
  },[data])



  // Handle edit button click
  const handleEdit = (category) => {
    setEditCategory(category);
    setEditImagePreview(category.image || defaultImage);
    setIsEditModalOpen(true);
  };

  // Handle input change for edit
  const handleEditChange = (e) => {
    setEditCategory({ ...editCategory, [e.target.name]: e.target.value });
  };

  // Handle image upload for edit with preview
  const handleEditImageUpload = ({ file }) => {
    const imagePreview = URL.createObjectURL(file);
    setEditCategory((prev) => ({ ...prev, image: file }));
    setEditImagePreview(imagePreview);
  };

  // Handle save for editing
  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append("name", editCategory.name);
    if (editCategory.image instanceof File) {
      formData.append("image", editCategory.image);
    }

    try {

      const data = await updateCategory({id:editCategory?.id,data:formData}).unwrap();

     
        message.success("Category updated successfully!");
        setIsEditModalOpen(false);
    
    } catch (error) {
      message.error(
        error.response?.data?.message || "Error updating category."
      );
    }
  };

  // Handle input change for adding new category
  const handleAddChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  // Handle image upload for new category with preview
  const handleImageUpload = ({ file }) => {
    const imagePreview = URL.createObjectURL(file);
    setNewCategory((prev) => ({ ...prev, image: file, imagePreview }));
  };

  // Cleanup preview URL to avoid memory leaks
  const handleModalClose = () => {
    if (newCategory.imagePreview) {
      URL.revokeObjectURL(newCategory.imagePreview);
    }
    setNewCategory({ name: "", image: "", imagePreview: "" });
    setIsAddModalOpen(false);
  };

  // Handle save for adding a new category (API Call)
  const handleSaveNew = async () => {
    if (!newCategory.name.trim()) {
      message.error("Category name is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);

    if (newCategory.image) {
      formData.append("image", newCategory.image);
    } else {
      message.error("Please upload a category image.");
      return;
    }

    try {
      const data = await createCategory(formData).unwrap();
   
        message.success("Category added successfully!");
        handleModalClose();
    
    } catch (error) {
      message.error(error.response?.data?.message || "Error adding category.");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const data = await deleteCategory(id).unwrap();
       
            message.success(
              data.message || "Category deleted successfully."
            );
          
        } catch (error) {
          message.error(
            error.response?.data?.message || "Error deleting category."
          );
        }
      },
    });
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
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image || defaultImage}
          alt="Category"
          className="w-10 h-10 rounded-md"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
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
        <Button
          type="primary"
          className="mr-4"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Category
        </Button>
      </div>

      <div className="p-4">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={categories.map((category) => ({
            ...category,
            key: category.id,
          }))}
          pagination={false}
          locale={{ emptyText: "No category added yet" }} // Custom message for empty array
        />
      </div>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <label>Category Name:</label>
          <Input
            name="name"
            value={editCategory?.name || ""}
            onChange={handleEditChange}
          />

          <label>Current Category Image:</label>
          <img
            src={editImagePreview || defaultImage}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-md"
          />

          <label>Change Category Image:</label>
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleEditImageUpload}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload New</div>
            </div>
          </Upload>
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        title="Add Category"
        open={isAddModalOpen}
        onOk={handleSaveNew}
        okButtonProps={{
          loading: createLoading || updateLoading
        }
        }
        onCancel={handleModalClose}
      >
        <div className="flex flex-col gap-4">
          <label>Category Name:</label>
          <Input
            name="name"
            value={newCategory.name}
            onChange={handleAddChange}
          />

          <label>Category Image:</label>
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageUpload}
          >
            {newCategory.imagePreview ? (
              <img
                src={newCategory.imagePreview}
                alt="Preview"
                className="w-full h-full "
              />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
