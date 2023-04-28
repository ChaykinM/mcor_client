import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { 
    path: '/', 
    redirect: '/account/mechanisms' 
  }, 
  { 
    path: '/account', 
    redirect: '/account/mechanisms' 
  }, 
  /* Авторизация */
  {
    path: '/auth/login',
    name: 'login',
    meta: { requiresAuth: false, title: 'Авторизация' },
    component: () => import(/* webpackChunkName: "login" */ '../views/auth/LoginView.vue')
  },
  {
    path: '/auth/register',
    name: 'register',
    meta: { requiresAuth: false, title: 'Регистрация' },
    component: () => import(/* webpackChunkName: "register" */ '../views/auth/RegisterView.vue')
  },

  /* Аккаунт пользователя */
  {
    path: "/account/mechanisms",
    name: "mechanisms",
    meta: { requiresAuth: true, title: 'Механизмы' },
    component: () =>
      import(
        /* webpackChunkName: "mechanisms" */ "../views/account/MechanismsView.vue"
      ),
  },
  {
    path: "/account/new_trajectory",
    name: "new_trajectory",
    meta: { requiresAuth: true, title: 'Новая траектория' },
    component: () =>
      import(
        /* webpackChunkName: "mechanisms" */ "../views/account/NewTrajectoryView.vue"
      ),
  },
  {
    path: "/account/custom_params",
    name: "custom_params",
    meta: { requiresAuth: true, title: 'Дополнительные наблюдения' },
    component: () =>
      import(
        /* webpackChunkName: "custom_params" */ "../views/account/CustomParamsView.vue"
      ),
  },
  {
    path: "/account/components",
    name: "components",
    meta: { requiresAuth: true, title: 'Электронно-компонентная база' },
    component: () =>
      import(
        /* webpackChunkName: "components" */ "../views/account/ComponentBaseView.vue"
      ),
  },
  {
    path: "/account/params",
    name: "params",
    meta: { requiresAuth: true, title: 'Параметры для контроля' },
    component: () =>
      import(
        /* webpackChunkName: "params" */ "../views/account/ParamsControlView.vue"
      ),
  },
  {
    path: "/account/history",
    name: "history",
    meta: { requiresAuth: true, title: 'История наблюдений' },
    component: () =>
      import(
        /* webpackChunkName: "history" */ "../views/account/HistoryParamsView.vue"
      ),
  },
  {
    path: "/account/users",
    name: "users",
    meta: { requiresAuth: true, title: 'Пользователи' },
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/account/UsersView.vue"),
  },
  {
    path: "/404",
    name: "pageNotFound",
    component: () =>
      import(
        /* webpackChunkName: "page-not-found" */ "../views/PageNotFound.vue"
      ),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const isAuthenticated = localStorage.getItem("token") !== null ? true : false;

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) next({ name: "login" });
  else if (to.name === "login" && isAuthenticated)
    next({
      name: "mechanisms",
    }); // каждый запрос к серверу должен сопровождаться токеном, если токен не валидный сервер должен возвращять статус "Не авторизирован", то удалять токен из стора и localStorage
  else next();
});

router.afterEach((to) => {
  document.title = to.meta.title || "MCOR System";
});

export default router;
