import axios from 'axios';
import qs from 'qs'

let base = '/api';
axios.defaults.withCredentials = true;
var instance = axios.create({
  // baseURL: '/api',
  timeout: 1000,
  // withCredentials: true, // 允许携带cookie
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer(params) {
    return qs.stringify(params, {
      arrayFormat: 'repeat'
    })
  }
});
//-----------------------------user------------------------------------
export const checkLogin = () => {
  return instance.get(`${base}/checklogin`).then(res => res.data);
};
export const changePassword = params => {
  return instance.post(`${base}/user/changepassword`, params).then(res => res.data);
};
export const changeUserState = params => {
  return instance.post(`${base}/user/changestate`, params).then(res => res.data);
};
export const logout = () => {
  return instance.get(`${base}/logout`).then(res => res.data);
};
export const requestLogin = params => {
  return instance.post(`${base}/slogin`, params).then(res => res.data);
};
export const requestAllUser = params => {
  return instance.get(`${base}/user/all`, {
    params: params
  }).then(res => res.data)
};
export const addUser = params => {
  return instance.post(`${base}/user/edit`, params).then(res => res.data);
};
//--------------------------------------cates---------------------
export const addCates = params => {
  return instance.post(`${base}/cates/add`, params).then(res => res.data);
};
export const editCates = params => {
  return instance.post(`${base}/cates/edit`, params).then(res => res.data);
};
export const requestAllCates = () => {
  return instance.get(`${base}/cates/all`).then(res => res.data)
};
export const changeCatesState = params => {
  return instance.post(`${base}/cates/changecatesstate`, params).then(res => res.data);
};

//-------------------------------singer---------------------
export const requestAllSinger = params => {
  return instance.get(`${base}/singer/all`, {
    params: params
  }).then(res => res.data)
};
export const changeSingerState = params => {
  return instance.post(`${base}/singer/changestate`, params).then(res => res.data);
};
//-----------------------------song--------------------------
export const requestAllSong = params => {
  return instance.get(`${base}/song/all`, {
    params: params
  }).then(res => res.data)
};
export const changeSongState = params => {
  return instance.post(`${base}/song/changestate`, params).then(res => res.data);
};
//-------------------------------bar-----------------------------
export const requestBar = () => {
  return instance.get(`${base}/bar/all`).then(res => res.data)
};
export const updateBar = params => {
  return instance.post(`${base}/bar/update`, params).then(res => res.data);
}

//------------------------------album------------------------------
export const requestAllAlbum = params => {
  return instance.get(`${base}/album/all`, {
    params: params
  }).then(res => res.data)
};
export const changeAlbumState = params => {
  return instance.post(`${base}/album/changestate`, params).then(res => res.data);
};
//------------------------------sheet------------------------------
export const requestAllSheet = params => {
  return instance.get(`${base}/sheet/allm`, {
    params: params
  }).then(res => res.data)
};
export const changeSheetState = params => {
  return instance.post(`${base}/sheet/changestate`, params).then(res => res.data);
};
//---------------------------------account---------------------------
export const requestAllAccount = params => {
  return instance.get(`${base}/account/all`, {
    params: params
  }).then(res => res.data)
};
export const changeAccountState = params => {
  return instance.post(`${base}/account/changestate`, params).then(res => res.data);
};
//---------------------------------recommend--------------------------
export const refreshRecommend = () => {
  return instance.get(`${base}/recommend/refresh`).then(res => res.data)
}