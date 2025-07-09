<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
      :class="{
        '-translate-x-full': !sidebarOpen,
        'translate-x-0': sidebarOpen,
      }"
    >
      <!-- Sidebar Header -->
      <div
        class="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700"
      >
        <div class="flex items-center">
          <POSLogo size="small" :show-brand="false" />
          <div class="ml-3">
            <h1 class="text-lg font-bold text-white">POSDev</h1>
            <p class="text-xs text-blue-100">Admin Panel</p>
          </div>
        </div>
        <button
          @click="toggleSidebar"
          class="text-white hover:text-blue-200 lg:hidden"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="sidebar-item"
            :class="{ active: $route.name === item.name }"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3" />
            {{ item.label }}
          </router-link>
        </div>
      </nav>

      <!-- User Info -->
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <div
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div
              class="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center"
            >
              <span class="text-white text-sm font-medium">
                {{ authStore.user?.full_name?.charAt(0) || "A" }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ authStore.user?.full_name || "Admin" }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ authStore.user?.role || "admin" }}
              </p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="text-gray-400 hover:text-red-500 transition-colors"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen && windowWidth < 1024"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
      @click="closeSidebar"
    ></div>

    <!-- Main Content -->
    <div
      class="transition-all duration-300 ease-in-out"
      :class="{
        'lg:pl-64': sidebarOpen || windowWidth < 1024,
        'lg:pl-0': !sidebarOpen && windowWidth >= 1024,
      }"
    >
      <!-- Top Bar -->
      <div
        class="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200"
      >
        <div
          class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8"
        >
          <div class="flex items-center">
            <button
              @click="toggleSidebar"
              class="text-gray-500 hover:text-gray-600 transition-colors"
              :title="sidebarOpen ? 'ซ่อนแถบนำทาง' : 'แสดงแถบนำทาง'"
            >
              <component
                :is="sidebarOpen ? ChevronLeftIcon : Bars3Icon"
                class="h-6 w-6"
              />
            </button>
            <h2 class="ml-4 text-lg font-semibold text-gray-900">
              {{ currentPageTitle }}
            </h2>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="text-gray-400 hover:text-gray-500 relative">
              <BellIcon class="h-6 w-6" />
              <span
                class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                3
              </span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <div
                  class="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center"
                >
                  <span class="text-white text-sm font-medium">
                    {{ authStore.user?.full_name?.charAt(0) || "A" }}
                  </span>
                </div>
                <span class="hidden md:block text-sm font-medium">
                  {{ authStore.user?.full_name || "Admin" }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import POSLogo from "@/components/POSLogo.vue";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  RectangleStackIcon,
  TableCellsIcon,
  CalendarDaysIcon,
  UsersIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const sidebarOpen = ref(false);
const windowWidth = ref(window.innerWidth);

// Load sidebar state from localStorage
const loadSidebarState = () => {
  const saved = localStorage.getItem("pos_sidebar_open");
  if (saved !== null) {
    return JSON.parse(saved);
  }
  // Default: show on desktop, hide on mobile
  return windowWidth.value >= 1024;
};

// Save sidebar state to localStorage
const saveSidebarState = (state) => {
  localStorage.setItem("pos_sidebar_open", JSON.stringify(state));
};

// Window resize handler
const handleResize = () => {
  const oldWidth = windowWidth.value;
  windowWidth.value = window.innerWidth;

  // Only auto-adjust when transitioning between mobile/desktop
  if (oldWidth < 1024 && windowWidth.value >= 1024) {
    // Mobile to desktop: show sidebar if not explicitly hidden
    const saved = localStorage.getItem("pos_sidebar_open");
    if (saved === null || JSON.parse(saved) !== false) {
      sidebarOpen.value = true;
      saveSidebarState(true);
    }
  } else if (oldWidth >= 1024 && windowWidth.value < 1024) {
    // Desktop to mobile: hide sidebar
    sidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  // Load saved sidebar state or set default based on screen size
  sidebarOpen.value = loadSidebarState();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const navigation = [
  { name: "DashboardHome", label: "แดชบอร์ด", href: "/", icon: HomeIcon },
  {
    name: "Menu",
    label: "จัดการเมนู",
    href: "/menu",
    icon: RectangleStackIcon,
  },
  {
    name: "Categories",
    label: "หมวดหมู่",
    href: "/categories",
    icon: Squares2X2Icon,
  },
  {
    name: "Tables",
    label: "จัดการโต๊ะ",
    href: "/tables",
    icon: TableCellsIcon,
  },
  {
    name: "Orders",
    label: "คำสั่งซื้อ",
    href: "/orders",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Reservations",
    label: "การจอง",
    href: "/reservations",
    icon: CalendarDaysIcon,
  },
  { name: "Staff", label: "พนักงาน", href: "/staff", icon: UsersIcon },
  { name: "Reports", label: "รายงาน", href: "/reports", icon: ChartBarIcon },
];

const currentPageTitle = computed(() => {
  // รองรับ route ที่ชื่อ 'Tables' ด้วย (ตรงกับ router)
  const currentNav = navigation.find((item) => item.name === route.name);
  return currentNav?.label || "แดชบอร์ด";
});

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
  saveSidebarState(sidebarOpen.value);
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;
}

.sidebar-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.sidebar-item.active {
  background-color: #eff6ff;
  color: #1d4ed8;
  border-right: 2px solid #1d4ed8;
}

.sidebar-item.active svg {
  color: #1d4ed8;
}
</style>
