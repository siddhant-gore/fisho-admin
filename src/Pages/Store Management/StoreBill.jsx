import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Input, Button, Spin } from "antd";
import image from "../../assets/Images/marin-blue-salad-plate.png";
import image1 from "../../assets/Images/fisho1.jpeg";
import image2 from "../../assets/Images/fisho2.jpg";
import image3 from "../../assets/Images/fisho3.jpeg";
import {
  useGenerateBillMutation,
  useGetAllVariantsByProductMutation,
} from "../../redux/slices/apiSlice";
import { getError } from "../../utils/error";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "react-toastify";

const { Meta } = Card;
const { Search } = Input;

const productVariantData = [
  {
    id: 101,
    fishId: 1,
    name: "Salmon small",
    weight: "500g",
    price: "₹699",
    image: image,
  },
  {
    id: 102,
    fishId: 1,
    name: "Salmon",
    weight: "1kg",
    price: "₹1299",
    image: image1,
  },
  {
    id: 103,
    fishId: 2,
    name: "Tuna",
    weight: "500g",
    price: "₹799",
    image: image2,
  },
  {
    id: 104,
    fishId: 2,
    name: "Tuna",
    weight: "1kg",
    price: "₹1549",
    image: image3,
  },
];

export default function StoreBill() {
  const { id } = useParams();
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [weight, setWeight] = useState(null);
  const [price, setPrice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFish, setSelectedFish] = useState(null);
  const [productVariantData, setProductVariantData] = useState(null);
  const navigate = useNavigate();
 const [searchParams] = useSearchParams();
const storeParam = searchParams.get('store');
const store = storeParam && !isNaN(storeParam) ? Number(storeParam) : null;


  const [getAllVariants, { isLoading }] = useGetAllVariantsByProductMutation();
  const [generateBill, { isLoading: generateLoading }] =
    useGenerateBillMutation();

  const handleGetBill = async () => {
    try {
      const data = await generateBill({
        customerName,
        customerNumber: mobileNumber,
        weight,
        price,
        productVariantId: selectedFish?.id,
        storeId:store
      }).unwrap();

      toast.success("Bill generated");
      console.log(data?.data?.receiptUrl);
      const link = document.createElement("a");
      link.href = data?.data?.receiptUrl;
      link.download = "receipt.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      navigate(-1);
    } catch (error) {
      console.log(error);
      getError(error);
    }
  };
  const handleGetVariant = async () => {
    try {
      const data = await getAllVariants(id).unwrap();

      setProductVariantData(data?.data);
    } catch (error) {
      console.log(error);
      getError(error);
    }
  };

  useEffect(() => {
    if (id) {
      handleGetVariant();
    }
  }, [id]);

  const selectedVariants = productVariantData?.filter(
    (variant) =>
      variant.fishId === Number(id) &&
      variant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFish = (fish) => {
    setSelectedFish(fish);
    setPrice(fish?.price);
  };

  const isFormComplete = customerName && mobileNumber && selectedFish;

  return (
    <div>
      <div className="text-2xl mb-2">Billing</div>
      <button
        onClick={() => navigate(-1)}
        className="flex border border-gray-500 rounded-md px-2"
      >
        <FaArrowLeft className="my-auto me-1" /> Back
      </button>
      <div className="h-auto flex flex-col sm:flex-row gap-2">
        <div className="h-full w-full sm:w-[70%] rounded bg-white p-2 ">
          <div className="flex justify-between items-center bg-[#0034BE] p-2 rounded-t-lg mb-4">
            <span className="text-xl text-white">Select Fish Variant</span>
            {/* <Search
              placeholder="Search fish variant..."
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            /> */}
          </div>
              {isLoading ? <Spin className="mx-auto"/>
                    :
          
          <div className="flex h-[300px] flex-wrap gap-4 overflow-y-auto py-3 custom-scrollbar justify-center">
            {productVariantData?.length > 0 ? (
              productVariantData?.map((fish) => (
                <div className="relative">
                  {selectedFish?.id === fish?.id && (
                    <div className="bg-green-500 absolute z-50 text-sm font-semibold px-2 rounded -top-2 -left-2">
                      Selected
                    </div>
                  )}
                  <Card
                    key={fish?.id}
                    hoverable
                    // style={{ Width: '100px' }}
                    className="h-fit cursor-pointer"
                    onClick={() => handleSelectFish(fish)}
                    cover={
                      <img
                        className="h-40 w-full object-cover rounded-t-md"
                        alt={fish?.name}
                        src={fish?.image}
                      />
                    }
                  >
                    <Meta
                      title={
                        <span className="text-2xl font-bold">{fish?.name}</span>
                      }
                      description={
                        <div className="text-center">
                          {/* <p>Weight: {fish.weight}</p> */}
                          <p>Price: {fish?.price}</p>
                        </div>
                      }
                    />
                  </Card>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No variants available</p>
            )}
          </div>
              }
        </div>

        <div className="h-fit w-full sm:w-[30%] rounded bg-white p-4 ">
          <div className="w-full text-xl text-white bg-[#0034BE] p-2 rounded-t-lg mb-4">
            Bill
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
              pattern="[0-9]*"
            />
            <Input
              placeholder="Variant Name"
              className="font-semibold"
              style={{color:'green'}}
              value={selectedFish?.name || ""}
              disabled
            />
            <Input
              placeholder="Variant Weight"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              type="number"
              min={1}
              // disabled
            />
            <Input
              placeholder="Price"
              value={price}
              type="number"
              min={1}
              onChange={(e) => setPrice(e.target.value)}

              // disabled
            />
            <Button
              type="primary"
              className="w-full"
              disabled={!isFormComplete || generateLoading}
              loading={generateLoading}
              onClick={handleGetBill}
            >
              Generate Bill
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
