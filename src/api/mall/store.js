import request from "@/utils/request";

// 查询门店列表
export function listStore(query) {
  return request({
    url: "/api/store/query",
    method: "get",
    params: query,
  });
}

// 查询门店详情
export function getStore(storeId) {
  return request({
    url: "/api/store/query/detail/" + storeId,
    method: "get",
  });
}

// 新增门店
export function addStore(data) {
  return request({
    url: "/api/store",
    method: "post",
    data: data,
  });
}

// 修改门店
export function updateStore(data) {
  return request({
    url: "/api/store",
    method: "put",
    data: data,
  });
}

// 门店状态修改
export function changeStoreStatus(storeId, status) {
  const data = {
    storeId,
    status,
  };
  return request({
    url: "/api/store/status",
    method: "put",
    data: data,
  });
}

// 删除门店
export function delStore(storeId) {
  return request({
    url: "/api/store/" + storeId,
    method: "delete",
  });
}
