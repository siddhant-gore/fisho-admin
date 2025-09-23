import React, { useState } from 'react'
import { useGetOrderHistoryQuery } from '../../redux/slices/apiSlice'
import { Table } from 'antd';
import { FaFileInvoice } from 'react-icons/fa6';
import DirhamSymbol from '../../Components/DirhamSymbol';
import { getError } from '../../utils/error';

function OrderHistory() {

  
  
  const [currentPage,setCurrentPage] = useState(1);
  const [limit,setLimit] = useState(10);
  const {data,isFetching:isLoading} = useGetOrderHistoryQuery({page: currentPage,limit});

     const handleTableChange = (pagination) => {
    setCurrentPage(pagination?.current);
    setLimit(pagination?.pageSize);
  };

   const handleDownloadReciept = async (data) => {
      try {
        
  
        const link = document.createElement("a");
        link.href = data;
        link.download = "receipt.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // toast.success("Bill Downloaded");
  
      } catch (error) {
        getError(error)
      }
    };

   const columns = [
      {
        title: "S.No",
        dataIndex: "id",
        key: "id",
        width: 60,
        render: (_, __, index) => index + 1 + limit * (currentPage - 1),
      },
      {
        title: "ID",
        key: "id",
        render:(record)=><span>#{record?.id}</span>
      },
      {
        title: "Customer Name",
        dataIndex: "customerName",
        key: "name",
      },
      {
        title: "Customer Number",
        dataIndex: "customerNumber",
        key: "number",
      },
      {
        title: "Amount",
        dataIndex: "price",
        key: "price",
         render: (data) =>
         <span className='text-nowrap'><DirhamSymbol/> {data}</span>,
      
      },
       {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) =>
         <span>{new Date(data).toLocaleString()}</span>,
      },
      // {
      //   title: "Category Image",
      //   dataIndex: "image",
      //   key: "image",
      //   render: (image) => (
      //     <img
      //       src={image || defaultImage}
      //       alt="Category"
      //       className="w-10 h-10 rounded-md"
      //     />
      //   ),
      // },
      {
        title: "Download Reciept",
        key: "actions",
        render: (_, record) => (
          <div className="flex gap-3">
            <FaFileInvoice
              className="cursor-pointer text-blue-500"
              size={18}
              onClick={() => handleDownloadReciept(record?.pdf)}
            />
          
          </div>
        ),
      },
    ];
  
    return (
      <div>
        
          <h2 className="font-semibold text-xl mb-2">Billing History</h2>

        <div className="p-4">
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={data?.data?.billings?.length > 0 && data?.data?.billings?.map((item) => ({
              ...item,
              key: item?.id,
            }))}
             pagination={{
    current: currentPage,
    pageSize: limit,
    total: data?.data?.total,
     
  }}
            locale={{ emptyText: "No items" }} 
              onChange={handleTableChange}

          />
        </div>
  
       
  
       
      </div>
    );
}

export default OrderHistory