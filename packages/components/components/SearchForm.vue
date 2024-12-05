<script setup lang="ts">
import { FormOption, SearchOption } from '@packages/types'
import { Input, TreeSelect, InputNumber, Select, Button } from '@packages/components'
import { ref, unref, computed } from 'vue'
const props = defineProps<{
  searchOptions: FormOption[] | SearchOption[]
  handleSearch: (params: Record<string, any>) => void
}>()
const searchParams = ref<Record<string, any>>({})
const showMore = ref<boolean>(false)

const searchFormOptions = computed(() => props.searchOptions.filter((item) => item.search))

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
      v-for="(searchItem, index) in searchFormOptions"
      :key="searchItem.field"
    >
      <div
        class="w-1/3 flex items-center my-2"
        v-if="searchItem.search && (showMore || index < 2)"
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

    <div
      class="w-1/3 flex px-5 my-2"
      :class="{
        'flex-grow justify-center': showMore
      }"
    >
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
      <a
        class="ml-2 flex items-center ml-4 text-sm cursor-pointer"
        @click="showMore = !showMore"
        v-if="searchFormOptions.length > 2"
      >
        <div
          v-if="showMore"
          class="i-tabler:chevron-up w-5 h-5 text-gray-6"
        ></div>
        <div
          v-else
          class="i-tabler:chevron-down w-5 h-5 text-gray-6"
        ></div>
        {{ showMore ? '收起更多' : '展开更多' }}
      </a>
    </div>
  </div>
</template>
