import { useState, useEffect } from "react";
import { Select, Input, Button, Form, message, Checkbox, Spin } from "antd";
import { useAxiosInstance } from "../../AxiosInstance"; // Custom Axios instance

export default function AddProductToStore() {
  const axiosInstance = useAxiosInstance(); // Use custom Axios instance

  const [storeOptions, setStoreOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const availableQuantity = 100;
  const [formData, setFormData] = useState({
    storeId: "",
    product_variantId: "",
    quantity: "",
    express_del: false,
    availability: false,
  });

  // Fetch stores from API
  useEffect(() => {
    axiosInstance
      .get("/stores/findall")
      .then((res) => {
        const stores = res.data.data.map((store) => ({
          label: store.name,
          value: store.id,
        }));
        setStoreOptions(stores);
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
      })
      .finally(() => setLoadingStores(false));
  }, [axiosInstance]);

  // Fetch products from API
  useEffect(() => {
    axiosInstance
      .get("/product/findall")
      .then((res) => {
        const products = res.data.data.map((product) => ({
          label: product.name,
          value: product.id,
        }));
        setProductOptions(products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => setLoadingProducts(false));
  }, [axiosInstance]);

  // Fetch product variants when a product is selected
  const handleProductChange = (productId) => {
    setFormData((prev) => ({ ...prev, product_variantId: "" })); // Reset variant
    setVariantOptions([]);
    setLoadingVariants(true);

    axiosInstance
      .get(`/product-variant/find-by-product/${productId}`)
      .then((res) => {
        const variants = res.data.data.map((variant) => ({
          label: variant.name,
          value: variant.id,
        }));
        setVariantOptions(variants);
      })
      .catch((error) => {
        console.error("Error fetching product variants:", error);
      })
      .finally(() => setLoadingVariants(false));
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
      await axiosInstance.post("/store-product/add", form);
      message.success("Product added to store successfully!");
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Failed to add product.");
      } else {
        message.error("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="text-2xl text-black-400 mb-4">Add Product to Store</div>
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <div className="w-full text-xl text-white bg-[#0034BE] p-2 rounded-t-lg">
          Add Product to Store
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <Form.Item label="Store Name" className="text-gray-800 font-bold">
            {loadingStores ? (
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
            {loadingProducts ? (
              <Spin />
            ) : (
              <Select
                placeholder="Select Product"
                className="w-full"
                onChange={handleProductChange}
                options={productOptions}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Product Variant"
            className="text-gray-800 font-bold"
          >
            {loadingVariants ? (
              <Spin />
            ) : (
              <Select
                placeholder="Select Variant"
                className="w-full"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, product_variantId: value }))
                }
                options={variantOptions}
                disabled={!variantOptions.length}
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

          <Form.Item>
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
          </Form.Item>

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
