import { useState, useEffect } from "react";
import { Table, Modal, Input, Button, message, Upload } from "antd";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { useDeleteProductVariantByIdMutation, useGetAllProductVariantsQuery, useGetExportVariantsMutation, useUpdateDiscountAllVariantsMutation, useUpdateProductVariantByIdMutation } from "../../redux/slices/apiSlice";
import Search from "antd/es/input/Search";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";

const ProductVariants = () => {
  const [variants, setVariants] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editVariant, setEditVariant] = useState(null);
  const [imageList, setImageList] = useState([]);
  const navigate = useNavigate();
  const [currentPage,setCurrentPage] = useState(1);
  
  const [percentage,setPercentage] = useState(0);
  const [limit,setLimit] = useState(10);
  const [search,setSearch] = useState('');
  const {data,isFetching:isLoading} = useGetAllProductVariantsQuery({page:currentPage,limit,search});
  const [updateProductVariant,{isLoading:updateLoading}] = useUpdateProductVariantByIdMutation();
  const [deleteProductVariant,{isLoading:deleteLoading}] = useDeleteProductVariantByIdMutation();
  const [updateDiscount,{isLoading:updateDisLoading}] = useUpdateDiscountAllVariantsMutation();
  const [getExport, {isLoading:exportLoading}] = useGetExportVariantsMutation();

  // Fetch product variants from backend

  useEffect(()=>{
    if(data){
     setVariants(data?.data?.data);

    }
  },[data])

  
const handleExport = async()=>{
    try {
      const data = await getExport().unwrap();
      console.log(data);
      if (data?.url) {
    // window.open(data.url, '_blank');
    const link = document.createElement('a');
    link.href = data.url;
    link.setAttribute('download', 'variants.xlsx'); 
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
    } catch (error) {
      getError(error)
    }
  }
  

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

  const handleDiscountUpdate = async()=>{
    try {
      const data = await updateDiscount({percentage}).unwrap();
      toast.success('Discount updated in all variants.');
      setIsDiscountModalOpen(false);
      setPercentage(0);
    } catch (error) {
      getError(error)
    }
  }


  // Handle save for editing
  const handleSaveEdit = async () => {
    const formData = new FormData();

     if (
      !editVariant.name ||
      !editVariant.internalCost ||
      !editVariant.price ||
      // !editVariant.quantity ||
      !editVariant.image 
      // !editVariant.weight
    ) {
      message.error("Please fill all required fields.");
      return;
    }

    Object.entries(editVariant).forEach(([key, value]) => {
      if (key !== "image") formData.append(key, value);
    });

    if (imageList[0]?.originFileObj) {
      formData.append("image", imageList[0].originFileObj);
    }

    formData.set("product",editVariant?.product?.id)



    
    try {

    

      const data = await updateProductVariant({id:editVariant?.id,data:formData}).unwrap();
      

        message.success("Product variant updated successfully.");
        setIsEditModalOpen(false);
     
    } catch (error) {
     getError(error)
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
          const data = await deleteProductVariant(id).unwrap();
         
            message.success("Product deleted successfully.");
          
        } catch (error) {
          getError(error)
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
      render: (_, __, index) =>  index + 1 + limit * (currentPage - 1)
,
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
      title: "Discount %",
      dataIndex: "discount_percentage",
      key: "discounted_percentage",
    },
    // {
    //   title: "Total Quantity",
    //   dataIndex: "quantity",
    //   key: "totalQuantity",
    // },
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


    const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  return (
    <div>
      <div className="flex justify-between w-full px-4">
         <Search
        placeholder="Search by variant name..."
        allowClear
        className="max-w-64"
        // enterButton="search"
        size="middle"
        onChange={(e)=>setSearch(e.target.value)}
        // onSearch={onSearch}
      />
      <div>
        <Button type="primary" onClick={() => navigate("/add-product-variant")}>
          Add Variant
        </Button>
        <Button onClick={() => setIsDiscountModalOpen(true)} className="bg-teal-400 ms-2">
          Global Discount
        </Button>
        <Button onClick={handleExport} className="bg-sky-400 ms-2"  loading={exportLoading}>
                   Export All
                 </Button>
       </div>
      </div>

      <div className="p-4">
        <Table
         title={()=><h1 className="text-xl font-semibold">Variants</h1>}
        loading={isLoading}
          columns={columns}
          dataSource={variants?.map((variant) => ({
            ...variant,
            key: variant.id,
          }))}
pagination={{
    position:['bottomLeft'],
    current: currentPage,
    pageSize: limit,
    total: data?.data?.total,
  }}  
      
  onChange={handleTableChange}

  />
      </div>

      {/* Edit Variant Modal */}
      <Modal
        title="Update Variants Discount Percentage"
        open={isDiscountModalOpen}
        onOk={handleDiscountUpdate}
        okButtonProps={{
          loading:updateDisLoading,
          disabled: percentage === '' || isNaN(percentage) || percentage < 0 || percentage > 100
        }}
        centered
        onCancel={() => setIsDiscountModalOpen(false)}
      >
        <div className="flex flex-col gap-4"> 
          <label>Discount Percentage:</label>
          <Input
            name="discount"
            value={percentage}
            type="number"
            min={0}
            step={1}
            onChange={(e)=>setPercentage(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        title="Edit Variant"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        okButtonProps={{
          loading:updateLoading
        }}
        centered
        onCancel={() => setIsEditModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <label>Variant Name:</label>
          <Input
            name="name"
            required
            value={editVariant?.name || ""}
            onChange={handleEditChange}
          />

          <label>Price:</label>
          <Input
            name="price"
            type="number"
            required
            min={0}
            value={editVariant?.price || ""}
            onChange={handleEditChange}
          />

          <label>Cost Price:</label>
          <Input
            name="internalCost"
            type="number"
            min={0}
            value={editVariant?.internalCost || ""}
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

          {/* <label>Total Quantity:</label>
          <Input
            name="totalQuantity"
            type="number"
            value={editVariant?.quantity || ""}
            onChange={handleEditChange}
          /> */}

          <label>Image Upload:</label>
          <Upload
            listType="picture"
            accept="image/*"   
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
