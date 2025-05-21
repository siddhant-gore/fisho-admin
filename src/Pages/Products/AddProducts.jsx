import { useState, useEffect } from "react";
import { Input, Upload, Button, Checkbox, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { useCreateProductMutation, useGetAllCategoriesQuery } from "../../redux/slices/apiSlice";
import { useNavigate } from "react-router-dom";

export default function AddProducts() {
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    categoryId: "",
    price: "",
    discount_percentage: "",
    quantity: "",
    seasonal: false,
    trending: false,
    description: "",
    nutritional_facts: "",
  });

  const navigate  = useNavigate();

  const {data:categoryData} = useGetAllCategoriesQuery();
  const [createProduct] = useCreateProductMutation();

  

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
      if (key === "seasonal" || key === "trending") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, value);
      }
    });

    // Add discounted price to FormData
    formData.append("discounted_price", discountedPrice);

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
          seasonal: false,
          trending: false,
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
              {categories.map((cat) => (
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
              value={formValues.quantity}
              onChange={handleInputChange}
              placeholder="Enter total quantity"
            />
          </div>

          <div>
            <Checkbox
              name="seasonal"
              checked={formValues.seasonal}
              onChange={handleInputChange}
            >
              Seasonal
            </Checkbox>
          </div>

          <div>
            <Checkbox
              name="trending"
              checked={formValues.trending}
              onChange={handleInputChange}
            >
              Trending
            </Checkbox>
          </div>

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
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
