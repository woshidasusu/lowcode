"use strict";(self["webpackChunklowcode"]=self["webpackChunklowcode"]||[]).push([[8717],{48717:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var l=function(){var e=this,t=e._self._c;return t("el-form-item",{attrs:{label:e.formTemplate.label,prop:e.parentModelName+e.formTemplate.name,"label-width":e.formTemplate.labelWidth,required:!!+e.formTemplate.required,rules:[...e.formTemplate.validateRules||[],{required:!!+e.formTemplate.required,message:e.formTemplate.label+"不能为空"}]}},[t("el-input",e._g(e._b({style:{width:e.formTemplate.width||"100%"},attrs:{type:e.formTemplate.nativeType,maxlength:e.formTemplate.maxlength,"show-word-limit":!!+e.formTemplate.showWordLimit,placeholder:e.formTemplate.placeholder||`请输入${e.formTemplate.label||""}`,disabled:!!+e.formTemplate.disabled,size:"medium"},model:{value:e.model,callback:function(t){e.model=t},expression:"model"}},"el-input",e.formTemplate.$props,!1),e.onEvents))],1)},m=[];const r=window.__debug_log__,d=(...e)=>{r&&console.log("[input]：",...e)};var i={props:{metadata:{type:Object,require:!0},formModel:{type:Object,default:()=>({})},parentModelName:{type:String,default:""}},data(){return{insideModel:""}},computed:{formTemplate(){return this.metadata||{}},model:{get(){return this.formTemplate.name?this.formModel[this.formTemplate.name]:this.insideModel},set(e){this.formTemplate.name&&(this.formModel[this.formTemplate.name]=e),this.insideModel=e}},onEvents(){const e={};return this.metadata?._id&&(e.change=this.handleEvent.bind(this,"change",this.metadata._id),this.metadata?.$on?.forEach((t=>{e[t]=this.handleEvent.bind(this,t,this.metadata._id)}))),e}},watch:{metadata:{handler:function(e){this.parseMetadata()},immediate:!0}},methods:{async parseMetadata(){this.validateMetadata()&&d("validateMetadata() return true")},validateMetadata(){return!(!this.metadata||"object"!==typeof this.metadata)},handleEvent(e,t,a){this.$emit("event",e,t,a)}}},o=i,n=a(9512),s=(0,n.Z)(o,l,m,!1,null,"1a4d27f6",null),p=s.exports}}]);