import { ApiResponse } from '@packages/types'

export async function postAction<T>(
  url: string,
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  if (localStorage.getItem('token')) {
    headers['Authorization'] = localStorage.getItem('token') as string
  }
  const data: ApiResponse<T> = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(params)
  }).then((res) => res.json())
  if (data.code === 0) {
    return data
  }
  throw new Error(data.message)
}

export async function getAction<T>(
  url: string,
  params: Record<string, any>
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  if (localStorage.getItem('token')) {
    headers['Authorization'] = localStorage.getItem('token') as string
  }
  const data: ApiResponse<T> = await fetch(url, {
    method: 'GET',
    headers,
    body: JSON.stringify(params)
  }).then((res) => res.json())
  if (data.code === 0) {
    return data
  }
  throw new Error(data.message)
}
