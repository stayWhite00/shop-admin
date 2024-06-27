import request from '@/utils/request'

// 查询文件列表
export function listDocs(query) {
  return request({
    url: '/cms/docs/list',
    method: 'get',
    params: query
  })
}

// 查询文件详细
export function getDocs(docsId) {
  return request({
    url: '/cms/docs/' + docsId,
    method: 'get'
  })
}

// 新增文件
export function addDocs(data) {
  return request({
    url: '/cms/docs',
    method: 'post',
    data: data
  })
}

// 修改文件
export function updateDocs(data) {
  return request({
    url: '/cms/docs',
    method: 'put',
    data: data
  })
}

// 删除文件
export function delDocs(docsId) {
  return request({
    url: '/cms/docs/' + docsId,
    method: 'delete'
  })
}
