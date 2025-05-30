import { useState } from "react";
import { Input, Upload, Button, Form, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useCreateStoreMutation } from "../../redux/slices/apiSlice";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../../Components/LocationPicker";

export default function AddStore() {
  const [fileList, setFileList] = useState([]);

  const [createStore,{isLoading:createLoading}] = useCreateStoreMutation();

  const navigate = useNavigate();

  const formik = useFormik({
  initialValues: {
    user: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phone_no: "",
      addresses: {
        houseName: "",
        houseNumber: "",
        flatNumber: "",
        address: ""
      }
    },
    store: {
      name: "",
      address: "",
      phone_number: "",
      latitude: "",
      longitude: "",
      // image: null
    }
  },
//   validate: (values) => {
//   const errors = {};
//   const { user, store } = values;

//   // Initialize nested objects
//   errors.user = {};
//   errors.store = {};
//   errors.user.addresses = {};

//   // ---- Store Validations ----
//   if (!store.name) errors.store.name = "Store name is required";
//   if (!store.address) errors.store.address = "Store address is required";
//   if (!store.phone_number || !/^\d{10}$/.test(store.phone_number)) {
//     errors.store.phone_number = "Valid phone number required";
//   }
//   if (!store.latitude || isNaN(Number(store.latitude))) {
//     errors.store.latitude = "Latitude must be a number";
//   }
//   if (!store.longitude || isNaN(Number(store.longitude))) {
//     errors.store.longitude = "Longitude must be a number";
//   }
//   if (!store.image) {
//     errors.store.image = "Store image is required";
//   }

//   // ---- User Validations ----
//   if (!user.email) errors.user.email = "Email is required";
//   if (!user.password) errors.user.password = "Password is required";
//   if (!user.firstname) errors.user.firstname = "First name is required";
//   if (!user.lastname) errors.user.lastname = "Last name is required";
//   if (!user.phone_no || !/^\d{10}$/.test(user.phone_no)) {
//     errors.user.phone_no = "Valid phone number required";
//   }

//   // ---- Address Validations ----
//   if (!user.addresses.houseName) errors.user.addresses.houseName = "House name required";
//   if (!user.addresses.houseNumber) errors.user.addresses.houseNumber = "House number required";
//   if (!user.addresses.flatNumber) errors.user.addresses.flatNumber = "Flat number required";
//   if (!user.addresses.address) errors.user.addresses.address = "Address is required";

//   return errors;
// },

 onSubmit: async (values) => {
  try {

    console.log('values',values)

    const payload = {
      user: {
        email: values.user.email,
        password: values.user.password,
        firstname: values.user.firstname,
        lastname: values.user.lastname,
        phone_no: values.user.phone_no,
        addresses: {
          houseName: values.user.addresses.houseName,
          houseNumber: values.user.addresses.houseNumber,
          flatNumber: values.user.addresses.flatNumber,
          address: values.user.addresses.address,
        }
      },
      store: {
        name: values.storeName,
        address: values.storeAddress,
        phone_number: values.storePhone,
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
        // image: values.store.image 
      }
    };

    // Send as raw JSON
    const response = await createStore(payload).unwrap();

    message.success("Store and user added successfully!");
    formik.resetForm();
    setFileList([]);
    navigate(-1)

  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "Error creating store");
  }
}

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
  formik.setFieldValue("store.image", file.originFileObj);
};

const handleRemoveImage = () => {
  setFileList([]);
  formik.setFieldValue("store.image", null);
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

          {/* <Form.Item label="Store Image">
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
          </Form.Item> */}

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

          <Form.Item label="Select location">
              <LocationPicker
                onLocationSelect={(loc) => {
                  console.log(loc);
                  formik.setFieldValue("latitude",loc?.lat)
                  formik.setFieldValue("longitude",loc?.lng)
                  // form.setFieldValue("address", loc.address);
                }}
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

          <h3 className="font-bold">Subadmin User</h3>
          <hr className="mb-3 "/>
          <Form.Item label="User Email">
  <Input
    name="user.email"
    onChange={formik.handleChange}
    value={formik.values.user.email}
  />
</Form.Item>

<Form.Item label="User Password">
  <Input.Password
    name="user.password"
    onChange={formik.handleChange}
    value={formik.values.user.password}
  />
</Form.Item>

<Form.Item label="First Name">
  <Input
    name="user.firstname"
    onChange={formik.handleChange}
    value={formik.values.user.firstname}
  />
</Form.Item>

<Form.Item label="Last Name">
  <Input
    name="user.lastname"
    onChange={formik.handleChange}
    value={formik.values.user.lastname}
  />
</Form.Item>

<Form.Item label="User Phone Number">
  <Input
    name="user.phone_no"
    onChange={formik.handleChange}
    value={formik.values.user.phone_no}
  />
</Form.Item>

<Form.Item label="House Name">
  <Input
    name="user.addresses.houseName"
    onChange={formik.handleChange}
    value={formik.values.user.addresses.houseName}
  />
</Form.Item>

<Form.Item label="House Number">
  <Input
    name="user.addresses.houseNumber"
    onChange={formik.handleChange}
    value={formik.values.user.addresses.houseNumber}
  />
</Form.Item>

<Form.Item label="Flat Number">
  <Input
    name="user.addresses.flatNumber"
    onChange={formik.handleChange}
    value={formik.values.user.addresses.flatNumber}
  />
</Form.Item>

<Form.Item label="Full Address">
  <Input
    name="user.addresses.address"
    onChange={formik.handleChange}
    value={formik.values.user.addresses.address}
  />
</Form.Item>


          <Form.Item>
            <Button type="primary" loading={createLoading} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
