import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDashboard } from "react-icons/md";
import { IoStorefrontOutline } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { Image, Dropdown, Space } from "antd";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { SiGnuprivacyguard } from "react-icons/si";
import { BsFileEarmarkRuled } from "react-icons/bs";
import { clearAuth, selectAuth } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaOpencart } from "react-icons/fa6";
import { BiSolidBookContent } from "react-icons/bi";
// import fisho from "../../assets/Images/Screenshot 2025-02-20 143843.png";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const {user,token} = useSelector(selectAuth)
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isStoresOpen, setIsStoresOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isContentOpen,setIsContentOpen] = useState(false);


  useEffect(() => {
    setIsProductsOpen(location.pathname.startsWith("/products"));
    setIsStoresOpen(location.pathname.startsWith("/stores"));
    setIsOrderOpen(location.pathname.startsWith("/orders"));
    setIsContentOpen(location.pathname.startsWith("/content"));
  }, [location.pathname]);


  
  if(!token) return (
    <div>
      {children}
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 w-68 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-[#0034BE] text-white p-4`}
      >
        <div className="flex flex-row items-center">
          {/* <img className="h-10 w-20" src={fisho} alt="" /> */}
          <h2 className="text-xl font-bold"> Fisho Admin</h2>
        </div>

        <ul>
          <Link to="/dashboard">
            <li
              className={`flex items-center mb-4 mt-8 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                location.pathname === "/dashboard" ? "bg-[#036DBE]" : ""
              }`}
            >
              <MdOutlineDashboard size={20} className="mr-2" />
              <span>Dashboard</span>
            </li>
          </Link>

          <Link to="/users">
            <li
              className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                location.pathname.startsWith("/users") ? "bg-[#036DBE]" : ""
              }`}
            >
              <CgProfile size={20} className="mr-2" />
              <span>Users</span>
            </li>
          </Link>



          {/* Inventory Management (Dropdown) */}
          <li
            className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
              isProductsOpen ? "bg-[#036DBE]" : ""
            }`}
            onClick={() => setIsProductsOpen(!isProductsOpen)}
          >
            <BsCart4 size={20} className="mr-2" />
            <span>Inventory Management</span>
            <span className="ml-1">
              {isProductsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </li>

          {isProductsOpen && (
            <ul className="ml-6">
              <Link to="/category">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname.startsWith("/category")
                      ? "bg-[#036DBE]"
                      : ""
                  }`}
                >
                  Categories
                </li>
              </Link>
              <Link to="/products">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/products" ? "bg-[#036DBE]" : ""
                  }`}
                >
                  Product List
                </li>
              </Link>
              <Link to="/products-variant">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/products-variant"
                      ? "bg-[#036DBE]"
                      : ""
                  }`}
                >
                  Product Variant
                </li>
              </Link>
            </ul>
          )}


<li
            className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
              isOrderOpen ? "bg-[#036DBE]" : ""
            }`}
            onClick={() => setIsOrderOpen(!isOrderOpen)}
          >
            <FaOpencart size={20} className="mr-2" />
            <span>Orders Management</span>
            <span className="ml-auto">
              {isOrderOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </li>

          {isOrderOpen && (
            <ul className="ml-6">
              <Link to="/bulk-orders">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/bulk-orders" ? "bg-[#036DBE]" : ""
                  }`}
                >
                  Bulk orders
                </li>
              </Link>
              <Link to="/orders">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/orders" ? "bg-[#036DBE]" : ""
                  }`}
                >
                  Orders
                </li>
              </Link>
             
            
            </ul>
          )}
          

<li
            className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
              isOrderOpen ? "bg-[#036DBE]" : ""
            }`}
            onClick={() => setIsContentOpen(!isContentOpen)}
          >
            <BiSolidBookContent size={20} className="mr-2" />
            <span>Content Management</span>
            <span className="ml-auto">
              {isOrderOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </li>

          {isContentOpen && (
            <ul className="ml-6">
              <Link to="/content/banners">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/content/banners" ? "bg-[#036DBE]" : ""
                  }`}
                >
                  Banners
                </li>
              </Link>
              {/* <Link to="/orders">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/orders" ? "bg-[#036DBE]" : ""
                  }`}
                >
                  Orders
                </li>
              </Link> */}
             
            
            </ul>
          )}

          {/* Stores Management (Dropdown) */}
          <li
            className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
              isStoresOpen ? "bg-[#036DBE]" : ""
            }`}
            onClick={() => setIsStoresOpen(!isStoresOpen)}
          >
            <IoStorefrontOutline size={20} className="mr-2" />
            <span>Stores Management</span>
            <span className="ml-auto">
              {isStoresOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </li>

          {isStoresOpen && (
            <ul className="ml-6">
              <Link to="/stores">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/stores" ? "bg-[#036DBE]" : ""
                  }`}
                >
                  Store List
                </li>
              </Link>
              <Link to="/add-store-products">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/add-store-products"
                      ? "bg-[#036DBE]"
                      : ""
                  }`}
                >
                  Add Store Products
                </li>
              </Link>
              <Link to="/store-billing">
                <li
                  className={`flex items-center mb-2 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                    location.pathname === "/store-billing" ? "bg-[#036DBE]" : ""
                  }`}
                >
                  Store Billing
                </li>
              </Link>
            </ul>
          )}

          <Link to="/privacy_policy">
            <li
              className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                location.pathname === "/privacy_policy" ? "bg-[#036DBE]" : ""
              }`}
            >
              <SiGnuprivacyguard size={20} className="mr-2" />
              <span>Privacy Policy</span>
            </li>
          </Link>

          <Link to="/terms_conditions">
            <li
              className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${
                location.pathname === "/terms_conditions" ? "bg-[#036DBE]" : ""
              }`}
            >
              <BsFileEarmarkRuled size={20} className="mr-2" />
              <span>Terms & Conditions</span>
            </li>
          </Link>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0034BE] p-4 shadow-md flex items-center justify-between">
          <button
            className="text-gray-200"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          <div className="flex justify-end items-center">
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <p>
                        Signed In as{" "}
                        <span className="text-md text-gray-500 font-bold">
                          {user?.firstname}
                        </span>
                      </p>
                    ),
                    key: "0",
                  },
                  { type: "divider" },
                  { label: <Link to={"/profile"}>Profile</Link>, key: "1" },
                  { label: <div onClick={()=>dispatch(clearAuth())}>Logout</div>, key: "2" },
                ],
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Image
                    className="border border-gray-300 rounded-full cursor-pointer"
                    width={30}
                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"
                    preview={false}
                  />
                </Space>
              </a>
            </Dropdown>
          </div>
        </header>

        <main className="flex-1 p-8 bg-gray-100 lg:ml-64 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
