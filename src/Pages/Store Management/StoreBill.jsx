import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card, Input, Button } from "antd";
import image from "../../assets/Images/marin-blue-salad-plate.png";
import image1 from "../../assets/Images/fisho1.jpeg";
import image2 from "../../assets/Images/fisho2.jpg";
import image3 from "../../assets/Images/fisho3.jpeg";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFish, setSelectedFish] = useState(null);

  const selectedVariants = productVariantData.filter(
    (variant) =>
      variant.fishId === Number(id) &&
      variant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFish = (fish) => {
    setSelectedFish(fish);
  };

  const isFormComplete = customerName && mobileNumber && selectedFish;

  return (
    <div>
      <div className="text-2xl mb-2">Billing</div>
      <div className="h-auto flex flex-col sm:flex-row gap-2">
        <div className="h-full w-full sm:w-[70%] rounded bg-white p-2 ">
          <div className="flex justify-between items-center bg-[#0034BE] p-2 rounded-t-lg mb-4">
            <span className="text-xl text-white">Select Fish Variant</span>
            <Search
              placeholder="Search fish variant..."
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <div className="flex h-[300px] flex-wrap gap-4 overflow-y-auto custom-scrollbar justify-center">
            {selectedVariants.length > 0 ? (
              selectedVariants.map((fish) => (
                <Card
                  key={fish.id}
                  hoverable
                  style={{ width: "auto", minWidth: 160 }}
                  className="h-fit cursor-pointer"
                  onClick={() => handleSelectFish(fish)}
                  cover={
                    <img
                      className="h-40 w-full object-cover rounded-t-md"
                      alt={fish.name}
                      src={fish.image}
                    />
                  }
                >
                  <Meta
                    title={
                      <span className="text-2xl font-bold">{fish.name}</span>
                    }
                    description={
                      <div className="text-center">
                        <p>Weight: {fish.weight}</p>
                        <p>Price: {fish.price}</p>
                      </div>
                    }
                  />
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No variants available</p>
            )}
          </div>
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
              placeholder="Fish Name"
              value={selectedFish?.name || ""}
              disabled
            />
            <Input
              placeholder="Fish Weight"
              value={selectedFish?.weight || ""}
              disabled
            />
            <Input
              placeholder="Price"
              value={selectedFish?.price || ""}
              disabled
            />
            <Button
              type="primary"
              className="w-full"
              disabled={!isFormComplete}
            >
              Generate Bill
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
