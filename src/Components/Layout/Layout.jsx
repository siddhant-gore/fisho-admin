import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDashboard } from "react-icons/md";
import { IoStorefrontOutline } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { SiGnuprivacyguard } from "react-icons/si";
import { BsFileEarmarkRuled } from "react-icons/bs";
import { FaOpencart } from "react-icons/fa6";
import { BiSolidBookContent } from "react-icons/bi";
import { Image, Dropdown, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, selectAuth } from "../../redux/slices/authSlice";

const Layout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectAuth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    products: false,
    stores: false,
    orders: false,
    content: false,
  });

  useEffect(() => {
    setOpenMenus({
      products: location.pathname.startsWith("/products") || location.pathname.startsWith("/category") || location.pathname.startsWith("/products-variant"),
      stores: location.pathname.startsWith("/stores"),
      orders: location.pathname.startsWith("/orders") || location.pathname.startsWith("/bulk-orders"),
      content: location.pathname.startsWith("/content"),
    });
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const MenuItem = ({ icon: Icon, label, path }) => (
    <Link to={path}>
      <li className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${location.pathname === path ? "bg-[#036DBE]" : ""}`}>
        <Icon size={20} className="mr-2" />
        <span>{label}</span>
      </li>
    </Link>
  );

  const CollapsibleMenu = ({ icon: Icon, label, menuKey, children }) => (
    <>
      <li
        className={`flex items-center mb-4 hover:bg-[#036DBE] p-2 rounded cursor-pointer ${openMenus[menuKey] ? "bg-[#036DBE]" : ""}`}
        onClick={() => toggleMenu(menuKey)}
      >
        <Icon size={20} className="mr-2" />
        <span className="flex-1">{label}</span>
        {openMenus[menuKey] ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </li>
      {openMenus[menuKey] && <ul className="ml-6">{children}</ul>}
    </>
  );

  if (!token) return <div>{children}</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 w-68 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-[#0034BE] text-white p-4`}
      >
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold">Fisho Admin</h2>
        </div>

        <ul>
          <MenuItem icon={MdOutlineDashboard} label="Dashboard" path="/dashboard" />
          <MenuItem icon={CgProfile} label="Users" path="/users" />
          <MenuItem icon={CgProfile} label="Partners" path="/partners" />

          <CollapsibleMenu icon={BsCart4} label="Inventory Management" menuKey="products">
            <MenuItem icon={() => <div />} label="Categories" path="/category" />
            <MenuItem icon={() => <div />} label="Product List" path="/products" />
            <MenuItem icon={() => <div />} label="Product Variant" path="/products-variant" />
          </CollapsibleMenu>

          <CollapsibleMenu icon={FaOpencart} label="Orders Management" menuKey="orders">
            <MenuItem icon={() => <div />} label="Bulk Orders" path="/bulk-orders" />
            <MenuItem icon={() => <div />} label="Orders" path="/orders" />
          </CollapsibleMenu>

          <CollapsibleMenu icon={BiSolidBookContent} label="Content Management" menuKey="content">
            <MenuItem icon={() => <div />} label="Banners" path="/content/banners" />
            
          <MenuItem icon={()=><div/>} label="Privacy Policy" path="/privacy_policy" />
          <MenuItem icon={()=><div/>} label="Terms & Conditions" path="/terms_conditions" />
       
          </CollapsibleMenu>

          <CollapsibleMenu icon={IoStorefrontOutline} label="Stores Management" menuKey="stores">
            <MenuItem icon={() => <div />} label="Store List" path="/stores" />
            <MenuItem icon={() => <div />} label="Add Store Products" path="/add-store-products" />
            <MenuItem icon={() => <div />} label="Store Billing" path="/store-billing" />
          </CollapsibleMenu>

        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0034BE] p-4 shadow-md flex items-center justify-between">
          <button className="text-gray-200" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <p>
                      Signed In as{" "}
                      <span className="text-md text-gray-500 font-bold">{user?.firstname}</span>
                    </p>
                  ),
                  key: "0",
                },
                { type: "divider" },
                { label: <Link to="/profile">Profile</Link>, key: "1" },
                {
                  label: <div onClick={() => dispatch(clearAuth())}>Logout</div>,
                  key: "2",
                },
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
        </header>

        <main className="flex-1 p-8 bg-gray-100 lg:ml-64 md:ml-64">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
