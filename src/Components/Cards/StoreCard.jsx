import { Card, Tabs, Table, Switch } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../../assets/Images/trout-underwater-260nw-130186676.webp";
import DirhamSymbol from "../DirhamSymbol";
import LocationPicker from "../LocationPicker";
import { useOutOfStockProductMutation } from "../../redux/slices/apiSlice";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import { useState } from "react";
const { Meta } = Card;

// Sample Store Products Data
const sampleStoreProducts = [
  {
    id: 1,
    productImage: image, // Replace with actual images
    productName: "Fresh Salmon",
    price: "200",
    stock: "50",
  },
  {
    id: 2,
    productImage: image,
    productName: "Tilapia",
    price: "150",
    stock: "30",
  },
  {
    id: 3,
    productImage: image,
    productName: "Catfish",
    price: "180",
    stock: "40",
  },
];

const StoreCard = ({data}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const store = data; 
  const [prod,setProd] = useState(null)

  const [updateOutOfStock,{isLoading}] = useOutOfStockProductMutation()

  const handleOutOfStock = async(id)=>{
    try {
      const data = await updateOutOfStock({id:id,data:{
        outOfStock:store?.id
      }}).unwrap();
    
      toast.success('Stock status updated');
      setProd(null);

    } catch (error) {
      console.log(error)
      getError(error)
    }
  }
  // Store Products Table Columns


  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Product Image",
      dataIndex: "images",
      key: "images",
      render: (data) => (
        <img src={data[0]} alt="Product" className="w-12 h-12 rounded" />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    //  render: (data) => `${data?.name}`,

    },
    {
      title: "In Stock",
      // dataIndex: "outOfStock",
      key: "name",
     render: (data) => 
      <Switch
      className="opacity-70"
  loading={isLoading && prod === data?.id}
  checked={!data?.outOfStock?.includes(store?.id)}
  onChange={() => {
    setProd(data?.id);
    handleOutOfStock(data?.id);
  }}
  style={{
    backgroundColor: !data?.outOfStock?.includes(store?.id) ? 'green' : 'red',
  }}
/>

      ,

    },

    // {
    //   title: "Price",
    //   dataIndex: "product_variant",
    //   key: "price",
    //   render: (data) => <><DirhamSymbol/> {data?.price}</>,
    // },
    // {
    //   title: "Stock",
    //   dataIndex: "quantity",
    //   key: "stock",
    // },
  ];

  return (
    <div>

      <Tabs defaultActiveKey="1" centered>
        <Tabs.TabPane tab="Store Details" key="1">
          <div className="flex w-full justify-center mt-6">
            {store ? (
              <Card
                hoverable
                style={{
                  width: "100%",
                }}
                title={"Store Details"}

                cover={
                 store?.image && <img
                    alt="Store"
                    src={store?.image}
                    className="!w-64 h-64 rounded-md mx-auto mt-4"
                  />
                }
              >
                <Meta
                  className="text-center"
                  title={store?.name}
                  description={'📍 ' +  store.address}
                />
                <p className="mt-2 text-center">Shop Phone Number: 📞 {store?.phone_number}</p>
                <h3 className="text-center font-bold mt-2">Store Manager:</h3>
                <Meta
                  className="text-center"
                  title={store?.user?.firstname + ' ' + store?.user?.lastname}
                  
                />
                <div className=" max-w-md mx-auto my-3 rounded-xl overflow-hidden">
                <LocationPicker viewOnly={true} initialLocation={{ lat:store?.latitude, lng:store?.longitude}} />

                </div>

              </Card>
            ) : (
              <p className="text-center text-red-500">No store selected.</p>
            )}
            
          </div>
          <div className="flex w-full justify-center mt-6">
            {store?.user ? (
              <Card
                hoverable
                style={{
                  width: "100%",
                }}
                title={"Subadmin Details"}
                cover={
                   store?.user?.profileImage &&     
                  <img
                    alt="Profile"
                    src={store?.user?.profileImage}
                    className="!w-40 h-40 rounded-full mx-auto mt-4"
                  />
                }
              >
                <Meta
                  className="text-center"
                  title={store?.user?.firstname + ' '+ store?.user?.lastname}
                  description={store?.user?.email}
                />
                <p className="mt-2 text-center">📞 {store?.user?.phone_no}</p>
                <p className="text-center">📅 Joined on {store?.user.createdAt}</p>
              </Card>
            ) : (
              <p className="text-center text-red-500">No user selected.</p>
            )}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Store Products" key="2">
          <div className="p-4">
            <Table
              columns={columns}
              dataSource={store?.store_products?.map((product) => ({
                ...product,
                key: product?.id,
              }))}
              pagination={false}
              // onRow={() => ({
              //   onClick: () => navigate("/store-variant"),
              // })}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>

      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
