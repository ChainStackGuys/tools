export default [
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/homework',
    name: 'homework',
    icon: 'smile',
    component: './Token',
  },
  {
    path: '/issue',
    name: 'issue',
    icon: 'crown',
    component: './Issue',
  },
  {
    name: 'airdrop',
    icon: 'table',
    path: '/airdrop',
    component: './Airdrop',
  },
  {
    name: 'rush',
    icon: 'table',
    path: '/rush',
    routes: [
      // {
      //   // path 支持为一个 url，必须要以 http 开头
      //   path: 'https://pro.ant.design/docs/getting-started-cn',
      //   target: '_blank', // 点击新窗口打开
      //   name: 'docs',
      // },
      {
        path: 'pancake',
        name: 'pancake',
        icon: 'smile',
        component: './rush/Pancake',
      },
      {
        component: './404',
      },
    ],
  },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
