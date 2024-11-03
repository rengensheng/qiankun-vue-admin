<script setup lang="ts">
import { FormOption, SearchOption } from '@packages/types'
import { Input, TreeSelect, InputNumber, Select, Button } from '@packages/components'
import { ref, unref } from 'vue'
const props = defineProps<{
  searchOptions: FormOption[] | SearchOption[]
  handleSearch: (params: Record<string, any>) => void
}>()
const searchParams = ref<Record<string, any>>({})
function handleClickSearch() {
  const searchData = { ...unref(searchParams) }
  props.searchOptions.forEach((field) => {
    if (!searchData[field.field]) {
      delete searchData[field.field]
    } else {
      if (field.type === 'input') {
        searchData[field.field] = `*${searchData[field.field]?.trim()}*`
      } else if (field.type === 'select') {
        searchData[field.field] = searchData[field.field]?.join(',')
      }
    }
  })
  props.handleSearch(searchData)
}
function handleReset() {
  searchParams.value = {}
  props.handleSearch({})
}
</script>

<template>
  <div class="flex flex-wrap bg-gray-50 py-3 px-5 rounded-md">
    <template
      v-for="searchItem in searchOptions"
      :key="searchItem.field"
    >
      <div
        class="w-1/3 flex items-center"
        v-if="searchItem.search"
      >
        <div class="w-32 text-right">{{ searchItem.name }}：</div>
        <div class="w-full flex-grow">
          <Input
            :type="searchItem.type === 'password' ? 'password' : 'text'"
            :allow-clear="true"
            v-model:value="searchParams[searchItem.field]"
            :placeholder="searchItem.placeholder || '请输入'"
            v-if="searchItem.type === 'input' || searchItem.type === 'password'"
          />
          <Input.TextArea
            :allow-clear="true"
            v-model:value="searchParams[searchItem.field]"
            :placeholder="searchItem.placeholder || '请输入'"
            v-else-if="searchItem.type === 'textarea'"
          />
          <Select
            style="width: 100%"
            :allow-clear="true"
            v-else-if="searchItem.type === 'select' || searchItem.type === 'radioButton'"
            v-model:value="searchParams[searchItem.field]"
            :placeholder="searchItem.placeholder || '请选择'"
            :options="searchItem.options"
          />
          <InputNumber
            style="width: 100%"
            :allow-clear="true"
            v-else-if="searchItem.type === 'inputNumber'"
            v-model:value="searchParams[searchItem.field]"
            :placeholder="searchItem.placeholder || '请输入'"
          />
          <TreeSelect
            :allow-clear="true"
            v-else-if="searchItem.type === 'treeSelect'"
            v-model:value="searchParams[searchItem.field]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :placeholder="searchItem.placeholder || '请选择'"
            tree-default-expand-all
            :tree-data="searchItem.options || []"
            tree-node-filter-prop="label"
          >
          </TreeSelect>
        </div>
      </div>
    </template>

    <div class="w-1/3 flex px-5">
      <Button
        class="mr-2 flex items-center"
        type="primary"
        @click="handleClickSearch"
      >
        <div class="i-tabler:search w-1em h-1em mr-2"></div>
        搜索</Button
      >
      <Button
        @click="handleReset"
        class="flex items-center"
      >
        <div class="i-tabler:zoom-reset w-1em h-1em mr-2"></div>
        重置</Button
      >
    </div>
  </div>
</template>
