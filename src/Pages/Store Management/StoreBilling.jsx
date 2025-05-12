import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, Input } from "antd";
import image from "../../assets/Images/marin-blue-salad-plate.png";
import image1 from "../../assets/Images/fisho1.jpeg";
import image2 from "../../assets/Images/fisho2.jpg";
import image3 from "../../assets/Images/fisho3.jpeg";

const { Meta } = Card;
const { Search } = Input;

const fishData = [
  { id: 1, name: "Salmon", price: "₹1299", image: image },
  { id: 2, name: "Tuna", price: "₹1549", image: image1 },
  { id: 3, name: "Cod", price: "₹1099", image: image2 },
  { id: 4, name: "Trout", price: "₹1325", image: image3 },
  { id: 5, name: "Mackerel", price: "₹9.5", image: image },
  { id: 6, name: "Snapper", price: "₹1450", image: image1 },
  { id: 7, name: "Haddock", price: "₹1199", image: image2 },
  { id: 8, name: "Sardine", price: "₹8.9", image: image3 },
  { id: 9, name: "Grouper", price: "₹1625", image: image },
  { id: 10, name: "Catfish", price: "₹1050", image: image1 },
];

export default function StoreBilling() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCardClick = (id) => {
    navigate(`/billing-page/${id}`);
  };

  const filteredFish = fishData.filter((fish) =>
    fish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="text-2xl mb-2">Billing</div>
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

          <div className="flex h-[100%] flex-wrap gap-4 overflow-y-auto custom-scrollbar justify-center">
            {filteredFish.map((fish) => (
              <Card
                key={fish.id}
                hoverable
                className="h-fit"
                style={{ width: "auto", minWidth: 160 }}
                cover={
                  <img
                    className="h-40 w-auto"
                    alt={fish.name}
                    src={fish.image}
                  />
                }
                onClick={() => handleCardClick(fish.id)}
              >
                <Meta
                  className="text-center"
                  title={
                    <span className="text-2xl text-center">{fish.name}</span>
                  }
                  description={
                    <div>
                      <p>Price: {fish.price}</p>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
