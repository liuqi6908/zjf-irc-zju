<script setup lang="ts">
interface Props {
  userInfo: any
}

const { userInfo } = withDefaults(defineProps<Props>(), {
  userInfo: {},
})

const info = computed(() => {
  return [
    { label: '用户', value: userInfo['user.account'] },
    { label: '姓名', value: userInfo['user.verification.name'] },
    { label: '邮箱', value: userInfo['user.email'] },
    { label: '学校', value: userInfo['user.verification.school'] },
    { label: '学院', value: userInfo['user.verification.college'] },
    { label: '身份', value: userInfo['user.verification.identify'] },
    { label: '角色', value: userInfo['user.dataRoleName'] },
    { label: '权限', value: userInfo['user.roleName'] },
  ]
})
</script>

<template>
  <QDialog>
    <QCard p-6 min-w-100>
      <header text-lg mb-5>
        用户信息
      </header>
      <q-list bordered separator>
        <q-item v-for="(item, index) in info" :key="index" clickable>
          <q-item-section>
            <q-item-label v-text="item.label" />
            <q-item-label caption v-text="item.value" />
          </q-item-section>
        </q-item>
      </q-list>
    </QCard>
  </QDialog>
</template>
