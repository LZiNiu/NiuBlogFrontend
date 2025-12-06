import http from "@/utils/http";

export const getCategoryList = () => { 
  return http.get<Api.CategoryCard[]>("/category/card");
};