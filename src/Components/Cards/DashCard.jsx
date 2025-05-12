import { Card, Flex } from "antd";

import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Skeleton from "react-loading-skeleton";

function DashCard({ type, icon, title, count }) {
  // const { loading } = useSelector((state) => state.dashboard);

  const actions = [
    <p className="text-end mr-3 text-xs hover:text-gray-500 hover:scale-[1.03]">
      More info →
    </p>,
    //  <Link to={'/users/1'}> <EyeOutlined   key="view"  className='mt-0'/></Link> ,
    //   <DeleteOutlined  key="delete" onClick={showModal}/>,
  ];

  return (
    <Flex gap="middle" align="start" vertical>
      {/* <Switch checked={!loading} onChange={(checked) => setLoading(!checked)} /> */}
      <Link
        to={`/${type}`}
        className="hover:scale-[1.01] hover:shadow-md transition-shadow"
      >
        <Card
          // loading={loading}
          actions={actions}
          style={{
            minWidth: 300,
          }}
        >
          <Card.Meta
            avatar={icon}
            title={<h1 className="text-black-500 text-xl ">{title}</h1>}
            description={
              <>
                {/* {loading && <Skeleton count={1} height={30} />} */}
                <h1 className="!text-black-600 text-3xl font-bold animate-shine">
                  {count}
                </h1>
              </>
            }
          />
        </Card>
      </Link>
    </Flex>
  );
}

export default DashCard;
