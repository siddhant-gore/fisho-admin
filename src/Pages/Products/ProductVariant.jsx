import { useState, useEffect } from "react";
import { Table, Modal, Input, Button, message, Upload } from "antd";
import { useAxiosInstance } from "../../AxiosInstance";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const ProductVariants = () => {
  const [variants, setVariants] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editVariant, setEditVariant] = useState(null);
  const [imageList, setImageList] = useState([]);
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  // Fetch product variants from backend
  const fetchVariants = async () => {
    try {
      const response = await axiosInstance.get("/product-variant/findall");
      console.log(response);
      if (response.data.success) {
        setVariants(response.data.data);
      } else {
        message.error(
          response.data.message || "Failed to fetch product variants."
        );
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Error fetching product variants."
      );
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  // Handle edit button click
  const handleEdit = (variant) => {
    setEditVariant({
      ...variant,
      discount_percentage: variant.discount_percentage || 0,
    });

    setImageList(
      variant.image
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: variant.image,
            },
          ]
        : []
    );

    setIsEditModalOpen(true);
  };

  // Handle input change for edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "discount_percentage") {
      const percentage = Math.min(100, Number(value));
      const discountedPrice = editVariant.price * (1 - percentage / 100);
      setEditVariant({
        ...editVariant,
        discount_percentage: percentage,
        discounted_price: discountedPrice.toFixed(2),
      });
    } else if (name === "price") {
      const price = Number(value);
      const discountedPrice =
        price * (1 - editVariant.discount_percentage / 100);
      setEditVariant({
        ...editVariant,
        price: price,
        discounted_price: discountedPrice.toFixed(2),
      });
    } else {
      setEditVariant({ ...editVariant, [name]: value });
    }
  };

  // Handle image upload change
  const handleImageChange = ({ fileList }) => {
    setImageList(fileList.slice(-1)); // Only keep the latest image
  };

  // Handle save for editing
  const handleSaveEdit = async () => {
    const formData = new FormData();

    Object.entries(editVariant).forEach(([key, value]) => {
      if (key !== "image") formData.append(key, value);
    });

    if (imageList[0]?.originFileObj) {
      formData.append("image", imageList[0].originFileObj);
    }

    try {
      const response = await axiosInstance.patch(
        `/product-variant/update/${editVariant.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        message.success("Product variant updated successfully.");
        fetchVariants();
        setIsEditModalOpen(false);
      } else {
        message.error(
          response.data.message || "Failed to update product variant."
        );
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Error updating product variant."
      );
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Product Variant?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await axiosInstance.patch(
            `/product-variant/delete/${id}`
          );
          if (response.data.success) {
            message.success("Product deleted successfully.");
            fetchVariants();
          } else {
            message.error(response.data.message || "Failed to delete product.");
          }
        } catch (error) {
          message.error(
            error.response?.data?.message || "Error deleting product."
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
      title: "Variant Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Variant Photo",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img src={image} alt="Variant" className="w-10 h-10 rounded-md" />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Product Name",
      dataIndex: "product",
      key: "product",
      render: (product) => product?.name || "N/A",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discounted Price",
      dataIndex: "discounted_price",
      key: "discounted_price",
    },
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
        <Button type="primary" onClick={() => navigate("/add-product-variant")}>
          Add Variant
        </Button>
      </div>

      <div className="p-4">
        <Table
          columns={columns}
          dataSource={variants.map((variant) => ({
            ...variant,
            key: variant.id,
          }))}
          pagination={false}
        />
      </div>

      {/* Edit Variant Modal */}
      <Modal
        title="Edit Variant"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        centered
        onCancel={() => setIsEditModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <label>Variant Name:</label>
          <Input
            name="name"
            value={editVariant?.name || ""}
            onChange={handleEditChange}
          />

          <label>Price:</label>
          <Input
            name="price"
            type="number"
            value={editVariant?.price || ""}
            onChange={handleEditChange}
          />

          <label>Discount Percentage:</label>
          <Input
            name="discount_percentage"
            type="number"
            value={editVariant?.discount_percentage || 0}
            onChange={handleEditChange}
            suffix="%"
          />

          <label>Discounted Price:</label>
          <Input
            name="discounted_price"
            value={editVariant?.discounted_price || ""}
            disabled
          />

          <label>Total Quantity:</label>
          <Input
            name="totalQuantity"
            type="number"
            value={editVariant?.totalQuantity || ""}
            onChange={handleEditChange}
          />

          <label>Image Upload:</label>
          <Upload
            listType="picture"
            fileList={imageList}
            onChange={handleImageChange}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </div>
      </Modal>
    </div>
  );
};

export default ProductVariants;
