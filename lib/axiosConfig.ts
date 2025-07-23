/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Use relative URLs in production, absolute in development
const getBaseURL = () => {
  // If NEXT_PUBLIC_BASE_URL is set, use it
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // In production, use relative URLs (empty string means relative to current domain)
  // In development, use localhost
  return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
};

const instance = axios.create({
  baseURL: getBaseURL(),
});

export const getFetch = <Res>(url: string, params = {}) => {
  return instance<Res>({
    method: 'GET',
    url,
    params,
  }).then((response) => response.data);
};

export const postFetch = <Req = any, Res = any>(url: string, data: Req) => {
  return instance<Res>({
    method: 'POST',
    url,
    data,
  }).then((response) => response.data);
};

export const patchFetch = <Req = any, Res = any>(url: string, data: Req) => {
  return instance<Res>({
    method: 'PATCH',
    url,
    data,
  }).then((response) => response.data);
};

export const putFetch = <Req = any, Res = any>(url: string, data: Req) => {
  return instance<Res>({
    method: 'PUT',
    url,
    data,
  }).then((response) => response.data);
};

export const deleteFetch = (url: string) => {
  return instance({
    method: 'DELETE',
    url,
  }).then((response) => response.data);
};
