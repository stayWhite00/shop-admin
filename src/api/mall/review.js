import request from "@/utils/request";

// 查询评价列表（后台）
export function listReview(query) {
  return request({
    url: "/api/review/query",
    method: "get",
    params: query,
  });
}

// 查询评价详情
export function getReview(id) {
  return request({
    url: "/api/review/query/detail/" + id,
    method: "get",
  });
}

// 审核评价
export function auditReview(reviewId, status) {
  return request({
    url: `/api/review/audit/${reviewId}`,
    method: "put",
    params: { status },
  });
}

// 回复评价
export function replyReview(reviewId, replyContent) {
  return request({
    url: `/api/review/reply/${reviewId}`,
    method: "put",
    params: { replyContent },
  });
}
