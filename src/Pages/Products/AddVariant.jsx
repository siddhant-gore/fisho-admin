import { useState, useEffect } from "react";
import { Input, Select, Upload, Button, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAxiosInstance } from "../../AxiosInstance";

export default function AddVariant() {
  const [products, setProducts] = useState([]);
  const [formValues, setFormValues] = useState({
    productId: "",
    name: "",
    price: "",
    weight: "",
    discount_percentage: "",
    discounted_price: "",
    quantity: "",
    image: "",
    imagePreview: "",
  });

  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/product/findall");
        if (response.data.success && Array.isArray(response.data.data)) {
          setProducts(
            response.data.data.map((product) => ({
              label: product.name,
              value: product.id,
            }))
          );
        } else {
          message.error("Invalid response format");
        }
      } catch (error) {
        message.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => {
      const newValues = { ...prev, [name]: value };

      if (name === "price" || name === "discount_percentage") {
        newValues.discounted_price = calculateDiscountedPrice(
          newValues.price,
          newValues.discount_percentage
        );
      }

      return newValues;
    });
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!price || isNaN(price)) return "";
    if (!discount || isNaN(discount) || discount === "") return price;
    return (price - (price * discount) / 100).toFixed(2);
  };

  const handleImageUpload = ({ file }) => {
    const imagePreview = URL.createObjectURL(file);
    setFormValues((prev) => ({ ...prev, image: file, imagePreview }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formValues.productId ||
      !formValues.name ||
      !formValues.price ||
      !formValues.quantity ||
      !formValues.image ||
      !formValues.weight
    ) {
      message.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", Number(formValues.productId));
    formData.append("name", formValues.name);
    formData.append("price", formValues.price);
    formData.append("weight", formValues.weight);
    formData.append("discount_percentage", formValues.discount_percentage);
    formData.append("discounted_price", formValues.discounted_price);
    formData.append("quantity", formValues.quantity);
    formData.append("image", formValues.image);

    try {
      console.log("FormData Contents:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      await axiosInstance.post("/product-variant/add", formData);
      message.success("Variant added successfully!");
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Failed to add variant.");
      } else {
        message.error("Failed to add variant. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="text-2xl text-black-400 mb-4">Add Product Variant</div>
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <div className="w-full text-xl text-white bg-[#0034BE] p-2 rounded-t-lg">
          Add Product Variant
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <Form.Item label="Product Name" className="text-gray-800 font-bold">
            <Select
              placeholder="Select Product"
              className="w-full"
              value={formValues.productId}
              onChange={(value) =>
                setFormValues((prev) => ({ ...prev, productId: value }))
              }
              options={products}
            />
          </Form.Item>

          <Form.Item
            label="Product Variant Name"
            className="text-gray-800 font-bold"
          >
            <Input
              name="name"
              placeholder="Enter product variant name"
              onChange={handleChange}
              value={formValues.name}
            />
          </Form.Item>

          <Form.Item label="Variant Image" className="text-gray-800 font-bold">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageUpload}
            >
              {formValues.imagePreview ? (
                <img
                  src={formValues.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Weight" className="text-gray-800 font-bold">
            <Input
              name="weight"
              type="number"
              placeholder="Enter weight"
              onChange={handleChange}
              value={formValues.weight}
            />
          </Form.Item>

          <Form.Item label="Price" className="text-gray-800 font-bold">
            <Input
              type="number"
              name="price"
              placeholder="Enter price"
              onChange={handleChange}
              value={formValues.price}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Discount Percentage"
              className="text-gray-800 font-bold"
            >
              <Input
                type="number"
                name="discount_percentage"
                placeholder="Enter discount"
                suffix="%"
                onChange={handleChange}
                value={formValues.discount_percentage}
              />
            </Form.Item>
            <Form.Item
              label="Discounted Price"
              className="text-gray-800 font-bold"
            >
              <Input
                type="number"
                value={formValues.discounted_price}
                readOnly
                className="bg-gray-200 cursor-not-allowed"
              />
            </Form.Item>
          </div>

          <Form.Item label="Total Quantity" className="text-gray-800 font-bold">
            <Input
              name="quantity"
              type="number"
              placeholder="Enter total quantity"
              onChange={handleChange}
              value={formValues.quantity}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="w-full bg-[#0034BE] hover:bg-[#002A9E]"
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
