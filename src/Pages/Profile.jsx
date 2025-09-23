
import { Card, Spin } from "antd";
import { useGetProfileQuery } from "../redux/slices/apiSlice";
import ProfileCard from "../Components/Cards/ProfileCard";
import Meta from "antd/es/card/Meta";

function Profile() {

  const { data, isLoading } = useGetProfileQuery();


  return (
    <div>
      <h2 className="font-bold mt-2">Profile</h2>

      {isLoading ?
      <div className="text-center mt-5">
        <Spin size="large" className="m-auto"/>
        </div>
      :
      <div className="flex w-full justify-center mt-6">
            {data?.data ? (
              <>
              <Card
                hoverable
                style={{
                  width: "100%",
                }}
                cover={
                   data?.data?.profileImage &&     
                  <img
                    alt="Profile"
                    src={data?.data?.profileImage}
                    className="!w-40 h-40 rounded-full mx-auto mt-4"
                  />
                }
              >
                <Meta
                  className="text-center"
                  title={data?.data?.firstname + ' '+ data?.data?.lastname}
                  description={data?.data?.email}
                />
                <p className="mt-2 text-center">📞 {data?.data?.phone_no}</p>

               
              </Card>    
               
                

              </>    
            ) : (
              <p className="text-center text-red-500">No Data.</p>
            )}
          </div>
}
    </div>
  );
}

export default Profile;
