import { useState, useEffect } from "react";
import { Select, Input, Button, Form, message, Checkbox, Spin } from "antd";
import { useAddProductToStoreMutation, useGetAllProductsQuery, useGetAllStoresQuery, useGetAllVariantsByProductMutation } from "../../redux/slices/apiSlice";

export default function AddProductToStore() {

  const [storeOptions, setStoreOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  
  const [availableQuantity,setAvailableQuantity] = useState(0)

  const [formData, setFormData] = useState({
    storeId: "",
    product_variantId: [null],
    quantity: "",
    express_del: false,
    availability: false,
  });


  const {data:storesData,isLoading:storeLoading} = useGetAllStoresQuery();
  const {data:productsData,isLoading:productLoading} = useGetAllProductsQuery();
  const [addProductToStore,{isLoading}] = useAddProductToStoreMutation();


  const [variantByproduct, {isLoading:variantLoading}] = useGetAllVariantsByProductMutation()

  
  useEffect(()=>{
      if(storesData){
        const stores = storesData?.data?.map((store) => ({
          label: store?.name,
          value: store?.id,
        }));
        setStoreOptions(stores);
      }
  },[storesData])

  
  useEffect(()=>{
      if(productsData){
           const products = productsData?.data?.map((product) => ({
          label: product?.name,
          value: product?.id,
           quantity: product?.quantity
        }));
        setProductOptions(products);
      }
  },[productsData])

 

  const handleProductChange = async (productId) => {
     const selected = productOptions?.find((opt) => opt.value === productId);
    setFormData((prev) => ({ ...prev, productId,product_variantId: [null] }));
    setAvailableQuantity(selected?.quantity);


    try {
        const data = await variantByproduct(productId).unwrap();

        const variants = data?.data?.map((variant) => ({
          label: variant?.name,
          value: variant?.id,
        }));
        setVariantOptions(variants);
      
    } catch (error) {
     console.error("Error fetching product variants:", error);

    }

   
    
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.storeId ||
      !formData.product_variantId ||
      !formData.quantity
    ) {
      message.error("Please fill all required fields.");
      return;
    }

    const form = new FormData();
    form.append("storeId", Number(formData.storeId));
    form.append("product_variantId", Number(formData.product_variantId));
    form.append("quantity", Number(formData.quantity));
    form.append("express_del", formData.express_del ? "true" : "false");
    form.append("availability", formData.availability ? "true" : "false");

    console.log("FormData Contents:");
    for (let pair of form.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      await addProductToStore(formData).unwrap();

      message.success("Product added to store successfully!");
      // setFormData({})
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Failed to add product.");
      } else {
        message.error("Failed to add product. Please try again.");
      }
    }
  };

  useEffect(()=>{
   console.log('data',formData)
  },[formData])

  return (
    <div>
      <div className="text-2xl text-black-400 mb-4">Add Product to Store</div>
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <div className="w-full text-xl text-white bg-[#0034BE] p-2 rounded-t-lg">
          Add Product to Store
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <Form.Item label="Store Name" className="text-gray-800 font-bold">
            {storeLoading ? (
              <Spin />
            ) : (
              <Select
                placeholder="Select Store"
                className="w-full"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, storeId: value }))
                }
                options={storeOptions}
              />
            )}
          </Form.Item>

          <Form.Item label="Product Name" className="text-gray-800 font-bold">
            {productLoading ? (
              <Spin />
            ) : (
              <Select
                placeholder="Select Product"
                className="w-full"
                // onChange={handleProductChange}
                onChange={handleProductChange}
                options={productOptions}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Product Variant"
            className="text-gray-800 font-bold"
          >
            {variantLoading ? (
              <Spin />
            ) : (
             <Select
           mode="multiple"

  placeholder="Select Variant"
  className="w-full"
  onChange={(value) => {
    const selected = variantOptions.find((opt) => opt.value === value);
    setFormData((prev) => ({ ...prev, product_variantId: value }));
    // setAvailableQuantity(selected?.quantity);
  }}
  options={variantOptions}
  disabled={!variantOptions?.length}
/>

            )}
          </Form.Item>

          <Form.Item label="Quantity" className="text-gray-800 font-bold">
            <Input
              type="number"
              placeholder="Enter quantity"
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (value > availableQuantity) {
                  value = availableQuantity;
                  message.warning(
                    `Max available quantity is ${availableQuantity}`
                  );
                }
                setFormData((prev) => ({ ...prev, quantity: value }));
              }}
              value={formData.quantity}
            />
            <span className="text-black-600">
              Available: {availableQuantity}
            </span>
          </Form.Item>

          {/* <Form.Item>
            <Checkbox
              checked={formData.express_del}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  express_del: e.target.checked,
                }))
              }
            >
              Express Delivery
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={formData.availability}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availability: e.target.checked,
                }))
              }
            >
              Available in Stock
            </Checkbox>
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              className="w-full bg-[#0034BE]"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
