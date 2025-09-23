import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const BASE_URL = "https://fishselling-backend.onrender.com/api/v1";
// const BASE_URL = "https://api.fisho.ae/api/v1";
// export const SOCKET_BASE_URL = "https://api.fisho.ae";
export const SOCKET_BASE_URL = "https://fishselling-backend.onrender.com";
export const imgAddr = "https://creative-story.s3.amazonaws.com";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = getState().auth;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
    
  }),

  tagTypes:[
    'Users',
    'Partners',
    'Products',
    'Variants',
    'BulkOrders',
    'Orders',
    'GetBulkOrder',
    'Banners',
    'Categories',
    'ProductVariants',
    'Stores',
    'Term',
    'Privacy',
    'Notification',
    'Refund',
    'Communities'
  ],


  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/users/signin-admin",
        method: "POST",
        body: data,
      }),
    }),

    getCommunities: builder.query({
        query:()=>({
           url:'/community/findall',
           method:'GET',
            
        }),
        providesTags:['Communities']

    }),
    getUser: builder.query({
        query:({page,limit,search})=>({
           url:'/users/findall',
           method:'GET',
           params:{
            page,
            limit,
            search
           }     
        }),
        providesTags:['Users']

    }),
    getExportUsers: builder.mutation({
      query:({start,end})=>({
         url:`/stores/user-report?start=${start}&end=${end}`,
         method:'GET',  
      }),
  }),
    getProfile: builder.query({
      query:()=>({
         url:`/users/admin-profile`,
         method:'GET',  
      }),
      // providesTags:['Users']
  }),

    getUserById: builder.query({
      query:(id)=>({
         url:`/users/find-user/${id}`,
         method:'GET',  
      }),
      providesTags:['Users']
  }),
   updateUserById: builder.mutation({
      query:({id,data})=>({
         url:`/users/update/by/admin/${id}`,
         method:'PATCH',
         body:data,  
      }),
      invalidatesTags:['Users']
  }),
   updateUserAddressById: builder.mutation({
      query:({id,data})=>({
         url:`/users/update-address/by/admin/${id}`,
         method:'PATCH',
         body:data,  
      }),
      invalidatesTags:['Users']
  }),

  deleteUserById: builder.mutation({
      query:(id)=>({
         url:`/users/remove-user/${id}`,
         method:'PATCH',  
      }),
      invalidatesTags:['Users']
  }),

    getUserOrdersById: builder.query({
      query:({id,page,limit})=>({
         url:`/orders/findall/user/history/${id}`,
         method:'GET',  
          params:{
            page,
            limit
            
           }  
      }),
      providesTags:['Users']
  }),
   getExportPartner: builder.mutation({
      query:({start,end})=>({
         url:`/stores/partner-report?start=${start}&end=${end}`,
         method:'GET',  
      }),
  }),
    getPartners: builder.query({
        query:({page,limit,search})=>({
           url:'/delivery-partner/findall',
           method:'GET',
           params:{
            page,
            limit,
            search
           }     
        }),
        providesTags:['Partners']

    }),
    getPartnerById: builder.query({
      query:(id)=>({
         url:`/delivery-partner/find/${id}`,
         method:'GET',  
      }),
      providesTags:['Partners']
  }),
    updatePartnerById: builder.query({
      query:(id)=>({
         url:`/delivery-partner/update/${id}`,
         method:'PATCH',  
      }),
      invalidatesTags:['Partners']
  }),
    deletePartnerById: builder.mutation({
      query:(id)=>({
         url:`/delivery-partner/delete/${id}`,
         method:'PATCH',  
      }),
      invalidatesTags:['Partners']
  }),

    getStats: builder.query({
      query:()=>({
         url:'/stores/dashboard',
         method:'GET',
          
      }),
  }),
    getSubadminStats: builder.query({
      query:()=>({
         url:'/stores/dashboard/subadmin',
         method:'GET',
          
      }),
  }),
    getRefunds: builder.query({
      query:({page,limit})=>({
         url:'/refund-order/findall/admin',
         method:'GET',
         params:{
          page,
          limit
         }     
      }),
      providesTags:['Refund']

  }),
  getRefundById: builder.query({
      query:(id)=>({
         url:`/refund-order/find/${id}`,
         method:'GET',  
      }),
      providesTags:['Refund']
  }),
     refundAmount: builder.mutation({
      query:(data)=>({
         url:`/refund-order/send-money`,
         method:'PATCH',  
         body:data
      }),
      invalidatesTags:['Refund']
  }),
   getExportOrders: builder.mutation({
      query:({start,end})=>({
         url:`/stores/order-report?start=${start}&end=${end}`,
         method:'GET',  
      }),
  }),
    getOrders: builder.query({
      query:({page,limit,search})=>({
         url:'/orders/admin/findall',
         method:'GET',
         params:{
          page,
          limit,
          search
         }     
      }),
      providesTags:['Orders']

  }),
  getOrderById: builder.query({
      query:(id)=>({
         url:`/orders/find/${id}`,
         method:'GET',  
      }),
      providesTags:['Orders']
  }),
  updateOrderById: builder.mutation({
    query:({groupId,data})=>({
      url:`/bulk-order/${groupId}/update-status`,
      method:'PATCH',  
      body:data
    }),
    invalidatesTags:['GetBulkOrder','BulkOrders']
  }),
  deleteOrderById: builder.mutation({
      query:(groupId)=>({
         url:`/bulk-order/${groupId}`,
         method:'DELETE',  
      }),
      invalidatesTags:['GetBulkOrder','BulkOrders']
  }),
 getExportBulkOrders: builder.mutation({
      query:({start,end})=>({
         url:`/stores/bulk-order-report?start=${start}&end=${end}`,
         method:'GET',  
      }),
  }),
    getBulkOrders: builder.query({
        query:({page,limit,search})=>({
           url:'/bulk-order/findall/admin',
           method:'GET',
           params:{
            page,
            limit,
            search
           }     
        }),
        providesTags:['BulkOrders']

    }),
    getBulkOrderById: builder.query({
        query:(groupId)=>({
           url:`/bulk-order/${groupId}/admin`,
           method:'GET',  
        }),
        providesTags:['GetBulkOrder']
    }),
    updateBulkOrderById: builder.mutation({
      query:({groupId,data})=>({
        url:`/bulk-order/${groupId}/update-status`,
        method:'PATCH',  
        body:data
      }),
      invalidatesTags:['GetBulkOrder','BulkOrders']
    }),
    deleteBulkOrderById: builder.mutation({
        query:(groupId)=>({
           url:`/bulk-order/${groupId}`,
           method:'DELETE',  
        }),
        invalidatesTags:['GetBulkOrder','BulkOrders']
    }),


    getAllBanners: builder.query({
        query:()=>({
           url:'/banner/findall',
           method:'GET',
          //  params:{
          //   page,
          //   limit
          //  }     
        }),
        providesTags:['Banners']

    }),
  
    createBanner: builder.mutation({
      query:(data)=>({
        url:`/banner/add`,
        method:'POST',  
        body:data
      }),
      invalidatesTags:['Banners']
    }),

    updateBannerById: builder.mutation({
      query:({id,data})=>({
        url:`/banner/update/${id}`,
        method:'PATCH',  
        body:data
      }),
      invalidatesTags:['Banners']
    }),
    
    deleteBannerById: builder.mutation({
        query:(id)=>({
           url:`/banner/delete/${id}`,
           method:'DELETE',  
        }),
        invalidatesTags:['Banners']
    }),

    getAllCategories: builder.query({
        query:()=>({
           url:'/category/findall/admin',
           method:'GET',
          //  params:{
          //   page,
          //   limit
          //  }     
        }),
        providesTags:['Categories']

    }),

    getCategoryById: builder.query({
      query:(id)=>({
         url:`/category/find/${id}`,
         method:'GET',  
      }),
      providesTags:['Categories']
  }),
  
    createCategory: builder.mutation({
      query:(data)=>({
        url:`/category/add`,
        method:'POST',  
        body:data
      }),
      invalidatesTags:['Products','Categories']
    }),

    updateCategoryById: builder.mutation({
      query:({id,data})=>({
        url:`/category/update/${id}`,
        method:'PATCH',  
        body:data
      }),
      invalidatesTags:['Products','Categories']
    }),
    
    deleteCategoryById: builder.mutation({
        query:(id)=>({
           url:`/category/delete/${id}`,
           method:'PATCH',  
        }),
        invalidatesTags:['Products','Categories']
    }),

    getAllProducts: builder.query({
        query:({page,limit,search=''})=>({
           url:'/product/findall',
           method:'GET',
           params:{
            page,
            limit,
            search
           }     
        }),
        providesTags:['Products']

    }),
     getExportProducts: builder.mutation({
      query:()=>({
         url:`/stores/product-report`,
         method:'GET',  
      }),
  }),
     getExportVariants: builder.mutation({
      query:()=>({
         url:`/stores/variant-report`,
         method:'GET',  
      }),
  }),
     updateDiscountAllVariants: builder.mutation({
      query:(data)=>({
         url:`/product-variant/update-discount`,
         method:'PUT',  
         body: data
      }),
      invalidatesTags:['ProductVariants','Products']
  }),
    getAllFilteredProducts: builder.query({
        query:(id)=>({
           url:`/product/trending-products/admin/${id}?page=1&limit=1000`,
           method:'GET',
          //  params:{
          //   page,
          //   limit
          //  }     
        }),
        providesTags:['Products']

    }),

    getProductById: builder.query({
      query:(id)=>({
         url:`/product/find/${id}`,
         method:'GET',  
      }),
      providesTags:['Products']
  }),
  
    createProduct: builder.mutation({
      query:(data)=>({
        url:`/product/add`,
        method:'POST',  
        body:data
      }),
      invalidatesTags:['Products']
    }),

    updateProductById: builder.mutation({
      query:({id,data})=>({
        url:`/product/update/${id}`,
        method:'PATCH',  
        body:data
      }),
      invalidatesTags:['Products']
    }),
    outOfStockProduct: builder.mutation({
      query:({id,data})=>({
        url:`/product/outOfStock/${id}`,
        method:'PATCH',  
        body:data
      }),
      invalidatesTags:['Stores']
    }),
    
    deleteProductById: builder.mutation({
        query:(id)=>({
           url:`/product/delete/${id}`,
           method:'PATCH',  
        }),
        invalidatesTags:['Products']
    }),


    getAllVariantsByProduct: builder.mutation({
        query:(id)=>({
           url:`/product-variant/find-by-product/${id}`,
           method:'GET',
          //  params:{
          //   page,
          //   limit
          //  }     
        }),

    }),
    getAllProductVariants: builder.query({
        query:({page,limit,search})=>({
           url:'/product-variant/findall',
           method:'GET',
           params:{
            page,
            limit,
            search
           }     
        }),
        providesTags:['ProductVariants']

    }),

    getProductVariantById: builder.query({
      query:(id)=>({
         url:`/product-variant/find/${id}`,
         method:'GET',  
      }),
      providesTags:['ProductVariants']
  }),
  
    createProductVariant: builder.mutation({
      query:(data)=>({
        url:`/product-variant/add`,
        method:'POST',  
        body:data
      }),
      invalidatesTags:['ProductVariants']
    }),

    updateProductVariantById: builder.mutation({
      query:({id,data})=>({
        url:`/product-variant/update/${id}`,
        method:'PATCH',  
        body:data
      }),
      invalidatesTags:['ProductVariants']
    }),
    
    deleteProductVariantById: builder.mutation({
        query:(id)=>({
           url:`/product-variant/delete/${id}`,
           method:'PATCH',  
        }),
        invalidatesTags:['ProductVariants']
    }),


    getAllStores: builder.query({
        query:()=>({
           url:'/stores/findall',
           method:'GET',
          //  params:{
          //   page,
          //   limit
          //  }     
        }),
        providesTags:['Stores']

    }),

    getStoreById: builder.query({
      query:(id)=>({
         url:`/stores/find/${id}`,
         method:'GET',  
      }),
      providesTags:['Stores']
  }),
  
    createStore: builder.mutation({
      query:(data)=>({
        url:`/stores/add`,
        method:'POST',  
        body:data
      }),
      invalidatesTags:['Stores']
    }),

    updateSubadminById: builder.mutation({
      query:({id,data})=>({
        url:`/stores/update/subadmin/${id}`,
        method:'PATCH',  
        body:data
      }),
      invalidatesTags:['Stores']
    }),
    updateStoreById: builder.mutation({
      query:({id,data})=>({
        url:`/Stores/update/${id}`,
        method:'PATCH',  
        body:data
      }),
      invalidatesTags:['Stores']
    }),
    
    deleteStoreById: builder.mutation({
        query:(id)=>({
           url:`/Stores/delete/${id}`,
           method:'PATCH',  
        }),
        invalidatesTags:['Stores']
    }),
    getOrderHistory: builder.query({
      query:({page,limit})=>({
        url:`/store-billing`,
        method:'GET', 
         params:{
            page,
            limit
            
           }   
      }),
    }),
    generateBill: builder.mutation({
      query:(data)=>({
        url:`/store-billing/create`,
        method:'POST',  
        body:data
      }),
    }),
    addProductToStore: builder.mutation({
      query:(data)=>({
        url:`/store-product/add`,
        method:'POST',  
        body:data
      }),
    }),

     getUserTc: builder.query({
      query:()=>({
         url:`/terms-and-condition/user`,
         method:'GET',  
      }),
      providesTags:['Term']
  }),
     getDeliveryTc: builder.query({
      query:()=>({
         url:`/terms-and-condition/delivery-partner`,
         method:'GET',  
      }),
      providesTags:['Term']
  }),

     updateTc: builder.mutation({
      query:({id,data})=>({
         url:`/terms-and-condition/update/${id}`,
         method:'PATCH',  
         body:data
      }),
      invalidatesTags:['Term']
  }),
     getUserPolicy: builder.query({
      query:()=>({
         url:`/privacy-policy/user`,
         method:'GET',  
      }),
      providesTags:['Privacy']
  }),
     getDeliveryPolicy: builder.query({
      query:()=>({
         url:`/privacy-policy/delivery-partner`,
         method:'GET',  
      }),
      providesTags:['Privacy']
  }),

     updatePolicy: builder.mutation({
      query:({id,data})=>({
         url:`/privacy-policy/update/${id}`,
         method:'PATCH',  
         body:data
      }),
      invalidatesTags:['Privacy']
  }),
     saveFcmToken: builder.mutation({
      query:(fcmToken)=>({
         url:`/users/fcm-token`,
         method:'POST',  
         body:{fcmToken}
      }),
      invalidatesTags:['Notification']
  }),

     getNotifications: builder.query({
      query:()=>({
         url:`/notifications/findall/admin-panel`,
         method:'GET',  
      }),
      providedTags:['Notification']
  }),
     markNotificationAsSeen: builder.mutation({
      query:(id)=>({
         url:`/notifications/${id}/seen`,
         method:'PATCH',  
      }),
      invalidatesTags:['Notification']
  }),
     deleteNotification: builder.mutation({
      query:(id)=>({
         url:`/notifications/${id}`,
         method:'DELETE',  
      }),
      invalidatesTags:['Notification']
  }),
        
   
})
})


