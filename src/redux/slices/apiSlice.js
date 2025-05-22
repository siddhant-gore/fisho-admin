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
    getUserById: builder.query({
      query:(id)=>({
         url:`/users/find-user/${id}`,
         method:'GET',  
      }),
      providesTags:['Users']
  }),
    getPartners: builder.query({
        query:({page,limit})=>({
           url:'/delivery-partner/findall',
           method:'GET',
           params:{
            page,
            limit
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
    deletePartnerById: builder.query({
      query:(id)=>({
         url:`/delivery-partner/delete/${id}`,
         method:'DELETE',  
      }),
      invalidatesTags:['Partners']
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

    getAllCategories: builder.query({
        query:()=>({
           url:'/category/findall',
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
        query:()=>({
           url:'/product/findall',
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
        query:()=>({
           url:'/product-variant/findall',
           method:'GET',
          //  params:{
          //   page,
          //   limit
          //  }     
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
    addProductToStore: builder.mutation({
      query:(data)=>({
        url:`/store-product/add`,
        method:'POST',  
        body:data
      }),
    }),
        
   
})
})


export const {
 
useLoginUserMutation,
useGetUserQuery,
useGetUserByIdQuery,
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
useUpdatePartnerByIdMutation,
useDeletePartnerByIdQuery,
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
useDeleteStoreByIdMutation

} = apiSlice;
