<template>
  <div>
    <template v-if="customerComponents.includes(data.type)">
      <d-container v-if="data.type === 'container'" :data="data"></d-container>
      <d-dynamic-container v-else-if="data.type === 'dynamicContainer'" :data="data"></d-dynamic-container>
      <d-data-container v-else-if="['dataContainer', 'kf_task_v2'].includes(data.type)" :data="data"></d-data-container>
      <d-form-container v-else-if="['formContainer'].includes(data.type)" :data="data"></d-form-container>
      <d-search-bar v-else-if="['searchBar'].includes(data.type)" :data="data"></d-search-bar>
      <d-table-container v-else-if="['tableContainer'].includes(data.type)" :data="data"></d-table-container>
    </template>
    <el-form v-else class="drag-layout-container">
      <el-form-item
        v-if="formUiTypes.includes(data.type)"
        :label="data.label"
        :required="!!+data.required"
        :label-width="data.labelWidth || metadata.labelWidth"
      >
        <component
          :is="componentMap[data.type]"
          v-model="value"
          :data="data"
          :type="data.type === 'textarea' ? 'textarea' : ''"
          :rows="+data.rows || 2"
          :maxlength="+data.maxlength"
          :show-word-limit="!!+data.showWordLimit"
          :style="{ width: data.width || '100%' }"
          :placeholder="data.placeholder || `请输入${data.label || ''}`"
          :disabled="!!+data.disabled"
          :filteable="true"
        ></component>
      </el-form-item>
      <div v-else-if="data.type === 'hidden'">&lt;input type="hidden" name="{{ data.name }}" &gt;</div>
      <component :is="ALL_COMPONENTS[data.type]" v-else-if="commonUis.includes(data.type)" :metadata="data"></component>
      <div v-else>
        <span>type【{{ data.type }}】，id【{{ data._id }}】</span>
        <span v-if="data.label">， label【{{ data.label }}】</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import ALL_COMPONENTS from '@src/configForm/components';
import dynamicStore from '@src/store/dynamic-store';
import DCheckboxGroup from './dCheckboxGroup.vue';
import DText from './dText.vue';
import DDynamicInput from './dDynamicInput.vue';
import DRadioGroup from './dRadioGroup.vue';
import DSearch from './dSearch.vue';
import DContainer from './dContainer.vue';
import DDynamicContainer from './dDynamicContainer.vue';
import DDataContainer from './dDataContainer.vue';
import DFormContainer from './dFormContainer.vue';
import DTableContainer from './dTableContainer.vue';
import DSearchBar from './dSearchBar.vue';
export default {
  components: {
    DCheckboxGroup,
    DText,
    DDynamicInput,
    DRadioGroup,
    DSearch,
    DContainer,
    DDataContainer,
    DSearchBar,
    DFormContainer,
    DDynamicContainer,
    DTableContainer
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ALL_COMPONENTS: ALL_COMPONENTS,
      value: '',
      commonUis: ['title'],
      componentMap: {
        input: 'el-input',
        switch: 'el-switch',
        textarea: 'el-input',
        inputNumber: 'el-input-number',
        datePicker: 'el-date-picker',
        dateRange: 'el-date-picker',
        chinaArea: 'el-select',
        search: 'd-search',
        select: 'el-select',
        objectSelect: 'el-select',
        text: 'd-text',
        checkboxGroup: 'd-checkbox-group',
        dynamicInput: 'd-dynamic-input',
        radioGroup: 'd-radio-group',
        kf_house_selector: 'el-input',
        kf_user_selector: 'el-input',
        kf_requester: 'el-input',
        kf_requester_mobile: 'el-input',
        kf_problem_class: 'el-select',
        kf_problem_desc: 'el-checkbox-group',
        kf_accept_operator: 'el-select',
        kf_associate_task: 'el-select'
      },
      customerComponents: [
        'container',
        'dynamicContainer',
        'dataContainer',
        'formContainer',
        'searchBar',
        'kf_task_v2',
        'tableContainer'
      ]
    };
  },
  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed(['edit.metadata']),
    formUiTypes() {
      return Object.keys(this.componentMap);
    }
  },
  watch: {},
  async mounted() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.drag-layout-container {
  pointer-events: none;
}
</style>
