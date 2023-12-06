<script setup lang="ts">
const $router = useRouter()
const $route = useRoute()
const { isLogin, rolePermission, useLogout, useGetProfile } = useUser()
const drawer = ref(false)

const link = computed(() => $route.name as string)

const navs = computed(() => {
  return navList.filter(v => rolePermission.value?.includes(v.name))
})

onMounted(async () => {
  if (isLogin.value) {
    await useGetProfile()
    if (!navs.value?.length)
      $router.replace({ path: 'denied' })
  }
  else {
    $router.replace({ path: 'auth/login' })
  }
})

const showMenu = computed(() => {
  return $route.name !== 'denied'
})

$router.beforeEach((to, _, next) => {
  if (!navs.value.length)
    next('denied')

  const { name } = to
  if (navs.value.find(v => v.id === name))
    next()
  else
    next(navs.value[0].id)
})
</script>

<template>
  <main
    full
    text="center"
  >
    <q-layout container view="hHh Lpr lff">
      <q-header bg-grey-1>
        <q-toolbar flex="~ row justify-between">
          <div mx-8 my-4 flex="~ row">
            <span text-xl font-600 text-grey-8>
              管理后台
            </span>
          </div>
          <q-btn
            label="退出登录"
            color="primary"
            @click="useLogout()"
          >
            <div ml-2 i-mingcute:exit-fill />
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-if="showMenu"
        style="border-right: 1px solid var(--grey-3, #D4DDEA);"
        flex bg-grey-2 flex-col show-if-above
        :width="260"
        :mini-width="80"
        :mini="drawer"
        :breakpoint="500"
      >
        <q-toolbar p-0 q-none flex="~ items-center justify-end">
          <div
            class="nav-Br my-1"
            flex-center bg-grey-1 w-6 cursor-pointer h-8
            @click="drawer = !drawer"
          >
            <q-icon :name="`fas fa-chevron-${drawer ? 'right' : 'left'}`" size="0.25rem" text-grey-5 />
          </div>
        </q-toolbar>
        <div class="col-grow q-px-md" flex flex-col>
          <!-- menu -->
          <q-list>
            <RouterLink
              v-for="item in navs"
              :key="item.id"
              replace
              :to="`/${item.id}`"
            >
              <NavItem
                :id="item.id"
                v-ripple
                :name="item.name"
                :icon="item.icon"
                :click-id="link"
              />
            </RouterLink>
          </q-list>
          <div class="col-grow" />
        </div>
      </q-drawer>

      <q-page-container bg-grey-2>
        <q-page>
          <RouterView />
        </q-page>
      </q-page-container>
    </q-layout>
  </main>
</template>
