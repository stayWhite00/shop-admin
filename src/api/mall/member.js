import request from "@/utils/request";

// 查询会员列表（后台）
export function listMember(query) {
  return request({
    url: "/api/member/query",
    method: "get",
    params: query,
  });
}
