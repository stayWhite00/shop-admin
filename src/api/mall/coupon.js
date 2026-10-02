import request from "@/utils/request";

// 查询优惠券列表（后台）
export function listCoupon(query) {
  return request({
    url: "/api/coupon/query",
    method: "get",
    params: query,
  });
}

// 查询优惠券详细
export function getCoupon(couponId) {
  return request({
    url: "/api/coupon/query/detail/" + couponId,
    method: "get",
  });
}

// 新增优惠券
export function addCoupon(data) {
  return request({
    url: "/api/coupon",
    method: "post",
    data: data,
  });
}

// 修改优惠券
export function updateCoupon(data) {
  return request({
    url: "/api/coupon",
    method: "put",
    data: data,
  });
}

// 删除优惠券
export function delCoupon(couponId) {
  return request({
    url: "/api/coupon/" + couponId,
    method: "delete",
  });
}
