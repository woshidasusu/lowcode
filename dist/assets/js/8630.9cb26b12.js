"use strict";(self["webpackChunklowcode"]=self["webpackChunklowcode"]||[]).push([[8630],{38630:function(e,t,a){a.r(t),a.d(t,{default:function(){return l}});var n=function(){var e=this,t=e._self._c;return t(e.metadata.type,e._g(e._b({ref:e.metadata._id,tag:"component",model:{value:e.model,callback:function(t){e.model=t},expression:"model"}},"component",e.metadata.$props,!1),e.onEvents),[e._l(e.metadata.components,(function(a,n){return[+a.hidden?e._e():t("element-ui",{key:"c"+n,attrs:{metadata:a,"form-model":e.insideFormModel},on:{event:e.handleEvent}})]}))],2)},o=[],m={name:"ElementUi",inject:["getStore"],props:{metadata:{type:Object,require:!0},formModel:{type:[Object,Array],default:()=>({})}},data(){return{insideModel:""}},computed:{formTemplate(){return this.metadata||{}},model:{get(){return this.formTemplate.name?this.formModel[this.formTemplate.name]:this.insideModel},set(e){this.formTemplate.name&&(this.formModel[this.formTemplate.name]=e),this.insideModel=e}},insideFormModel(){return this.formTemplate.name?this.formModel[this.formTemplate.name]:this.formModel},onEvents(){const e={};return this.metadata?._id&&this.metadata?.$on?.forEach((t=>{e[t]=this.handleEvent.bind(this,t,this.metadata._id)})),e}},watch:{},methods:{handleEvent(e,t,a){this.$emit("event",e,t,a)}}},d=m,i=a(9512),r=(0,i.Z)(d,n,o,!1,null,"e108334c",null),l=r.exports}}]);