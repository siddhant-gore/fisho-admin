import { useEffect, useState } from "react";
import { Input, Upload, Button, Form, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateStoreMutation, useGetStoreByIdQuery, useUpdateStoreByIdMutation, useUpdateSubadminByIdMutation } from "../../redux/slices/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import LocationPicker from "../../Components/LocationPicker";
import { FaUser } from "react-icons/fa6";
import { getError } from "../../utils/error";

export default function AddStore() {
  const [fileList, setFileList] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const {id} = useParams();

  console.log('first',id)
      const { data} = useGetStoreByIdQuery(id,{skip: !id});
  

  const [createStore, { isLoading: createLoading }] = useCreateStoreMutation();
    const [updateStoreById,{isLoading:updateLoading}] = useUpdateStoreByIdMutation()
    const [updateSubadminById,{isLoading:updateSubLoading}] = useUpdateSubadminByIdMutation()
  
  const navigate = useNavigate();
 const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    latitude: "",
    longitude: "",
    image: null,
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
    }
  });
  useEffect(()=>{
      if(id && data){

    setFormData((prev) => ({
  ...prev,
  storeName: data?.data?.name,
  storePhone: data?.data?.phone_number,
  storeAddress: data?.data?.address,
 latitude: data?.data?.latitude,
 longitude: data?.data?.longitude,
 user:{
  id: data?.data?.user?.id,
  email:data?.data?.user?.email,
  firstname:data?.data?.user?.firstname,
  lastname:data?.data?.user?.lastname,
  phone_no: data?.data?.user?.phone_no,
  addresses:{
    houseName: data?.data?.user?.addresses[0]?.address?.houseName,
    houseNumber: data?.data?.user?.addresses[0]?.address?.houseNumber,
    flatNumber: data?.data?.user?.addresses[0]?.address?.flatNumber,
    address: data?.data?.user?.addresses[0]?.address?.address,
  }
 }
}));
      
setLat(data?.data?.latitude);
setLng(data?.data?.longitude)
      
      }
  },[id,data])

 

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("user.addresses.")) {
      const field = name.split(".")[2];
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          addresses: {
            ...prev.user.addresses,
            [field]: value
          }
        }
      }));
    } else if (name.startsWith("user.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationSelect = (loc) => {
    if (lat !== loc?.lat || lng !== loc?.lng) {
      setLat(loc?.lat);
      setLng(loc?.lng);
      setFormData((prev) => ({
        ...prev,
        latitude: loc?.lat,
        longitude: loc?.lng,
        storeAddress: loc.address
      }));
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files (JPG, PNG, etc.)!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const handleImageUpload = ({ file, fileList }) => {
    setFileList(fileList.slice(-1));
    setFormData((prev) => ({
      ...prev,
      image: file.originFileObj
    }));
  };

  const handleRemoveImage = () => {
    setFileList([]);
    setFormData((prev) => ({
      ...prev,
      image: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: {
        email: formData.user.email,
        password: formData.user.password,
        firstname: formData.user.firstname,
        lastname: formData.user.lastname,
        phone_no: formData.user.phone_no,
        addresses: { ...formData.user.addresses },
        role: 'subadmin',
        otpVerified: true,
      },
      store: {
        name: formData.storeName,
        address: formData.storeAddress,
        phone_number: formData.storePhone,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        // image: formData.image // Include this if backend supports file uploads
      }
    };

    const updatePayload = {
       store: {
        name: formData.storeName,
        address: formData.storeAddress,
        phone_number: formData.storePhone,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      }
    }

    const updateUserload= {
        email: formData.user.email,
        // password: formData.user.password,
        firstname: formData.user.firstname,
        lastname: formData.user.lastname,
        phone_no: formData.user.phone_no,
        address: { ...formData.user.addresses },
     
    }

    try {
      
      id? await updateStoreById({id,data:updatePayload}) : await createStore(payload).unwrap();

     if(id){
     await updateSubadminById({id:formData?.user.id,data:updateUserload}).unwrap();
     }

      message.success(`Store and user ${id?'updated':'added'} successfully!`);
      navigate(-1);
    } catch (error) {
      getError(error)
    }
  };

  return (
    <div>
      {/* <div className="text-2xl text-black-400 mb-4">Add Store</div> */}
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <div className="w-full text-xl text-white bg-[#0034BE] p-2 rounded-t-lg">
         {id?'Edit':'Add'} Store
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <Form.Item label="Store Name">
            <Input name="storeName" value={formData?.storeName} onChange={handleChange} />
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

         

          <Form.Item label="Store Phone Number">
            <Input name="storePhone" type="number" value={formData?.storePhone} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Select location">
            <LocationPicker initialLocation={{ lat, lng}} onLocationSelect={handleLocationSelect} />
          </Form.Item>
 <Form.Item label="Store Address">
            <Input.TextArea name="storeAddress" value={formData?.storeAddress} onChange={handleChange} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
          <Form.Item label="Latitude">
            <Input
              type="number"
              step="any"
              value={lat}
              disabled
              onChange={(e) => {
                setLat(e.target.value);
                setFormData((prev) => ({ ...prev, latitude: e.target.value }));
              }}
            />
          </Form.Item>

          <Form.Item label="Longitude">
            <Input
              type="number"
              step="any"
              value={lng}
              disabled
              onChange={(e) => {
                setLng(e.target.value);
                setFormData((prev) => ({ ...prev, longitude: e.target.value }));
              }}
            />
          </Form.Item>
              </div>

<div className="shadow  p-2 rounded mb-2">
          <h3 className="font-bold flex gap-1 items-center"><FaUser className="text-blue-500"/> Subadmin User</h3>
          <p className="text-sm text-gray-500">Fill in details about the store manager.</p>
          <hr className="mb-3 " />

          <Form.Item label="User Email">
            <Input name="user.email" value={formData?.user?.email} onChange={handleChange} />
          </Form.Item>

{!id &&
          <Form.Item label="User Password">
            <Input.Password name="user.password" value={formData?.user?.password} onChange={handleChange} />
          </Form.Item>
}
          <Form.Item label="First Name">
            <Input name="user.firstname" value={formData?.user?.firstname} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Last Name">
            <Input name="user.lastname" value={formData?.user?.lastname} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="User Phone Number">
            <Input name="user.phone_no" type="number" value={formData?.user?.phone_no} onChange={handleChange} />
          </Form.Item>

          <hr/>
          <p className="text-md font-semibold my-2">User Address</p>
          <Form.Item label="House Name">
            <Input name="user.addresses.houseName" value={formData?.user?.addresses?.houseName} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="House Number">
            <Input name="user.addresses.houseNumber" value={formData?.user?.addresses?.houseNumber} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Flat Number">
            <Input name="user.addresses.flatNumber" value={formData?.user?.addresses?.flatNumber} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Full Address">
            <Input name="user.addresses.address" value={formData?.user?.addresses?.address} onChange={handleChange} />
          </Form.Item>
</div>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createLoading || updateLoading || updateSubLoading}>
              Submit
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
