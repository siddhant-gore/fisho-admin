import React, { useEffect, useState } from "react";
import { useGenerateBillMutation, useGetAllFilteredProductsQuery, useGetAllStoresQuery, useGetAllVariantsByProductMutation } from "../../redux/slices/apiSlice";
import { Button, Card, Form, Select, Spin } from "antd";
import { getError } from "../../utils/error";
import DirhamSymbol from "../../Components/DirhamSymbol";
import { FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const BillingPage = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ customerName:"",customerMobile: "", discount: 0 });

    const [searchTerm, setSearchTerm] = useState("");
    const [store, setStore] = useState(null);
    const [storeOptions, setStoreOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const {data,isLoading} = useGetAllFilteredProductsQuery(store,{skip:!store});
   const [generateBill, { isLoading: generateLoading }] =
      useGenerateBillMutation();

      const isCartValid = cart?.every(
  (item) =>
    typeof item.quantityGrams === "number" &&
    !isNaN(item.quantityGrams) &&
    item.quantityGrams > 0
);
  
     const {data:storesData,isLoading:storeLoading} = useGetAllStoresQuery();  
    
       const [productVariantData, setProductVariantData] = useState(null);
   
     
       const [getAllVariants, { isLoading:variantLoading }] = useGetAllVariantsByProductMutation();
     
      const handleGetVariant = async () => {
          try {
            const data = await getAllVariants(selectedProduct?.id).unwrap();
      
            setProductVariantData(data?.data);
          } catch (error) {
            console.log(error);
            getError(error);
          }
        };
      
        useEffect(() => {
          if (selectedProduct) {
            handleGetVariant();
          }
        }, [selectedProduct]);

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
  

 

 const addToCart = (variant) => {
  const exists = cart.find((item) => item.variantId === variant.id);
  const defaultGrams = 250;
  const computedTotal = (defaultGrams / 1000) * variant.price;

  if (exists) {
    setCart(
      cart.map((item) =>
        item.variantId === variant.id
          ? {
              ...item,
              quantityGrams: item.quantityGrams + defaultGrams,
              totalPrice:
                ((item.quantityGrams + defaultGrams) / 1000) *
                item.pricePerKg,
            }
          : item
      )
    );
  } else {
    setCart([
      ...cart,
      {
        variantId: variant.id,
        name: variant.name,
        pricePerKg: variant.price,
        quantityGrams: defaultGrams,
        totalPrice: computedTotal,
      },
    ]);
  }
};

const updateQuantity = (id, grams) => {
  setCart(
    cart.map((item) =>
      item.variantId === id
        ? {
            ...item,
            quantityGrams: grams,
            totalPrice: (grams / 1000) * item.pricePerKg,
          }
        : item
    )
  );
};


  const removeItem = (id) => {
    setCart(cart.filter((item) => item.variantId !== id));
  };

 const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
 

const discountedTotal = total - (total * customer.discount) / 100;

  const reset = () => {
    setCart([]);
    setCustomer({ mobile: "", discount: 0 });
  };

   const handleGetBill = async () => {
      try {

       

        const data = await generateBill({
          selectedProducts: cart,
          customerName: customer?.customerName,
          customerNumber: customer?.customerMobile,
          discount:customer?.discount,
          subTotal:total.toFixed(2),
          totalPayable:discountedTotal.toFixed(2),
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
        reset();
  
      } catch (error) {
        console.log(error);
        getError(error);
      }
    };


  return (
    <div className="p-4  space-y-6">
      {/* Product/Variant Selector */}
      <h1 className="text-2xl font-semibold">Store Billing</h1>
   <Link to={'/store-billing/history'} className="underline mb-2">Billing History</Link>
      
      <section className="space-y-2 shadow-md border border-gray-300 p-2 rounded">

        <h2 className="text-xl font-bold">Select Store</h2>
        <Form.Item label="" className="text-gray-800 font-bold">
                    {storeLoading ? (
                      <Spin />
                    ) : (
                      <Select
                        placeholder="Select Store"
                        className="w-full"
                        onChange={(value) =>
                        {
                          setCart([])
                          setStore(value)
                        }
                        }
                        options={storeOptions}
                      />
                    )}
         </Form.Item>

      </section>
       <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Product Selection */}
            <div className="lg:col-span-2 space-y-6">
      {store &&
      <section className="shadow-md border border-gray-300 p-2 rounded">
        <h2 className="text-xl font-bold">Select Product</h2>
         <div className="flex flex-wrap gap-2">
          {filteredFish?.map((product) => (
            <Card
              key={product?.id}
                hoverable
                className={`h-fit overflow-hidden border ${selectedProduct?.id === product.id ? "bg-sky-200 border-sky-500" : ""}`}
                style={{ width: "auto" }}
                cover={
                  product?.images?.length > 0 && 
                  <img
                    className="h-20 w-auto"
                    alt={product?.name}
                    src={product?.images[0]}
                  />
                }
              onClick={() => setSelectedProduct(product)}
              >
                              {product?.name}

                </Card>
          
          ))}
        </div>

      </section>
      }
       {/* Show Variants */}
      {selectedProduct && (
        <section className="shadow-md p-2 border border-gray-300 rounded ">
          <h3 className="text-lg font-semibold">
            Select Variant for {selectedProduct?.name}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {productVariantData?.map((v) => {
  const isInCart = cart?.some((item) => item?.variantId === v.id);

return(
               <div
  key={v?.id}
  className={`border ${isInCart ? "bg-green-200 border-green-500" : ""} shadow pe-2 flex items-center rounded p-0 cursor-pointer`}
  onClick={() => addToCart(v)}
>
  <img
    className="h-16 w-16 object-cover rounded mr-4"
    alt={v?.name}
    src={v?.image}
  />

  <div className="flex-1">
    <div className="font-semibold">{v?.name}</div>
    <div className="text-sm text-gray-600"><DirhamSymbol/> {v?.price}/Kg</div>
  </div>
</div>
             
           )})}
          </div>
        </section>
      )}
   </div>
    <div>
      {/* Cart */}
      <section className="shadow-md p-2 border border-gray-300 rounded ">
        <h2 className="text-xl font-bold">Cart</h2>
        {cart.length === 0 ? (
          <p>No items added.</p>
        ) : (
          <div>
            {cart.map((item) => {
      const totalForItem = (item.quantityGrams / 1000) * item.pricePerKg;
      return (
        <div key={item.variantId} className="border border-gray-300 rounded p-2">
          <div className="flex justify-between">

          <h6 className="font-semibold">{item.name}</h6>
            <button
              onClick={() => removeItem(item.variantId)}
              className="text-red-500"
            >
              <FaTrash/>
            </button>
          </div>
          <div>
            <input
              type="number"
              value={item.quantityGrams}
              min={1}
              step={50}
              onChange={(e) =>
                updateQuantity(item.variantId, parseInt(e.target.value))
              }
              className="w-20 border rounded me-1"
            />
            Grams
          </div>
          <div className="flex mt-2 justify-between">
          <div><DirhamSymbol/> {item.pricePerKg}/kg</div>
          <div>Value: <span className="text-green-700"><DirhamSymbol/> {totalForItem.toFixed(2)}</span></div>
          </div>
          
        </div>
      );
    })}
          {/* <table className="w-full text-left  shadow mt-2 p-2">
  <thead>
    <tr className="border-b p-2">
      <th>Name</th>
      <th>Quantity (In Grams)</th>
      <th>Rate (<DirhamSymbol/>/Kg)</th>
      <th>Total</th>
      <th></th>
    </tr>
  </thead>
  <tbody className="p-2">
    {cart.map((item) => {
      const totalForItem = (item.quantityGrams / 1000) * item.pricePerKg;
      return (
        <tr key={item.variantId} className="border-b">
          <td>{item.name}</td>
          <td>
            <input
              type="number"
              value={item.quantityGrams}
              min={1}
              step={50}
              onChange={(e) =>
                updateQuantity(item.variantId, parseInt(e.target.value))
              }
              className="w-20 border rounded"
            />
          </td>
          <td><DirhamSymbol/> {item.pricePerKg}</td>
          <td><DirhamSymbol/> {totalForItem.toFixed(2)}</td>
          <td>
            <button
              onClick={() => removeItem(item.variantId)}
              className="text-red-500"
            >
              ❌
            </button>
          </td>
        </tr>
      );
    })}
  </tbody>
</table> */}
</div>

        )}
      </section>

      {/* Customer Details */}
    
      {/* Bill Summary */}
      <hr/>
      <section className="space-y-2 shadow-md border border-gray-300 p-2 mt-5 rounded  ">
        <h2 className="text-xl font-bold">Bill Summary</h2>
        <p>Subtotal: <DirhamSymbol/> {total.toFixed(2)}</p>
        <p>Discount: {customer.discount || 0}%</p>
        <p className="font-bold text-green-700">Total Payable: <DirhamSymbol/> {discountedTotal.toFixed(2)}</p>
  
  <hr/>
  {cart?.length >0 &&
      <section className="space-y-2">
        <h2 className="text-xl font-bold">Customer Details</h2>
        <label className="block text-sm font-medium mb-1" >Customer Name</label>
        <input
          placeholder="Custome Name"
          value={customer.customerName}
          onChange={(e) =>
            setCustomer({ ...customer, customerName: e.target.value })
          }
          className="w-full border rounded px-2 py-1"
        />
        <label className="block text-sm font-medium mb-1">Customer's Mobile number</label>
        <input
          type="number"
          placeholder="Mobile Number"

          value={customer.customerMobile}
          onChange={(e) =>
            setCustomer({ ...customer, customerMobile: e.target.value })
          }
          className="w-full border rounded px-2 py-1"
        />
        
        <label className="block text-sm font-medium mb-1">Discount (%)</label>

        <input
          type="number"
          placeholder="Discount %"
          min={0}
          max={100}
          value={customer.discount}
          onChange={(e) =>
            setCustomer({ ...customer, discount: parseFloat(e.target.value) })
          }
          className="w-full border rounded px-2 py-1"
        />
      </section>
}

<hr/>
        <div className="flex gap-4  pt-5">
          <Button
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={cart?.length === 0 || !customer?.customerName || !customer?.customerMobile || !isCartValid || customer?.discount <0 || customer?.discount >100 || isNaN(customer?.discount)}
            onClick={handleGetBill}
            loading={generateLoading}
          >
            Generate Bill
          </Button>
          <Button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={reset}
            disabled={generateLoading || cart?.length ===0}
          >
            Reset
          </Button>
        </div>
      </section>
      </div>
      </div>
    </div>
  );
};

export default BillingPage;
