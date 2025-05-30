import { Card, Tabs, Table } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../../assets/Images/trout-underwater-260nw-130186676.webp";
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
      dataIndex: "productImage",
      key: "productImage",
      render: (image) => (
        <img src={image} alt="Product" className="w-12 h-12 rounded" />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => ` ${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
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
              dataSource={sampleStoreProducts.map((product) => ({
                ...product,
                key: product.id,
              }))}
              pagination={false}
              onRow={() => ({
                onClick: () => navigate("/store-variant"),
              })}
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
