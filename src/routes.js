import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/Music/Table.vue'
import Form from './views/Music/Form.vue'
import Songs from './views/Music/Song.vue'
import Albums from './views/Music/Albums.vue'
import Sheets from './views/Music/Sheets.vue'
import Cates from './views/Music/Cates.vue'
import Recommend from './views/System/Recommend.vue'
import UpdateBar from './views/System/UpdateBar.vue'
import SystemUser from './views/SysUser.vue'
import User from './views/User/Normal.vue'
import Singer from './views/User/Singer.vue'
import echarts from './views/charts/echarts.vue'

let routes = [{
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true, //只有一个节点
    children: [{
      path: '/main',
      component: Main,
      name: '主页'
    }]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true, //只有一个节点
    children: [{
      path: '/sysuser',
      component: SystemUser,
      name: '系统用户'
    }]
  },
  {
    path: '/',
    component: Home,
    name: '用户管理',
    iconCls: 'fa fa-address-card',
    // leaf: true, //只有一个节点
    children: [{
      path: '/normaluser',
      component: User,
      name: '普通用户'
    }, {
      path: '/singer',
      component: Singer,
      name: '入驻歌手'
    }]
  },
  {
    path: '/',
    component: Home,
    name: '音乐管理',
    iconCls: 'el-icon-message', //图标样式class
    children: [
      // { path: '/main', component: Main, name: '主页', hidden: false },
      // {
      //   path: '/table',
      //   component: Table,
      //   name: '歌曲管理'
      // },
      // {
      //   path: '/form',
      //   component: Form,
      //   name: '歌单管理' //专辑
      // },
      {
        path: '/cates',
        component: Cates,
        name: '类型管理'
      },
      {
        path: '/songs',
        component: Songs,
        name: '歌曲管理'
      }, {
        path: '/albums',
        component: Albums,
        name: '专辑管理'
      },
      {
        path: '/sheets',
        component: Sheets,
        name: '歌单管理'
      },
    ]
  },
  {
    path: '/',
    component: Home,
    name: '系统管理',
    iconCls: 'fa fa-id-card-o',
    children: [{
        path: '/page4',
        component: UpdateBar,
        name: 'Bar管理'
      },
      {
        path: '/page5',
        component: Recommend,
        name: '推荐管理'
      }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {
      path: '/404'
    }
  }
];

export default routes;