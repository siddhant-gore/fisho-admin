import { useState, useEffect } from "react";
import { Input, Upload, Button, Checkbox, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { useCreateProductMutation, useGetAllCategoriesQuery, useGetProductByIdQuery } from "../../redux/slices/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Radio from "antd/es/radio/radio";

export default function AddProducts() {
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    categoryId: "",
    // price: "",
    discount_percentage: "",
    quantity: "",
    featured: false,
    trending: false,
    delivery_type:"Next-Day Delivery",

    description: "",
    nutritional_facts: "",
  });

  const navigate  = useNavigate();
  const {id} = useParams();
  const {data:categoryData} = useGetAllCategoriesQuery();
  const [createProduct,{isLoading:createLoading}] = useCreateProductMutation();
  const {data,isLoading:getLoading} = useGetProductByIdQuery(id,{skip:!id});

 useEffect(() => {
  if (data) {
    setFormValues((prev) => ({
      ...data.data,
      categoryId: data.data?.category?.id,
    }));

    setFileList(data?.data?.images)
  }
}, [data]);


  useEffect(()=>{
    console.log(formValues)
  },[formValues])

  useEffect(()=>{
   if(categoryData?.data){
              setCategories(categoryData?.data);

   }
  },[categoryData])

  const calculateDiscountedPrice = (price, discount) => {
    if (!price || isNaN(price) || !discount || isNaN(discount)) return "";
    return (price - (price * discount) / 100).toFixed(2);
  };

  const validateForm = async () => {
    const schema = Yup.object({
      name: Yup.string().required("Product name is required"),
      categoryId: Yup.string().required("Category is required"),
      // price: Yup.number()
      //   .required("Price is required")
      //   .positive("Price must be positive"),
      // discount_percentage: Yup.number()
      //   .min(0)
      //   .max(100, "Discount cannot exceed 100%"),
      quantity: Yup.number()
        .required("Quantity is required")
        .positive("Must be a positive number"),
      description: Yup.string().required("Description is required"),
    });

    try {
      await schema.validate(formValues, { abortEarly: false });
      return true;
    } catch (error) {
      error.inner.forEach((err) => message.error(err.message));
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await validateForm())) return;

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === "featured" || key === "trending") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, value);
      }
    });

    // Add discounted price to FormData
    // formData.append("discounted_price", discountedPrice);

    if(fileList?.length === 0){
      return message.error("Please add an image")
    }

    fileList.forEach((file) => {
      formData.append("images", file);
    });

    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {

      const data = await createProduct(formData).unwrap();
     

        message.success("Product added successfully.");
        setFormValues({
          name: "",
          categoryId: "",
          price: "",
          discount_percentage: "",
          quantity: "",
          featured: false,
          bestSellers: false,
          description: "",
          nutritional_facts: "",
        });
        setFileList([]);
        setDiscountedPrice("");
        navigate(-1);
        
    } catch (error) {
      message.error(error.response?.data?.message || "Error adding product.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "price" || name === "discount_percentage") {
      setDiscountedPrice(
        calculateDiscountedPrice(
          name === "price" ? parseFloat(value) : formValues.price,
          name === "discount_percentage"
            ? parseFloat(value)
            : formValues.discount_percentage
        )
      );
    }
  };

  return (
    <div>
      <div className="text-2xl text-black-400 mb-4">Add Products</div>
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <div className="w-full text-xl text-white bg-[#0034BE] p-2 rounded-t-lg">
          Add Product Details
        </div>
        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 gap-4">
          <div>
            <label className="font-bold">Category</label>
            <Select
              name="categoryId"
              value={formValues.categoryId}
              onChange={(value) =>
                setFormValues({ ...formValues, categoryId: value })
              }
              className="w-full"
            >
              <Select.Option value="">Select Category</Select.Option>
              {categories?.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="font-bold">Product Name</label>
            <Input
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="font-bold">Product Image</label>
            <Upload
              listType="picture"
              fileList={fileList.map((file) => ({
                uid: file.uid,
                name: file.name,
                originFileObj: file,
              }))}
              beforeUpload={(file) => {
                setFileList((prev) => [...prev, file]);
                return false;
              }}
              onRemove={(file) => {
                setFileList(fileList.filter((item) => item.uid !== file.uid));
              }}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </div>

          <div>
            <label className="font-bold">Description</label>
            <Input.TextArea
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter product description"
            />
          </div>

          {/* <div>
            <label className="font-bold">Price</label>
            <Input
              name="price"
              type="number"
              value={formValues.price}
              onChange={handleInputChange}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="font-bold">Discount Percentage</label>
            <Input
              name="discount_percentage"
              type="number"
              value={formValues.discount_percentage}
              onChange={handleInputChange}
              placeholder="Enter discount percentage"
            />
          </div> */}

          {/* <div>
            <label className="font-bold">Discounted Price</label>
            <Input value={discountedPrice} readOnly className="bg-gray-200" />
          </div> */}

          <div>
            <label className="font-bold">Total Quantity</label>
            <Input
              name="quantity"
              type="number"
              min={0}
              value={formValues.quantity}
              onChange={handleInputChange}
              placeholder="Enter total quantity"
            />
          </div>

          <div>
            <Checkbox
              name="featured"
              checked={formValues.featured}
              onChange={handleInputChange}
            >
              Featured
            </Checkbox>
          </div>

          <div>
            <Checkbox
              name="bestSellers"
              checked={formValues.bestSellers}
              onChange={handleInputChange}
            >
              Best Sellers
            </Checkbox>
          </div>

      
        <p>Delivery Type</p>
          <Radio name='delivery_type' checked={formValues?.delivery_type === "Express Delivery"} value="Express Delivery" onChange={handleInputChange}>Express Delivery</Radio>
          <Radio name='delivery_type' checked={formValues?.delivery_type === "Next-Day Delivery"} value="Next-Day Delivery" onChange={handleInputChange}>Next-Day Delivery</Radio>

          <div>
            <label className="font-bold">Nutritional Facts</label>
            <Input.TextArea
              name="nutritional_facts"
              value={formValues.nutritional_facts}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter nutritional facts"
            />
          </div>

          <div className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#0034BE]"
              loading={createLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
