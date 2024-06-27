import request from '@/utils/request'

// 查询文件夹列表
export function listFolder(query) {
  return request({
    url: '/cms/folder/list',
    method: 'get',
    params: query
  })
}

// 查询文件夹详细
export function getFolder(folderId) {
  return request({
    url: '/cms/folder/' + folderId,
    method: 'get'
  })
}

// 新增文件夹
export function addFolder(data) {
  return request({
    url: '/cms/folder',
    method: 'post',
    data: data
  })
}

// 修改文件夹
export function updateFolder(data) {
  return request({
    url: '/cms/folder',
    method: 'put',
    data: data
  })
}

// 删除文件夹
export function delFolder(folderId) {
  return request({
    url: '/cms/folder/' + folderId,
    method: 'delete'
  })
}

// 查询文件夹下拉树结构
export function folderTreeSelect() {
  return request({
    url: '/cms/folder/folderTreeList',
    method: 'get'
  })
}
