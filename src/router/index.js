import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'DashboardHome',
          component: () => import('@/views/dashboard/DashboardView.vue')
        },
        {
          path: '/menu',
          name: 'Menu',
          component: () => import('@/views/menu/MenuView.vue')
        },
        {
          path: '/menu/create',
          name: 'MenuCreate',
          component: () => import('@/views/menu/MenuFormView.vue')
        },
        {
          path: '/menu/:id/edit',
          name: 'MenuEdit',
          component: () => import('@/views/menu/MenuFormView.vue')
        },
        {
          path: '/categories',
          name: 'Categories',
          component: () => import('@/views/categories/CategoriesView.vue')
        },
        {
          path: '/tables',
          name: 'Tables',
          component: () => import('@/views/tables/TablesView.vue')
        },
        {
          path: '/orders',
          name: 'Orders',
          component: () => import('@/views/orders/OrdersView.vue')
        },
        {
          path: '/reservations',
          name: 'Reservations',
          component: () => import('@/views/reservations/ReservationsView.vue')
        },
        {
          path: '/staff',
          name: 'Staff',
          component: () => import('@/views/staff/StaffView.vue')
        },
        {
          path: '/reports',
          name: 'Reports',
          component: () => import('@/views/reports/ReportsView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
