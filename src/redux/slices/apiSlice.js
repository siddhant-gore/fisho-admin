import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const BASE_URL = "https://fishselling-backend.onrender.com/api/v1";
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
    'BulkOrders',
    'Orders',
    'GetBulkOrder',
    'Banners'
  ],


  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/users/signin-admin",
        method: "POST",
        body: data,
      }),
    }),

    getUser: builder.query({
        query:({page,limit})=>({
           url:'/users/findall',
           method:'GET',
           params:{
            page,
            limit
           }     
        }),
        providesTags:['Users']

    }),

    getOrders: builder.query({
      query:({page,limit})=>({
         url:'/orders/admin/findall',
         method:'GET',
         params:{
          page,
          limit
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

    getBulkOrders: builder.query({
        query:({page,limit})=>({
           url:'/bulk-order/findall/admin',
           method:'GET',
           params:{
            page,
            limit
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
        
   
})
})


export const {
 
useLoginUserMutation,
useGetUserQuery,
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

} = apiSlice;
