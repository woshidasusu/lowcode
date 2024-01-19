// 业务表单组件都放到 business 目录下维护
// 其余均为基础表单组件，可通用
export default {
  checkboxGroup: () => import('./common/form/checkboxGroup/index'),
  container: () => import('./common/layout/container/index'),
  dynamicContainer: () => import('./common/layout/dynamicContainer/index'),
  dataContainer: () => import('./common/layout/dataContainer/index'),
  formContainer: () => import('./common/layout/formContainer/index'),
  tableContainer: () => import('./common/layout/tableContainer/index'),
  datePicker: () => import('./common/form/datePicker/index'),
  dateRange: () => import('./common/form/dateRange/index'),
  hidden: () => import('./common/form/hidden/index'),
  input: () => import('./common/form/input/index'),
  inputNumber: () => import('./common/form/inputNumber/index'),
  // fileList: () => import('./common/form/fileList/index'),
  // audioList: () => import('./common/form/audioList/index'),
  dynamicInput: () => import('./common/form/dynamicInput/index'),
  radioGroup: () => import('./common/form/radioGroup/index'),
  select: () => import('./common/form/select/index'),
  objectSelect: () => import('./common/form/objectSelect/index'),
  search: () => import('./common/form/search/index'),
  switch: () => import('./common/form/switch/index'),
  text: () => import('./common/form/text/index'),
  textarea: () => import('./common/form/textarea/index'),
  title: () => import('./common/ui/title/index'),
  element: () => import('./common/ui/element/index'),
  // searchBar: () => import('./common/layout/searchBar/index'),
  slot: () => import('./common/ui/slot/index'),
  // adaptiveRadioBtns: () => import('./common/ui/adaptiveRadioBtns/index'),
  tabs: () => import('./common/layout/tabs/index'),
  // chinaArea: () => import('./common/form/chinaArea/index'),
  // imageUploader: () => import('./common/form/imageUploader/index'),
  // OSSUploader: () => import('./common/form/OSSUploader/index')
};