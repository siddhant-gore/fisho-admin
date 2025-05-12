import { Card, Tabs, Table } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../../assets/Images/trout-underwater-260nw-130186676.webp";
const { Meta } = Card;

// Sample Orders Data
const sampleOrders = [
  {
    id: 1,
    productImage: image,
    productName: "Salmon",
    deliveryStatus: "Delivered",
    orderDate: "2024-02-10",
  },
  {
    id: 2,
    productImage: image,
    productName: "Tilapia",
    deliveryStatus: "Processing",
    orderDate: "2024-02-08",
  },
  {
    id: 3,
    productImage: image,
    productName: "Catfish",
    deliveryStatus: "Shipped",
    orderDate: "2024-02-07",
  },
];

const ProfileCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user; // Get user data from navigation state

  // Order Table Columns
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
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
  ];

  return (
    <div>
      {/* Tabs at the Top */}
      <Tabs defaultActiveKey="1" centered>
        {/* Personal Information Tab */}
        <Tabs.TabPane tab="Personal Information" key="1">
          <div className="flex w-full justify-center mt-6">
            {user ? (
              <Card
                hoverable
                style={{
                  width: "100%",
                }}
                cover={
                  <img
                    alt="Profile"
                    src={user.profileImage}
                    className="!w-40 h-40 rounded-full mx-auto mt-4"
                  />
                }
              >
                <Meta
                  className="text-center"
                  title={user.name}
                  description={user.email}
                />
                <p className="mt-2 text-center">📞 {user.phone}</p>
                <p className="text-center">📅 Joined on {user.createdAt}</p>
              </Card>
            ) : (
              <p className="text-center text-red-500">No user selected.</p>
            )}
          </div>
        </Tabs.TabPane>

        {/* Orders Tab */}
        <Tabs.TabPane tab="Orders" key="2">
          <div className="p-4">
            <Table
              columns={columns}
              dataSource={sampleOrders.map((order) => ({
                ...order,
                key: order.id,
              }))}
              pagination={false}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>

      {/* Go Back Button */}
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

export default ProfileCard;
