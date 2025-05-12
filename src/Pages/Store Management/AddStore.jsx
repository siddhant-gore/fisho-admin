import { useState } from "react";
import { Input, Upload, Button, Form, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useAxiosInstance } from "../../AxiosInstance";

export default function AddStore() {
  const [fileList, setFileList] = useState([]);
  const axiosInstance = useAxiosInstance();

  const formik = useFormik({
    initialValues: {
      storeName: "",
      storeAddress: "",
      storePhone: "",
      latitude: "",
      longitude: "",
      storeImage: null,
    },
    validate: (values) => {
      let errors = {};

      if (!values.storeName) errors.storeName = "Store name is required";
      if (!values.storeAddress)
        errors.storeAddress = "Store address is required";

      if (!values.storePhone) {
        errors.storePhone = "Phone number is required";
      } else if (!/^\d{10}$/.test(values.storePhone)) {
        errors.storePhone = "Enter a valid 10-digit phone number";
      }

      if (!values.latitude) {
        errors.latitude = "Latitude is required";
      } else if (!/^-?\d+(\.\d+)?$/.test(values.latitude)) {
        errors.latitude = "Enter a valid numeric latitude";
      }

      if (!values.longitude) {
        errors.longitude = "Longitude is required";
      } else if (!/^-?\d+(\.\d+)?$/.test(values.longitude)) {
        errors.longitude = "Enter a valid numeric longitude";
      }

      if (!values.storeImage) errors.storeImage = "Image is required";

      return errors;
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.storeName);
      formData.append("address", values.storeAddress);
      formData.append("phone_number", values.storePhone);
      formData.append("latitude", values.latitude);
      formData.append("longitude", values.longitude);
      if (values.storeImage) {
        formData.append("image", values.storeImage);
      }

      console.log("Submitting form data:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      try {
        const response = await axiosInstance.post("/stores/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          message.success("Store added successfully!");
          formik.resetForm();
          setFileList([]);
        } else {
          message.error(response.data.message || "Failed to add store.");
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Error adding store.");
      }
    },
  });

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files (JPG, PNG, etc.)!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const handleImageUpload = ({ file, fileList }) => {
    setFileList(fileList.slice(-1));
    formik.setFieldValue("storeImage", file.originFileObj);
  };

  const handleRemoveImage = () => {
    setFileList([]);
    formik.setFieldValue("storeImage", null);
  };

  return (
    <div>
      <div className="text-2xl text-black-400 mb-4">Add Store</div>
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <div className="w-full text-xl text-white bg-[#0034BE] p-2 rounded-t-lg">
          Add Store
        </div>
        <form onSubmit={formik.handleSubmit} className="p-4">
          <Form.Item label="Store Name">
            <Input
              name="storeName"
              onChange={formik.handleChange}
              value={formik.values.storeName}
            />
          </Form.Item>

          <Form.Item label="Store Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageUpload}
              onRemove={handleRemoveImage}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {fileList.length < 1 && <UploadOutlined />}
            </Upload>
          </Form.Item>

          <Form.Item label="Store Address">
            <Input.TextArea
              name="storeAddress"
              onChange={formik.handleChange}
              value={formik.values.storeAddress}
            />
          </Form.Item>

          <Form.Item label="Store Phone Number">
            <Input
              name="storePhone"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.storePhone}
            />
          </Form.Item>

          <Form.Item label="Latitude">
            <Input
              name="latitude"
              type="number"
              step="any"
              onChange={formik.handleChange}
              value={formik.values.latitude}
            />
          </Form.Item>

          <Form.Item label="Longitude">
            <Input
              name="longitude"
              type="number"
              step="any"
              onChange={formik.handleChange}
              value={formik.values.longitude}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
