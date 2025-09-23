import { useState, useEffect } from "react";
import { Table, Modal, Input, Button, Upload, message, Checkbox, Radio, Switch } from "antd";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDeleteProductByIdMutation, useGetAllProductsQuery, useGetExportProductsMutation, useUpdateProductByIdMutation } from "../../redux/slices/apiSlice";
import { getError } from "../../utils/error";
import Search from "antd/es/input/Search";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [imageList, setImageList] = useState([]);
  const navigate = useNavigate();
  const [deleteProduct, {isLoading:deleteLoading}] = useDeleteProductByIdMutation()
  const [updateProduct, {isLoading:updateLoading}] = useUpdateProductByIdMutation()
  const [currentPage,setCurrentPage] = useState(1);
  
  const [search,setSearch] = useState('');
  const [limit,setLimit] = useState(10);
  const {data,isFetching:isLoading} = useGetAllProductsQuery({page:currentPage,limit,search})

  const [getExport, {isLoading:exportLoading}] = useGetExportProductsMutation();

  
const [originalImageUrls, setOriginalImageUrls] = useState([]);
const [deletedImages, setDeletedImages] = useState([]);

const handleExport = async()=>{
    try {
      const data = await getExport().unwrap();
      console.log(data);
      if (data?.url) {
    // window.open(data.url, '_blank');
    const link = document.createElement('a');
    link.href = data.url;
    link.setAttribute('download', 'products.xlsx'); 
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
    } catch (error) {
      getError(error)
    }
  }

  useEffect(()=>{
  if(data?.data?.data){
     const formattedProducts = data?.data?.data?.map((product) => ({
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
      product?.images?.map((url, index) => ({
        uid: index,
        name: `image-${index + 1}`,
        status: "done",
        url,
      })) || []
    );
    setOriginalImageUrls(product?.images || []);

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
          message.success("Product deleted successfully.");
          
        } catch (error) {
          getError(error)
        }
      },
    });
  };

  // Handle input change for edit
  const handleEditChange = (e) => {
     const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "discount_percentage") {
      const percentage = Math.min(100, Number(value)); // Ensure it doesn't exceed 100
      const discountedPrice = editProduct.price * (1 - percentage / 100);
      setEditProduct({
        ...editProduct,
        discount_percentage: percentage,
        discounted_price: discountedPrice.toFixed(2),
      });
    } else {
      setEditProduct({ ...editProduct, [name]: newValue });
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

    console.log('quantity',editProduct)
console.log(typeof(editProduct?.id));
formData.delete('category')
formData.delete('id')
formData.delete('key')
formData.delete('isDeleted')
formData.delete('createdAt')
formData.delete('updatedAt')
formData.delete('outOfStock')
// Append deleted images
if (deletedImages.length > 0) {
  deletedImages.forEach(url => formData.append("deleted_images", url));
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


  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setLimit(pagination.pageSize);
  };



  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_, __, index) => index + 1 + limit * (currentPage - 1),
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
    { title: "Delivery Type", 
       key: "delivery",
       dataIndex:"delivery_type",
       className:"text-nowrap"

     },
    {
      title: "Total Quantity (in Kg)",
      dataIndex: "quantity",
      key: "totalQuantity",
    },
//     {
//   title: "Stock Status",
//   key: "totalQuantity",
//   render: (_, record) => (
//     <div className={`text-nowrap  text-center font-semibold rounded-full ${record?.outOfStock ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
//       {record?.outOfStock ? 'Out Of Stock' : 'In Stock'}
//     </div>
//   )
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

  return (
    <div>
      <div className="flex justify-between w-full px-4">
       
         <Search
        placeholder="Search by product name..."
        allowClear
        className="max-w-64"
        // enterButton="search"
        size="middle"
        onChange={(e)=>setSearch(e.target.value)}
        // onSearch={onSearch}
      />
      <div>
        <Button
          type="primary"
          className=""
          onClick={() => navigate("/add-products")}
        >
          Add Product
        </Button>
         <Button onClick={handleExport} className="bg-sky-400 ms-2"  loading={exportLoading}>
           Export All
         </Button>
         </div>
      </div>

      <div className="p-4">
        <Table
         title={()=><h1 className="text-xl font-semibold">Products</h1>}
          columns={columns}
          dataSource={products.map((product) => ({
            ...product,
            key: product.id,
          }))}
pagination={{
    position:['bottomLeft'],
    current: currentPage,
    pageSize: limit,
    total: data?.data?.total,
  }}  
          loading={isLoading}
          onChange={handleTableChange}
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
         {/* <div className="mb-3 w-max" >
      <span className="mr-3 font-semibold" >Out Of Stock:</span>
<Switch
  checked={!!editProduct?.outOfStock}
  onChange={(checked) =>
    setEditProduct((prev) => ({
      ...prev,
      outOfStock: Boolean(checked),
    }))
  }
/>

    </div> */}
        <div className="flex flex-col gap-4">
          <label>Product Name:</label>
          <Input
            name="name"
            value={editProduct?.name}
            onChange={handleEditChange}
          />
<div>
            <label className="font-bold">Description</label>
            <Input.TextArea
              name="description"
              value={editProduct?.description}
              onChange={handleEditChange}
              rows={3}
              placeholder="Enter product description"
            />
          </div>
<div>
            <label className="font-bold">Meta Title</label>
            <Input
              name="metaTitle"
              value={editProduct?.metaTitle}
              onChange={handleEditChange}
              placeholder="Enter meta title"
            />
          </div>
<div>
            <label className="font-bold">Meta description</label>
            <Input
              name="metaDescription"
              value={editProduct?.metaDescription}
              onChange={handleEditChange}
              placeholder="Enter meta description"
            />
          </div>

            <div>
                      <label className="font-bold">Total Quantity</label>
                      <Input
                        name="quantity"
                        type="number"
                        min={0}
                        value={editProduct?.quantity}
                        // onChange={handleEditChange}
                        onChange={(e) => setEditProduct({ ...editProduct, quantity: Number(e.target.value) })}

                        placeholder="Enter total quantity"
                      />
                    </div>

                     <div>
                                <Checkbox
                                  name="featured"
                                  checked={editProduct?.featured}
                                  onChange={handleEditChange}
                                >
                                  Featured
                                </Checkbox>
                              </div>
                    
                              <div>
                                <Checkbox
                                  name="bestSellers"
                                  checked={editProduct?.bestSellers}
                                  onChange={handleEditChange}
                                >
                                  Best Sellers
                                </Checkbox>
                              </div>
                    
                          
                            <p>Delivery Type</p>
                              <Radio name='delivery_type' checked={editProduct?.delivery_type === "Express Delivery"} value="Express Delivery" onChange={handleEditChange}>Express Delivery</Radio>
                              <Radio name='delivery_type' checked={editProduct?.delivery_type === "Next-Day Delivery"} value="Next-Day Delivery" onChange={handleEditChange}>Next-Day Delivery</Radio>
                    
                              <div>
                                <label className="font-bold">Nutritional Facts</label>
                                <Input.TextArea
                                  name="nutritional_facts"
                                  value={editProduct?.nutritional_facts}
                                  onChange={handleEditChange}
                                  rows={4}
                                  placeholder="Enter nutritional facts"
                                />
                              </div>
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

         

          <label>Product Images:</label>
          <Upload
  listType="picture-card"
  accept="image/*"   
  fileList={imageList}
  onChange={({ fileList }) => {
    const currentUrls = fileList
      .filter(file => file.url && !file.originFileObj)
      .map(file => file.url);

    const removed = originalImageUrls.filter(url => !currentUrls.includes(url));
    setDeletedImages(removed);

    setImageList(fileList);
  }}
  beforeUpload={() => false}
  multiple
>
  {imageList.length < 5 && <Button icon={<PlusOutlined />}>Upload</Button>}
</Upload>

        </div>
      </Modal>
    </div>
  );
};

export default Products;
