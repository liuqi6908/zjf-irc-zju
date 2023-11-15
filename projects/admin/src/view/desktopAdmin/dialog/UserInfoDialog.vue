<script setup lang="ts">
import { hideSensitiveInfo } from 'zjf-utils'

interface Props {
  userInfo: any
}

const { userInfo } = withDefaults(defineProps<Props>(), {
  userInfo: {},
})

const info = computed(() => {
  return [
    { label: '用户', value: userInfo['user.account'] },
    { label: '邮箱', value: userInfo['user.email'] },
    { label: '姓名', value: userInfo['user.verification.name'] },
    { label: '学校', value: userInfo['user.verification.school'] },
    { label: '学院', value: userInfo['user.verification.college'] },
    { label: '学号', value: userInfo['user.verification.number'] },
    { label: '身份证', value: hideSensitiveInfo(userInfo['user.verification.idCard']) },
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
            <q-item-label v-if="item.label !== '身份'" caption v-text="item.value" />
            <q-item-label v-else caption v-text="userIdentify.find(v => v.value === item.value)?.label" />
          </q-item-section>
        </q-item>
      </q-list>
    </QCard>
  </QDialog>
</template>
