import request from "@/utils/request";

// 查询订单列表
export function listOrder(query) {
  return request({
    url: "/api/order/query",
    method: "get",
    params: query,
  });
}

// 查询订单详细
export function getOrder(orderId) {
  return request({
    url: "/api/order/query/detail/" + orderId,
    method: "get",
  });
}

// 修改订单状态
export function updateOrderStatus(orderId, status) {
  return request({
    url: "/api/order/status",
    method: "put",
    data: {
      orderId,
      status,
    },
  });
}

// 发货
export function shipOrder(data) {
  return request({
    url: "/api/order/ship",
    method: "put",
    data: data,
  });
}
