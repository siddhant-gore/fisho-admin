import { Button, Modal, Table, Upload } from "antd";

import {  useRef, useState } from "react";
import {
  useCreateBannerMutation,
  useDeleteBannerByIdMutation,
  useGetAllBannersQuery,
  useUpdateBannerByIdMutation,
} from "../../redux/slices/apiSlice";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getError } from "../../utils/error";
import { FaPlus } from "react-icons/fa6";

function Banner() {
  const fileInputRef = useRef(null);
  // const [previewUrls, setPreviewUrls] = useState([]);
  const imgAddr = "https://creative-story.s3.amazonaws.com";

  const [images, setImages] = useState([]);
  const [editBanner, setEditBanner] = useState(null);
  const [addBanner, setAddBanner] = useState(null);

  const [preImages, setPreImages] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (item) => {
    setEditBanner(item);
    setIsEditModalOpen(true);
  };

  const { data, isLoading } = useGetAllBannersQuery();
  const [deleteBanner, { isLoading: deleteLoading }] =
    useDeleteBannerByIdMutation();
  const [createBanner, { isLoading: createLoading }] =
    useCreateBannerMutation();
  const [updateBanner, { isLoading: updateLoading }] =
    useUpdateBannerByIdMutation();

  const handleSave = async () => {
    try {

      console.log('add banner ',addBanner)

      const formData = new FormData();
      formData.append("image", addBanner?.image);
      
      console.log('first',addBanner?.image)

     editBanner ? 
    await updateBanner({
  id: editBanner?.id,
  data: formData
}).unwrap()

      :
       await createBanner(formData).unwrap()
        ;

      toast.success("Uploaded successfully");
      setIsEditModalOpen(false);
      //     status: newStatus,
      //   });
      setAddBanner(null);
      setEditBanner(null);
    } catch (error) {
      getError(error);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {

      const data = await deleteBanner(id);

      toast.success("Banner deleted");
      //     status: newStatus,
      //   });
    } catch (error) {
      getError(error);
    }
  };

  const handleImageChange = (info) => {
    const latestFile = info.fileList?.[info.fileList.length - 1];
    const fileObj = latestFile?.originFileObj;
   console.log('fileObj',fileObj)
    if (fileObj instanceof File) {
      const blobUrl = URL.createObjectURL(fileObj);
      setAddBanner({image:fileObj, preview: blobUrl});
    } else {
      console.warn("Invalid file object:", fileObj);
    }
  };
  


  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Banner?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await handleDeleteBanner(id);
      },
    });
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image && (
          <img src={image} alt="Profile" className="w-28 h-20 rounded" />
        ),
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt ? new Date(createdAt).toLocaleString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <FiEdit
            className="cursor-pointer text-blue-500"
            size={18}
            onClick={() => handleEdit(record)}
          />
          <FiTrash
            className="cursor-pointer text-red-500"
            size={18}
            onClick={() => handleDelete(record?.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl">Banner</h1>
      <p>
        These banner images will be reflected in home page of mobile app and web
        app.
      </p>

      <div className="my-3">
        <div style={{ height: "100%" }}>

          <Button
            className="blue-btn m-1"
            style={{ fontSize: "0.65rem" }}
            onClick={() => {
              setEditBanner(null);
              setAddBanner(null);
              setIsEditModalOpen(true);
            }}
          >
          <FaPlus/>  Add New Banner Image
            {/* <BsUpload /> */}
          </Button>

          <Table
            columns={columns}
            dataSource={data?.map((item) => ({ ...item, key: item?.id }))}
            loading={isLoading}
          />
         
        </div>
      </div>

      <Modal
        title={`${editBanner ? "Edit" : "Add"} Banner`}
        open={isEditModalOpen}
        onOk={handleSave}
         confirmLoading={createLoading || updateLoading}     
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditBanner(null);
          setAddBanner(null);
        }}
      >
        <div className="flex flex-col gap-4">
          <label>Image:</label>
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <Button disabled={createLoading || updateLoading} loading={createLoading || updateLoading} icon={<UploadOutlined  />}>Upload New Image</Button>
          </Upload>

          {(addBanner || editBanner) &&
          <img
            src={addBanner?.preview || editBanner?.image}
            alt="Profile"
            className="w-full  rounded"
          />
          }
        </div>
      </Modal>
    </div>
  );
}

export default Banner;
