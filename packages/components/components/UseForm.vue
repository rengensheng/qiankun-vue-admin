<script setup lang="ts">
import {
  Form,
  FormItem,
  Input,
  RadioGroup,
  RadioButton,
  TreeSelect,
  InputNumber,
  Slider,
  CheckboxGroup,
  DatePicker,
  RangePicker,
  TimePicker,
  Select
} from '@packages/components'
import type { FormOption } from '@packages/types'
import { ref, VNodeRef, watchEffect } from 'vue'

const formRef = ref<VNodeRef>()

const props = defineProps<{
  editRow: Record<string, any>
  formOptions: FormOption[]
  register: (form: any) => void
}>()

function getFormRule(formOption: FormOption) {
  if (formOption.rules) {
    return formOption.rules
  }
  if (formOption.required) {
    if (formOption.type === 'select' || formOption.type === 'treeSelect') {
      return [{ required: true, message: `请选择${formOption.name}!` }]
    }
    return [{ required: true, message: `请输入${formOption.name}!` }]
  }
}

watchEffect(() => {
  props.register(formRef)
})
</script>

<template>
  <div class="user-form">
    <Form
      ref="formRef"
      :model="editRow"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
    >
      <template
        v-for="formItem in formOptions"
        :key="formItem.field"
      >
        <FormItem
          :label="formItem.name"
          :name="formItem.field"
          :rules="getFormRule(formItem)"
        >
          <Input
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-model:value="editRow[formItem.field]"
            :placeholder="formItem.placeholder || '请输入'"
            v-if="formItem.type === 'input'"
          />
          <Input.TextArea
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-model:value="editRow[formItem.field]"
            :placeholder="formItem.placeholder || '请输入'"
            v-else-if="formItem.type === 'textarea'"
          />
          <Select
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'select'"
            v-model:value="editRow[formItem.field]"
            :placeholder="formItem.placeholder || '请选择'"
            :options="formItem.options"
          />
          <InputNumber
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'inputNumber'"
            v-model:value="editRow[formItem.field]"
            :placeholder="formItem.placeholder || '请输入'"
          />
          <RadioGroup
            v-model:value="editRow[formItem.field]"
            button-style="solid"
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'radioButton'"
          >
            <RadioButton
              v-for="radioItem in formItem.options"
              :key="radioItem.value"
              :value="radioItem.value"
              >{{ radioItem.label }}</RadioButton
            >
          </RadioGroup>
          <TreeSelect
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'treeSelect'"
            v-model:value="editRow[formItem.field]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :placeholder="formItem.placeholder || '请选择'"
            tree-default-expand-all
            :tree-data="formItem.options || []"
            tree-node-filter-prop="label"
          >
          </TreeSelect>
          <RadioGroup
            v-model:value="editRow[formItem.field]"
            button-style="solid"
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'radio'"
            :options="formItem.options"
          />
          <CheckboxGroup
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'checkbox'"
            v-model:value="editRow[formItem.field]"
            :placeholder="formItem.placeholder || '请选择'"
            :options="formItem.options"
          />
          <DatePicker
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'date'"
            v-model:value="editRow[formItem.field]"
            :placeholder="formItem.placeholder || '请选择日期'"
          />
          <RangePicker
            v-show="!formItem.hidden"
            :show-time="formItem.type === 'dateTimeRange' ? { format: 'HH:mm:ss' } : false"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'dateRange' || formItem.type === 'dateTimeRange'"
            v-model:value="editRow[formItem.field]"
            :placeholder="formItem.multiPlaceholder || ['开始日期', '结束日期']"
          />
          <TimePicker
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'time'"
            v-model:value="editRow[formItem.field]"
            :placeholder="formItem.placeholder || '请选择时间'"
          />
          <Slider
            v-show="!formItem.hidden"
            :disabled="formItem.disabled"
            :readonly="formItem.readonly"
            :allow-clear="formItem.clearable"
            v-else-if="formItem.type === 'slider'"
            v-model:value="editRow[formItem.field]"
            :options="formItem.options"
          />
        </FormItem>
      </template>
    </Form>
  </div>
</template>
