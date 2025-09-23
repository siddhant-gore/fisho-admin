import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Form, Input, Select, Spin } from "antd";
import { useGetAllFilteredProductsQuery, useGetAllStoresQuery } from "../../redux/slices/apiSlice";

const { Meta } = Card;
const { Search } = Input;


export default function StoreBilling() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [store, setStore] = useState(null);
  const [storeOptions, setStoreOptions] = useState([]);

  const {data,isLoading} = useGetAllFilteredProductsQuery(store,{skip:!store});

   const {data:storesData,isLoading:storeLoading} = useGetAllStoresQuery();  
  
    
    useEffect(()=>{
        if(storesData){
          const stores = storesData?.data?.map((store) => ({
            label: store?.name,
            value: store?.id,
          }));
          setStoreOptions(stores);
        }
    },[storesData])

  const handleCardClick = (id) => {
    navigate(`/billing-page/${id}?store=${store}`);
  };


  const filteredFish = data?.data?.products?.filter((fish) =>
    fish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="text-2xl mb-2">Billing</div>
      <Link to={'/store-billing/history'} className="underline mb-2">Billing History</Link>
      <div className="h-auto flex flex-row gap-2">
        <div className="h-full rounded bg-white p-2 w-full">
          <div className="flex justify-between items-center bg-[#0034BE] p-2 rounded-t-lg mb-4 mt-4">
            <span className="text-xl text-white">Select a product</span>
            <Search
              placeholder="Search fish..."
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>

 <Form.Item label="Select Store" className="text-gray-800 font-bold">
            {storeLoading ? (
              <Spin />
            ) : (
              <Select
                placeholder="Select Store"
                className="w-full"
                onChange={(value) =>
                  setStore(value)
                }
                options={storeOptions}
              />
            )}
          </Form.Item>

          {isLoading ? <Spin className="mx-auto"/>
        :  
        
          
            <div className="flex h-[100%] flex-wrap gap-4 overflow-y-auto custom-scrollbar justify-center">
            {filteredFish?.map((fish) => (
              <Card
                key={fish?.id}
                hoverable
                className="h-fit"
                style={{ width: "auto", minWidth: 160 }}
                cover={
                  fish?.images?.length > 0 && 
                  <img
                    className="h-40 w-auto"
                    alt={fish?.name}
                    src={fish?.images[0]}
                  />
                }
                onClick={() => handleCardClick(fish.id)}
              >
                <Meta
                  className="text-center"
                  title={
                    <span className="text-2xl text-center">{fish?.name}</span>
                  }
                  description={
                    fish?.price &&
                    <div>
                      <p>Price: {fish?.price}</p>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
}
        </div>
      </div>
    </div>
  );
}
