"use strict";(self["webpackChunklowcode"]=self["webpackChunklowcode"]||[]).push([[8793],{78793:function(e,t,a){a.r(t),a.d(t,{default:function(){return c}});var l=function(){var e=this,t=e._self._c;return t("el-form-item",{attrs:{label:e.formTemplate.label,prop:e.parentModelName+e.formTemplate.name,"label-width":e.formTemplate.labelWidth,required:!!+e.formTemplate.required,rules:[...e.formTemplate.validateRules||[],{required:!!+e.formTemplate.required,message:e.formTemplate.label+"不能为空"}]}},[t("el-select",e._g(e._b({style:{width:e.formTemplate.width||"100%"},attrs:{placeholder:e.formTemplate.placeholder||`请选择${e.formTemplate.label||""}`,multiple:!!+e.formTemplate.multiple,disabled:!!+e.formTemplate.disabled,clearable:!!+e.formTemplate.clearable,filterable:!!+e.formTemplate.filterable,size:"medium"},model:{value:e.model,callback:function(t){e.model=t},expression:"model"}},"el-select",e.formTemplate.$props,!1),e.onEvents),e._l(e.options,(function(a,l){return t("el-option",{key:l,attrs:{label:a[e.fieldConfig.key],value:a[e.fieldConfig.value],disabled:!!+a.disabled}})})),1)],1)},o=[];const i=window.__debug_log__,r=(...e)=>{i&&console.log("[select]：",...e)};var s={inject:["getStore"],props:{metadata:{type:Object,require:!0},formModel:{type:Object,default:()=>({})},parentModelName:{type:String,default:""}},data(){return{options:[],defaultFieldConfig:{key:"label",value:"value"},insideModel:""}},computed:{formTemplate(){return this.metadata||{}},fieldConfig(){return this.metadata&&this.metadata.dataSource&&this.metadata.dataSource.fieldConfig||this.defaultFieldConfig},model:{get(){return this.formTemplate.name?this.formModel[this.formTemplate.name]:this.insideModel},set(e){this.formTemplate.name&&(this.formModel[this.formTemplate.name]=e),this.insideModel=e}},coreProcessor(){return this.getStore()?.state()?.coreProcessor},onEvents(){const e={};return this.metadata?._id&&(e.change=this.handleEvent.bind(this,"change",this.metadata._id),this.metadata?.$on?.forEach((t=>{e[t]=this.handleEvent.bind(this,t,this.metadata._id)}))),e}},watch:{metadata:{handler:function(e){this.parseMetadata()},immediate:!0},"metadata.dataSource":{handler:async function(e,t){const a=await this.coreProcessor.parseDataSource(e);this.options=a||[]}}},methods:{async parseMetadata(){if(!this.validateMetadata())return;r("validateMetadata() return true");const{dataSource:e}=this.metadata;this.options=await this.coreProcessor.parseDataSource(e),this.options=this.options||[];let t=!!+this.metadata.isSelectFirst;null!=e.isSelectFirst&&(t=!!+e.isSelectFirst),t&&this.options.length&&!this.model&&(this.model=this.options[0][this.fieldConfig.value])},validateMetadata(){if(!this.metadata||"object"!==typeof this.metadata)return!1;const{dataSource:e}=this.metadata;return!(!e||"object"!==typeof e)||(console.error("select 表单组件的 dataSource 字段不能为空"),!1)},handleEvent(e,t,a){this.$emit("event",e,t,a)}}},d=s,n=a(9512),m=(0,n.Z)(d,l,o,!1,null,"c9c4f974",null),c=m.exports}}]);