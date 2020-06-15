const routes = [{
  path: '/',
  component: () => import('layouts/MainHeader.vue'),
  children: [{
    path: '/',
    name: 'join',
    component: () => import('pages/Join.vue')
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('pages/SignIn.vue')
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('pages/QuizEditor.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('pages/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/quiz/:chosenTemplateHash?',
    name: 'quiz',
    component: () => import('pages/QuizEditor.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('pages/Profile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chart',
    name: 'chart',
    component: () => import('pages/ChartPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('pages/LeaderboardPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('pages/Index.vue')
  },
  {
    path: '/waitingroom/:inviteCode',
    name: 'waitingroom',
    props: true,
    component: () => import('pages/WaitingRoom.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/waitingroom/:inviteCode',
    name: 'guestwaitingroom',
    props: true,
    component: () => import('pages/WaitingRoom.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/completequiz',
    name: 'completequiz',
    component: () => import('pages/CompletionPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/statisticoverview/:chosenTemplateHash?/:chosenFormHash?',
    name: 'statisticoverview',
    component: () => import('pages/StatisticOverview.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('pages/Logout.vue'),
    meta: {
      requiresAuth: true
    }
  }


  ]
}]


// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}


export default routes
