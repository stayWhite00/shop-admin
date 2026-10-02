import request from "@/utils/request";

// 查询售后列表
export function listAfterSale(query) {
  return request({
    url: "/api/afterSale/query",
    method: "get",
    params: query,
  });
}

// 查询售后详情
export function getAfterSale(id) {
  return request({
    url: "/api/afterSale/query/detail/" + id,
    method: "get",
  });
}

// 审核售后
export function auditAfterSale(data) {
  return request({
    url: "/api/afterSale/audit",
    method: "put",
    data: data,
  });
}
