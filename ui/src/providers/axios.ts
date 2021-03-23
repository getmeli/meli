import axiosLib from 'axios';

export const axios = axiosLib.create({
  withCredentials: true,
});

export const { CancelToken } = axiosLib;
