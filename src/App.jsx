import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Categories from "./Pages/Products/Category";
import Products from "./Pages/Products/Products";
import ProductVariants from "./Pages/Products/ProductVariant";
import AddProducts from "./Pages/Products/AddProducts";
import AddVariant from "./Pages/Products/AddVariant";
import ProfileCard from "./Components/Cards/ProfileCard";
import ProductCard from "./Components/Cards/ProductCard";
import Stores from "./Pages/Store Management/Store";
import StoreCard from "./Components/Cards/StoreCard";
import AddStore from "./Pages/Store Management/AddStore";
import AddStoreProducts from "./Pages/Store Management/AddStoreProducts";
import StoreBilling from "./Pages/Store Management/StoreBilling";
import StoreBill from "./Pages/Store Management/StoreBill";
import ProductVariant from "./Components/Cards/ProductVariant";
import Login from "./Components/Login/Login";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/ProtectedRoute";
import BulkOrders from "./Pages/Order Management/BulkOrders";
import ViewBulkOrder from "./Pages/Order Management/ViewBulkOrder";
import Layout from "./Components/Layout/Layout";
import Orders from "./Pages/Order Management/Orders";
import ViewOrder from "./Pages/Order Management/ViewOrder";
import Banner from "./Pages/Content Management/Banner";
import Partners from "./Pages/User Management/Partners";
import Users from "./Pages/User Management/Users";
import ViewUsers from "./Pages/User Management/ViewUsers";

function App() {
  return (
    <>
        <Layout>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products-variant" element={<ProductVariants />} />
        <Route path="/add-products" element={<AddProducts />} />
        <Route path="/add-product-variant" element={<AddVariant />} />
        <Route path="/users" element={<Users />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/content/banners" element={<Banner />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/view/:id" element={<ViewOrder />} />

        <Route path="/bulk-orders" element={<BulkOrders />} />
        <Route path="/bulk-orders/view/:id" element={<ViewBulkOrder />} />
        <Route path="/users/profile/:id" element={<ViewUsers/>} />
        <Route path="/product-card" element={<ProductCard />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/store-details" element={<StoreCard />} />
        <Route path="/add-store" element={<AddStore />} />
        <Route path="/add-store-products" element={<AddStoreProducts />} />
        <Route path="/store-billing" element={<StoreBilling />} />
        <Route path="/billing-page/:id" element={<StoreBill />} />
        <Route path="/store-variant" element={<ProductVariant />} />
        </Route>
      </Routes>
        </Layout>
      <ToastContainer />

    </>
  );
}

export default App;
