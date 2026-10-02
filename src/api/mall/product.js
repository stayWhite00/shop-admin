import request from "@/utils/request";

// 查询商品列表
export function listProduct(query) {
  return request({
    url: "/api/product/query",
    method: "get",
    params: query,
  });
}

// 查询商品详情
export function getProduct(productId) {
  return request({
    url: "/api/product/detail/" + productId, // 复用C端商品详情接口
    method: "get",
  });
}

// 新增商品
export function addProduct(data) {
  return request({
    url: "/api/product",
    method: "post",
    data: data,
  });
}

// 修改商品
export function updateProduct(data) {
  return request({
    url: "/api/product",
    method: "put",
    data: data,
  });
}

// 删除商品
export function delProduct(productId) {
  return request({
    url: "/api/product/" + productId,
    method: "delete",
  });
}

// 修改商品状态
export function changeProductStatus(productId, status) {
  return request({
    url: "/api/product/status",
    method: "put",
    data: {
      productId,
      status,
    },
  });
}

// ================= 分类管理 =================

// 查询分类列表
export function listCategory(query) {
  return request({
    url: "/api/product/category/list",
    method: "get",
    params: query,
  });
}

// 新增分类
export function addCategory(data) {
  return request({
    url: "/api/product/category",
    method: "post",
    data: data,
  });
}

// 修改分类
export function updateCategory(data) {
  return request({
    url: "/api/product/category",
    method: "put",
    data: data,
  });
}

// 删除分类
export function delCategory(categoryId) {
  return request({
    url: "/api/product/category/" + categoryId,
    method: "delete",
  });
}

// 修改分类状态（单个或批量）
export function changeCategoryStatus(data) {
  return request({
    url: "/api/product/category/status",
    method: "put",
    data: data,
  });
}

