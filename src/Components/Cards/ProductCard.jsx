import { Card, Carousel } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Meta } = Card;

export default function ProductCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  return (
    <div>
      <div className="flex justify-center">
        {product ? (
          <Card
            style={{
              width: "100%",
              background: "white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              padding: "20px",
            }}
            cover={
              <Carousel autoplay dotPosition="bottom" className="w-64 mx-auto">
                {product?.images?.map((image, index) => (
                  <div key={index} className="flex justify-center">
                    <img
                      alt={`${product.name} ${index + 1}`}
                      src={image}
                      className="!w-56 h-56 rounded-md object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            }
          >
            <Meta
              title={
                <h2 className="text-xl font-bold text-center">
                  {product.name}
                </h2>
              }
            />

            <div className="mt-4 space-y-2 text-gray-700">
              <p className="text-lg">
                <strong>🛒 Original Price:</strong>{" "}
                <span className="text-gray-700 font-semibold">
                  ₹{product.price}
                </span>
              </p>
              <p className="text-lg">
                <strong>📉 Discount Percentage:</strong>{" "}
                <span className="text-red-500 font-semibold">
                  {product.discount_percentage}%
                </span>
              </p>
              <p className="text-lg">
                <strong>💰 Discounted Price:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  ₹{product.discounted_price}
                </span>
              </p>
              <p className="text-lg">
                <strong>📦 Stock:</strong>{" "}
                <span className="font-bold">{product.quantity}</span>
              </p>
              <p className="text-lg">
                <strong>📜 Description:</strong> {product.description}
              </p>

              {/* Additional Fields */}
              <p className="text-lg">
                <strong>🍎 Nutrition Facts:</strong>{" "}
                {product.nutritional_facts || "N/A"}
              </p>
              <p className="text-lg">
                <strong>🌸 Seasonal:</strong> {product.seasonal ? "Yes" : "No"}
              </p>
              <p className="text-lg">
                <strong>🔥 Trending:</strong> {product.trending ? "Yes" : "No"}
              </p>
            </div>
          </Card>
        ) : (
          <p className="text-center text-red-500">No product selected.</p>
        )}
      </div>
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
}
