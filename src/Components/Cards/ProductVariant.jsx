import { useState } from "react";
import { Table, Modal, Input, Button } from "antd";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi"; // Added FiEye for view action
import variantImage from "../../assets/Images/trout-underwater-260nw-130186676.webp";
import { useNavigate } from "react-router-dom";

const sampleVariants = [
  {
    id: 1,
    name: "Small Salmon",
    product: "Salmon",
    image: variantImage,
    price: "200",
    description:
      "Looking for the freshest catch or a stunning addition to your aquarium? Look no further! Our high-quality Salmon is available now, sourced responsibly and guaranteed to be fresh and flavorful.",
    discountedPrice: "180",
    totalQuantity: "50",
    discountPercentage: "10",
  },
  {
    id: 2,
    name: "Large Tilapia",
    product: "Tilapia",
    image: variantImage,
    price: "150",
    description:
      "Looking for the freshest catch or a stunning addition to your aquarium? Look no further! Our high-quality Tilapia is available now, sourced responsibly and guaranteed to be fresh and flavorful.",
    discountedPrice: "135",
    totalQuantity: "75",
    discountPercentage: "10",
  },
  {
    id: 3,
    name: "Medium Catfish",
    product: "Catfish",
    image: variantImage,
    price: "200",
    description:
      "Looking for the freshest catch or a stunning addition to your aquarium? Look no further! Our high-quality Catfish is available now, sourced responsibly and guaranteed to be fresh and flavorful.",
    discountedPrice: "180",
    totalQuantity: "60",
    discountPercentage: "10",
  },
];

const ProductVariant = () => {
  const [variants, setVariants] = useState(sampleVariants);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editVariant, setEditVariant] = useState(null);
  const navigate = useNavigate();

  // Handle edit button click
  const handleEdit = (variant) => {
    setEditVariant(variant);
    setIsEditModalOpen(true);
  };

  // Handle delete action

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Product Variant?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setVariants(variants.filter((variant) => variant.id !== id));
      },
    });
  };

  // Handle input change for edit
  const handleEditChange = (e) => {
    setEditVariant({ ...editVariant, [e.target.name]: e.target.value });
  };

  // Handle save for editing
  const handleSaveEdit = () => {
    setVariants((prev) =>
      prev.map((varnt) => (varnt.id === editVariant.id ? editVariant : varnt))
    );
    setIsEditModalOpen(false);
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_, __, index) => index + 1, // Auto-increment serial number
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
      render: (image) => (
        <img src={image} alt="Variant" className="w-10 h-10 rounded-md" />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discounted Price",
      dataIndex: "discountedPrice",
      key: "discountedPrice",
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
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
          {/* <FiEdit
            className="cursor-pointer text-blue-500"
            size={18}
            onClick={() => handleEdit(record)}
          />
          <FiTrash
            className="cursor-pointer text-red-500"
            size={18}
            onClick={() => handleDelete(record.id)}
          /> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end w-full mb-4"></div>

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
        onCancel={() => setIsEditModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <label>Variant Name:</label>
          <Input
            name="name"
            value={editVariant?.name}
            onChange={handleEditChange}
          />

          <label>Product Name:</label>
          <Input
            name="product"
            value={editVariant?.product}
            onChange={handleEditChange}
          />

          <label>Price:</label>
          <Input
            name="price"
            value={editVariant?.price}
            onChange={handleEditChange}
          />

          <label>Discounted Price:</label>
          <Input
            name="discountedPrice"
            value={editVariant?.discountedPrice}
            onChange={handleEditChange}
          />

          <label>Total Quantity:</label>
          <Input
            name="totalQuantity"
            value={editVariant?.totalQuantity}
            onChange={handleEditChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProductVariant;
