import request from "@/utils/request";

// 查询会员等级列表
export function listLevel() {
  return request({
    url: "/api/mall/level/list",
    method: "get",
  });
}

// 查询会员等级详细
export function getLevel(levelId) {
  return request({
    url: "/api/mall/level/" + levelId,
    method: "get",
  });
}

// 修改会员等级
export function updateLevel(data) {
  return request({
    url: "/api/mall/level",
    method: "put",
    data: data,
  });
}
