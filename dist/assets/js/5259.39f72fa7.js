"use strict";(self["webpackChunklowcode"]=self["webpackChunklowcode"]||[]).push([[5259],{35259:function(e,t,a){a.r(t),a.d(t,{default:function(){return f}});var i=function(){var e=this,t=e._self._c;return t("el-form-item",{attrs:{label:e.formTemplate.label,prop:e.parentModelName+e.fieldConfig.start_time,"label-width":e.formTemplate.labelWidth,required:!!+e.formTemplate.required,rules:[...e.formTemplate.validateRules||[],{required:!!+e.formTemplate.required,message:e.formTemplate.label+"不能为空"}]}},[t("div",{staticClass:"date-range-container",style:{width:e.formTemplate.width||"100%",...e.formTemplate.style}},[t("el-date-picker",e._g(e._b({attrs:{type:e.formTemplate.nativeType||"datetime","value-format":e.formTemplate.valueFormat||"yyyy-MM-dd HH:mm",format:e.formTemplate.format||"yyyy-MM-dd HH:mm","prefix-icon":e.formTemplate.prefixIcon||"el-icon-date",placeholder:e.startPlaceholder||e.formTemplate.placeholder||`请选择${e.formTemplate.label||""}开始日期`,disabled:!!+e.formTemplate.disabled,size:"medium"},model:{value:e.startTime,callback:function(t){e.startTime=t},expression:"startTime"}},"el-date-picker",e.formTemplate.$props,!1),e.onEvents)),t("span",{staticStyle:{margin:"0 8px"}},[e._v("~")]),t("el-date-picker",e._g(e._b({attrs:{type:e.formTemplate.nativeType||"datetime","value-format":e.formTemplate.valueFormat||"yyyy-MM-dd HH:mm",format:e.formTemplate.format||"yyyy-MM-dd HH:mm","prefix-icon":e.formTemplate.prefixIcon||"el-icon-date",placeholder:e.endPlaceholder||e.formTemplate.placeholder||`请选择${e.formTemplate.label||""}结束日期`,disabled:!!+e.formTemplate.disabled,size:"medium"},model:{value:e.endTime,callback:function(t){e.endTime=t},expression:"endTime"}},"el-date-picker",e.formTemplate.$props,!1),e.onEvents))],1),e.formTemplate.tip?t("span",{staticClass:"tip-text"},[e._v(" "+e._s(e.formTemplate.tip))]):e._e()])},m=[];const l=window.__debug_log__,r=(...e)=>{l&&console.log("[DateRange]：",...e)};var d={props:{metadata:{type:Object,require:!0},formModel:{type:Object,default:()=>({start_time:"",end_time:""})},parentModelName:{type:String,default:""}},data(){return{insideModel:{start_time:"",end_time:""}}},computed:{formTemplate(){return this.metadata||{}},fieldConfig(){return{start_time:"start_time",end_time:"end_time",...this.formTemplate.fieldConfig}},startTime:{get(){return this.formTemplate.value?this.formModel[this.fieldConfig.start_time]:this.insideModel.start_time},set(e){this.formTemplate.value&&(this.formModel[this.fieldConfig.start_time]=e),this.insideModel.start_time=e}},endTime:{get(){return this.formTemplate.value?this.formModel[this.fieldConfig.end_time]:this.insideModel.end_time},set(e){this.formTemplate.value&&(this.formModel[this.fieldConfig.end_time]=e),this.insideModel.end_time=e}},onEvents(){const e={};return this.metadata?._id&&(e.change=this.handleEvent.bind(this,"change",this.metadata._id),this.metadata?.$on?.forEach((t=>{e[t]=this.handleEvent.bind(this,t,this.metadata._id)}))),e},startPlaceholder(){return this.formTemplate?.$props?.startPlaceholder},endPlaceholder(){return this.formTemplate?.$props?.endPlaceholder}},watch:{metadata:{handler:function(e){this.parseMetadata()},immediate:!0},startTime(e){this.metadata._id&&this.handleEvent("dateChange",this.metadata._id,{[this.fieldConfig.start_time]:e,[this.fieldConfig.end_time]:this.endTime})},endTime(e){this.metadata._id&&this.handleEvent("dateChange",this.metadata._id,{[this.fieldConfig.start_time]:this.startTime,[this.fieldConfig.end_time]:e})}},methods:{async parseMetadata(){this.validateMetadata()&&r("validateMetadata() return true")},validateMetadata(){return!(!this.metadata||"object"!==typeof this.metadata)},handleEvent(e,t,a){this.$emit("event",e,t,a)}}},o=d,s=a(9512),n=(0,s.Z)(o,i,m,!1,null,"ebdeeee6",null),f=n.exports}}]);