export const {
  useUpdateDiscountAllVariantsMutation,
  useGetCommunitiesQuery,
  useUpdateUserByIdMutation,
  useUpdateUserAddressByIdMutation,
  useGetExportOrdersMutation,
  useGetExportBulkOrdersMutation,
  useGetExportPartnerMutation,
  useGetExportUsersMutation,
  useGetSubadminStatsQuery,
  useUpdateSubadminByIdMutation,
  useGenerateBillMutation,
 useGetUserPolicyQuery,
 useGetDeliveryPolicyQuery,
 useUpdatePolicyMutation,
useLoginUserMutation,
useGetProfileQuery,
useGetUserQuery,
useGetUserByIdQuery,
useGetUserOrdersByIdQuery,
useGetBulkOrdersQuery,
useGetBulkOrderByIdQuery,
useUpdateBulkOrderByIdMutation,
useDeleteBulkOrderByIdMutation,
useGetOrdersQuery,
useGetOrderByIdQuery,
useGetAllBannersQuery,
useCreateBannerMutation,
useUpdateBannerByIdMutation,
useDeleteBannerByIdMutation,
useGetPartnersQuery,
useGetPartnerByIdQuery,
useDeleteUserByIdMutation,
useUpdatePartnerByIdMutation,
useGetExportProductsMutation,
useGetExportVariantsMutation,
useDeletePartnerByIdMutation,
useCreateProductMutation,
useGetAllProductsQuery,
useAddProductToStoreMutation,
useGetProductByIdQuery,
useUpdateProductByIdMutation,
useDeleteProductByIdMutation,
useGetAllVariantsByProductMutation,
useGetAllProductVariantsQuery,
useGetProductVariantByIdQuery,
useCreateProductVariantMutation,
useUpdateProductVariantByIdMutation,
useDeleteProductVariantByIdMutation,
useGetAllCategoriesQuery,
useCreateCategoryMutation,
useUpdateCategoryByIdMutation,
useGetCategoryByIdQuery,
useDeleteCategoryByIdMutation,
useGetAllStoresQuery,
useGetStoreByIdQuery,
useCreateStoreMutation,
useUpdateStoreByIdMutation,
useDeleteStoreByIdMutation,
useGetUserTcQuery,
useUpdateTcMutation,
useGetDeliveryTcQuery,
useGetOrderHistoryQuery,
useGetAllFilteredProductsQuery,
useGetNotificationsQuery,
useSaveFcmTokenMutation,
useDeleteNotificationMutation,
useMarkNotificationAsSeenMutation,
useGetStatsQuery,
useGetRefundsQuery,
useGetRefundByIdQuery,
useRefundAmountMutation,
useOutOfStockProductMutation,
} = apiSlice;
