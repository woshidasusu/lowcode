"use strict";(self["webpackChunklowcode"]=self["webpackChunklowcode"]||[]).push([[2958],{62958:function(e,t,a){a.r(t),a.d(t,{default:function(){return h}});var l=function(){var e=this,t=e._self._c;return t("el-form-item",{attrs:{label:e.formTemplate.label,prop:e.parentModelName+e.formTemplate.name,"label-width":e.formTemplate.labelWidth,required:!!+e.formTemplate.required,rules:e.formTemplate.validateRules}},[t("el-switch",e._g({attrs:{"active-value":e.formTemplate.activeValue,"inactive-value":e.formTemplate.inactiveValue,disabled:!!+e.formTemplate.disabled,"double-confirm":!!+e.formTemplate.doubleConfirm},model:{value:e.model,callback:function(t){e.model=t},expression:"model"}},e.onEvents))],1)},i=[];const d=window.__debug_log__,o=(...e)=>{d&&console.log("[switch]：",...e)};var m={components:{},props:{metadata:{type:Object,require:!0},formModel:{type:Object,default:()=>({})},parentModelName:{type:String,default:""}},data(){return{insideModel:0}},computed:{formTemplate(){return this.metadata||{}},model:{get(){return this.formTemplate.name?this.formModel[this.formTemplate.name]:this.insideModel},set(e){this.formTemplate.name&&(this.formModel[this.formTemplate.name]=e),this.insideModel=e}},onEvents(){const e={};return this.metadata?._id&&(e.change=this.handleEvent.bind(this,"change",this.metadata._id),this.metadata?.$on?.forEach((t=>{e[t]=this.handleEvent.bind(this,t,this.metadata._id)}))),e}},watch:{metadata:{handler:function(e){this.parseMetadata()},immediate:!0}},methods:{parseMetadata(){this.validateMetadata()&&o("validateMetadata() return true")},validateMetadata(){return!(!this.metadata||"object"!==typeof this.metadata)},handleEvent(e,t,a){this.$emit("event",e,t,a)}}},r=m,n=a(9512),s=(0,n.Z)(r,l,i,!1,null,"6a64e43a",null),h=s.exports}}]);