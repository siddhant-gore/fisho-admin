import { useState, useEffect } from "react";
import { Table, Modal, Input, Button, Upload, message } from "antd";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDeleteProductByIdMutation, useGetAllProductsQuery, useUpdateProductByIdMutation } from "../../redux/slices/apiSlice";
import { getError } from "../../utils/error";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [imageList, setImageList] = useState([]);
  const navigate = useNavigate();
  const {data,isLoading} = useGetAllProductsQuery()
  const [deleteProduct, {isLoading:deleteLoading}] = useDeleteProductByIdMutation()
  const [updateProduct, {isLoading:updateLoading}] = useUpdateProductByIdMutation()


  


  useEffect(()=>{
  if(data?.data){
     const formattedProducts = data?.data?.map((product) => ({
          ...product,
          category: product?.category?.name || "N/A",
        }));
        setProducts(formattedProducts);
  }
  },[data])

  // Handle edit button click
  const handleEdit = (product) => {
    setEditProduct({
      ...product,
      discount_percentage: product.discount_percentage || 0,
    });
    setImageList(
      product.images?.map((url, index) => ({
        uid: index,
        name: `image-${index + 1}`,
        status: "done",
        url,
      })) || []
    );
    setIsEditModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Product?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      
      onOk: async () => {
        try {
          const response = await deleteProduct(id).unwrap();
          if (response?.data?.success) {
            message.success("Product deleted successfully.");
          } else {
            message.error(response.data.message || "Failed to delete product.");
          }
        } catch (error) {
          getError(error)
        }
      },
    });
  };

  // Handle input change for edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "discount_percentage") {
      const percentage = Math.min(100, Number(value)); // Ensure it doesn't exceed 100
      const discountedPrice = editProduct.price * (1 - percentage / 100);
      setEditProduct({
        ...editProduct,
        discount_percentage: percentage,
        discounted_price: discountedPrice.toFixed(2),
      });
    } else {
      setEditProduct({ ...editProduct, [name]: value });
    }
  };

  // Handle save for editing
  const handleSaveEdit = async () => {
    const formData = new FormData();

    // Append product fields
    Object.entries(editProduct).forEach(([key, value]) => {
      if (key !== "images") formData.append(key, value);
    });

    // Append images (new uploads only)
    imageList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    });

    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

  
    try {
      const response = await updateProduct({id:editProduct?.id,data:formData}).unwrap();
        

        message.success("Product updated successfully.");
        setIsEditModalOpen(false);
      
    } catch (error) {
      console.error(error);
      getError(error)
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
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Product Image",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images?.length > 0 ? (
          <img src={images[0]} alt="Product" className="w-10 h-10 rounded-md" />
        ) : (
          "N/A"
        ),
    },
    // {
    //   title: "Price",
    //   dataIndex: "price",
    //   key: "price",
    // },
    // {
    //   title: "Discounted Price",
    //   dataIndex: "discounted_price",
    //   key: "discounted_price",
    // },
    {
      title: "Total Quantity",
      dataIndex: "quantity",
      key: "totalQuantity",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <FiEye
            className="cursor-pointer text-green-500"
            size={18}
            onClick={() =>
              navigate("/product-card", { state: { product: record } })
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
        <Button
          type="primary"
          className="mr-4"
          onClick={() => navigate("/add-products")}
        >
          Add Product
        </Button>
      </div>

      <div className="p-4">
        <Table
          columns={columns}
          dataSource={products.map((product) => ({
            ...product,
            key: product.id,
          }))}
          pagination={false}
          loading={isLoading}
        />
      </div>

      <Modal
        title="Edit Product"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
        centered
        maskClosable={false}
        okButtonProps={{
          loading: updateLoading
        }}
      >
        <div className="flex flex-col gap-4">
          <label>Product Name:</label>
          <Input
            name="name"
            value={editProduct?.name}
            onChange={handleEditChange}
          />

          {/* <label>Price:</label>
          <Input
            name="price"
            type="number"
            value={editProduct?.price}
            onChange={handleEditChange}
          /> */}

          {/* <label>Discount Percentage:</label>
          <Input
            name="discount_percentage"
            type="number"
            min={0}
            max={100}
            value={editProduct?.discount_percentage}
            onChange={handleEditChange}
          /> */}

          {/* <label>Discounted Price:</label>
          <Input
            name="discounted_price"
            value={editProduct?.discounted_price}
            disabled
            style={{ cursor: "not-allowed" }}
          /> */}

          <label>Total Quantity:</label>
          <Input
            name="quantity"
            type="number"
            value={editProduct?.quantity}
            onChange={handleEditChange}
          />

          <label>Product Images:</label>
          <Upload
            listType="picture-card"
            fileList={imageList}
            onChange={({ fileList }) => setImageList(fileList)}
            beforeUpload={() => false}
            multiple
          >
            {imageList.length < 5 && (
              <Button icon={<PlusOutlined />}>Upload</Button>
            )}
          </Upload>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
