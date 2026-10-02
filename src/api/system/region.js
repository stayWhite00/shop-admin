import request from "@/utils/request";

// 获取省市区树形结构
export function getRegionTree() {
  return request({
    url: "/api/region/tree",
    method: "get",
  });
}
