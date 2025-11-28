import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "../lib/auth/authUtils";

// Types based on API documentation
export interface UploadFileRequest {
  file: File;
  prefix?: string; // Optional prefix for file organization
}

export interface UploadMultipleFilesRequest {
  files: File[];
  prefix?: string; // Optional prefix for file organization
}

export interface FileUploadResponse {
  key: string;
  url: string;
  size: number;
  contentType: string;
  provider: string;
}

export interface DeleteFileResponse {
  ok: boolean;
  key: string;
}

export interface FileApiResponse<T> {
  message?: string;
  data: T;
  statusCode?: number;
}

export interface UploadFileApiResponse
  extends FileApiResponse<FileUploadResponse> {
  message: "File uploaded";
  statusCode: 201;
}

export interface UploadMultipleFilesApiResponse
  extends FileApiResponse<FileUploadResponse[]> {
  message: "Files uploaded";
  statusCode: 201;
}

export interface DeleteFileApiResponse
  extends FileApiResponse<DeleteFileResponse> {
  message: "File deleted";
  statusCode: 200;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

/**
 * Base query with authentication
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = authStorage.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Base query with reauthentication
 */
const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try to refresh token
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult?.data && typeof refreshResult.data === "object") {
          const refreshData = refreshResult.data as {
            accessToken: string;
            refreshToken?: string;
          };

          // Store new tokens in localStorage
          authStorage.setTokens(
            refreshData.accessToken,
            refreshData.refreshToken
          );

          // Retry the original query
          result = await baseQuery(args, api, extraOptions);
          return result;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }
  }

  return result;
};

export const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["File", "Files"],
  endpoints: (builder) => ({
    // Upload a single file
    uploadFile: builder.mutation<UploadFileApiResponse, UploadFileRequest>({
      query: ({ file, prefix }) => {
        const formData = new FormData();
        formData.append("file", file);
        if (prefix) {
          formData.append("prefix", prefix);
        }

        return {
          url: "/files/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Files", "File"],
    }),

    // Upload multiple files
    uploadMultipleFiles: builder.mutation<
      UploadMultipleFilesApiResponse,
      UploadMultipleFilesRequest
    >({
      query: ({ files, prefix }) => {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append("files", file);
        });
        if (prefix) {
          formData.append("prefix", prefix);
        }

        return {
          url: "/files/upload/many",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Files", "File"],
    }),

    // Delete a file by key or url
    deleteFile: builder.mutation<
      DeleteFileApiResponse,
      { key?: string; url?: string }
    >({
      query: ({ key, url }) => {
        const searchParams = new URLSearchParams();
        if (key) searchParams.append("key", key);
        if (url) searchParams.append("url", url);

        return {
          url: `/files?${searchParams.toString()}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, { key }) => [
        "Files",
        { type: "File", id: key },
      ],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useUploadFileMutation,
  useUploadMultipleFilesMutation,
  useDeleteFileMutation,
} = filesApi;
