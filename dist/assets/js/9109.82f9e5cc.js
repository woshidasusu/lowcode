"use strict";(self["webpackChunklowcode"]=self["webpackChunklowcode"]||[]).push([[9109],{39109:function(e,t,a){a.r(t),a.d(t,{default:function(){return h}});var l=function(){var e=this,t=e._self._c;return t("div",{staticClass:"layout-container"},[t("div",{staticClass:"title"},[e._v("页面配置化平台")]),t("el-tabs",{model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},[t("el-tab-pane",{attrs:{label:"项目里配置化的页面列表",name:"project"}},[t("div",{staticStyle:{display:"flex"}},[t("div",[t("el-input",{attrs:{label:"name",value:"id",placeholder:"code/name/模块",size:"medium"},model:{value:e.searchParams.codeName,callback:function(t){e.$set(e.searchParams,"codeName",t)},expression:"searchParams.codeName"}})],1),t("div",{staticStyle:{"margin-left":"auto","align-self":"center"}},["customer"===e.activeTab?t("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.goEdit(null,"formPage")}}},[e._v(" 新增表单页 ")]):e._e(),"customer"===e.activeTab?t("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.goEdit(null,"listPage")}}},[e._v(" 新增列表页 ")]):e._e()],1)]),t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.tableData,"page-size":99999,"default-columns":["index"]}},[t("el-table-column",{attrs:{label:"detail_id",width:"320px"},scopedSlots:e._u([{key:"default",fn:function(a){return[a.row.detail_id?t("div",[e._v(e._s(a.row.detail_id))]):e._e()]}}])}),t("el-table-column",{attrs:{label:"code",prop:"code"}}),t("el-table-column",{attrs:{label:"模块",prop:"module"}}),t("el-table-column",{attrs:{label:"name",prop:"name"}}),t("el-table-column",{attrs:{label:"个性化租户",prop:"o"}}),t("el-table-column",{attrs:{label:"启用状态"},scopedSlots:e._u([{key:"default",fn:function(a){return[+a.row.is_deleted?t("span",{staticStyle:{color:"#999999"}},[e._v("未启用")]):t("span",{staticStyle:{color:"green"}},[e._v(" 已启用 "),a.row.code?e._e():t("el-tooltip",[t("div",{attrs:{slot:"content"},slot:"content"},[t("p",[e._v("该元数据只存在本地代码中，未存储在远端数据库里")]),t("p",[e._v(e._s(a.row.metadataPath))])]),t("i",{staticClass:"el-icon-warning-outline",staticStyle:{"font-size":"16px","margin-left":"2px"}})])],1)]}}])}),t("el-table-column",{attrs:{width:"220px",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(a){return[t("div",{attrs:{size:[8,4],wrap:""}},[t("a",{on:{click:function(t){return e.goDetail(a.row,"local")}}},[e._v("查看本地元数据")]),t("a",{on:{click:function(t){return e.goPreview(a.row,"local")}}},[e._v("预览")]),t("a",{on:{click:function(t){return e.goEdit(a.row,a.row.type)}}},[e._v("编辑")]),a.row.code?[a.row.standard?t("a",{on:{click:function(t){return e.goCompare(a.row)}}},[e._v(" 比对本地和服务器的元数据 "),a.row.hasUpdate?t("el-tooltip",[t("div",{attrs:{slot:"content"},slot:"content"},[t("p",[e._v("本地和服务器的元数据有差异，请及时更新")])]),t("i",{staticClass:"el-icon-warning",staticStyle:{"font-size":"16px",color:"red"}})]):e._e()],1):e._e(),+a.row.is_deleted?t("a",{on:{click:function(t){return e.enableTemplate(a.row)}}},[e._v("启用")]):e._e(),t("a",{on:{click:function(t){return e.syncDataSource(a.row)}}},[e._v("同步本地元数据到服务器")])]:e._e()],2)]}}])})],1)],1),t("el-tab-pane",{attrs:{label:"本地暂存的配置化列表",name:"customer"}},[t("div",{staticStyle:{display:"flex","margin-bottom":"24px"}},[t("div",{staticStyle:{"margin-left":"auto","align-self":"center"}},[t("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.goEdit(null,"formPage")}}},[e._v("新增表单页")]),t("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.goEdit(null,"listPage")}}},[e._v("新增列表页")]),t("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.removeLocal()}}},[e._v("清空本地缓存")])],1)]),t("el-table",{attrs:{data:e.tableData2,"page-size":99999,"default-columns":["index"]}},[t("el-table-column",{attrs:{width:"150px",label:"name",prop:"name"}}),t("el-table-column",{attrs:{label:"最近编辑时间",prop:"last_modify"}}),t("el-table-column",{attrs:{width:"300px",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(a){return[t("div",{attrs:{size:[8,4],wrap:""}},[t("a",{staticStyle:{"margin-right":"12px"},on:{click:function(t){return e.goDetail(a.row,"local")}}},[e._v("查看本地元数据")]),t("a",{staticStyle:{"margin-right":"12px"},on:{click:function(t){return e.goPreview(a.row,"local")}}},[e._v("预览")]),t("a",{staticStyle:{"margin-right":"12px"},on:{click:function(t){return e.goEdit(a.row,a.row.type)}}},[e._v("编辑")]),t("a",{staticStyle:{"margin-right":"12px"},on:{click:function(t){return e.removeLocal(a.row.name)}}},[e._v("删除")])])]}}])})],1)],1)],1)],1)},i=[],o=(a(6484),[]),r=a(71587),n=a(10034),s=a.n(n),d=a(38615),c=[{isLocal:1,name:"demo",last_modify:"2024-01-18 17:25",metadata:{type:"formPage",labelWidth:"130px",store:{state:{}},initFormMode:"",disableAll:"",dataSource:[],components:[{_id:2,type:"title",showValue:"多列的布局容器",style:""},{_id:3,type:"container",name:"",labelWidth:"",width:"",style:"",components:[[{_id:20,type:"switch",label:"是否显示时间组件",width:"",style:"",required:0,hidden:0,name:"a",disabled:0,doubleConfirm:0,eventListener:[{event:"change",conditionType:"every",conditions:[],handles:[{type:"updateHidden",value:0,targetFormItemId:"21",valueFrom:{type:"condition",conditions:[{type:"expression",expression:"!=",leftDataSource:{type:"eventContext",fieldConfig:{key:"label",value:"value"}},rightDataSource:{type:"constant",value:"1"}}],conditionType:"every"}}]}]},{_id:21,type:"datePicker",label:"时间组件",width:"",style:"",required:1,hidden:0,name:"b",valueFormat:"",format:"",prefixIcon:""}],[{_id:23,type:"radioGroup",label:"单选框组",width:"",style:"",required:0,hidden:0,name:"d",value:"",disabled:0,isSelectFirst:0,dataSource:{type:"template",options:[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}],fieldConfig:{key:"label",value:"value"}},eventListener:[]},{_id:22,type:"checkboxGroup",label:"多选框组",width:"",style:"",required:0,hidden:0,name:"c",value:[],cancelConfirm:0,tip:"",dataSource:{type:"template",options:[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}],fieldConfig:{key:"label",value:"value"}},eventListener:[],disabled:0}]]},{_id:18,type:"title",showValue:"默认布局，不使用布局容器",style:""},{_id:19,type:"dynamicInput",label:"动态输入框",width:"",style:"",required:0,hidden:0,name:"e",addText:"",addTip:""},{_id:32,type:"inputNumber",label:"数字输入框",width:"",style:"",required:0,hidden:0,name:"f"},{_id:11,type:"dataContainer",width:"",style:"",name:"group",value:{},components:[{_id:27,type:"select",label:"下拉框",width:"",style:"",required:0,hidden:0,name:"g",disabled:0,multiple:0,clearable:1,isSelectFirst:0,dataSource:{type:"template",options:[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"}],fieldConfig:{key:"label",value:"value"}}},{_id:28,type:"textarea",label:"多行输入框",width:"",style:"",required:0,hidden:0,name:"h",rows:2,showWordLimit:0,placeholder:"",autosize:0}]},{_id:15,type:"text",label:"注1：",width:"",style:"",required:0,hidden:0,name:"tip1",initRules:[{conditionType:"every",conditions:[],handles:[{type:"model",dataSource:{type:"constant",value:"表单的数据模型是根据组件绑定的字段值自动建模生成的，具体可在【编辑-预览】里实时查看"}}]}]},{_id:16,type:"text",label:"注2：",width:"",style:"",required:0,hidden:0,name:"tip2",initRules:[{conditionType:"every",conditions:[],handles:[{type:"model",dataSource:{type:"constant",value:"该框架不仅仅支持配置组件的渲染，还支持配置组件之间的联动、交互，如：初始化行为（显隐、赋值等），事件的监听（change等事件），事件的响应行为（改显隐、文案、表单值、选项值等），数据源的取数（固定值，从接口取，从事件上下文参数取等），条件表达式（等于，大于，小于，是否为空等）"}}]}]},{_id:17,type:"text",label:"注3",width:"",style:"",required:0,hidden:0,name:"tip3",initRules:[{conditionType:"every",conditions:[],handles:[{type:"model",dataSource:{type:"constant",value:"除了内置的组件和联动交互规则之外，组件也支持通过配置 slot 传入自定义组件，业务逻辑也支持通过传入“函数列表”+ 配置相对应的函数名完成自定义的业务逻辑"}}]}]}]},type:"formPage"}],u={components:{},props:{},data(){return{activeTab:"customer",searchParams:{codeName:""},loading:!1,projectMetadataList:[],customerMetadataList:[],tableData2:[]}},computed:{tableData(){let e=this.projectMetadataList;return"customer"===this.activeTab&&(e=this.customerMetadataList),e=e.filter((e=>!this.searchParams.codeName||(e.code?.indexOf(this.searchParams.codeName)>-1||e.name?.indexOf(this.searchParams.codeName)>-1||e.module?.indexOf(this.searchParams.codeName)>-1))),e}},watch:{activeTab:{handler:function(e){"project"===e?this.getProjectMetadataList():"customer"===e&&this.getCustomerMetadataList()},immediate:!0}},async mounted(){},destroyed(){},methods:{async getMetadataList(){let e={};try{e=await(0,r.ZS)()}catch(t){console.error(t),e=t}return e.data||[]},async getProjectMetadataList(){this.loading=!0;const e=await this.getMetadataList();this.loading=!1;const t={};e?.forEach((e=>{e.standard=e.template,t[e.template_id]=e,+e.is_deleted||(t[e.view_code]=e)})),this.projectMetadataList=o.map((e=>{let a=!1,l=t[e.template_id];if(!l&&t[e.code]&&(l=t[e.code]),l?.standard){const t=JSON.stringify(JSON.parse(l.standard)," ",2),i=JSON.stringify(e.metadata," ",2);a=t!==i}return{...e,...l,hasUpdate:a}}))},async getCustomerMetadataList(){let e=localStorage.getItem("customer_metadata_list");if(e||(console.error(c),localStorage.setItem("customer_metadata_list",JSON.stringify(c)),e=JSON.stringify(c)),e)try{this.tableData2=JSON.parse(e).sort(((e,t)=>s()(e.last_modify).isBefore(s()(t.last_modify))?1:-1))}catch(t){console.error(t)}else this.tableData2=[]},goCompare(e){localStorage.setItem("__metadata",JSON.stringify(e)),this.$router.push({path:"compare"})},goDetail(e,t){localStorage.setItem("__metadata",JSON.stringify(e)),this.$router.push({path:"detail",query:{type:t}})},goPreview(e,t){localStorage.setItem("__metadata",JSON.stringify(e)),this.$router.push({path:"preview",query:{type:t}})},goEdit(e,t){e?localStorage.setItem("__metadata",JSON.stringify(e)):localStorage.removeItem("__metadata"),this.$router.push({path:"edit",query:{type:t}})},removeLocal(e){if(e){let t=localStorage.getItem("customer_metadata_list");t=t?JSON.parse(t):[],t=t.filter((t=>t.name!==e)),localStorage.setItem("customer_metadata_list",JSON.stringify(t))}else localStorage.removeItem("customer_metadata_list");this.$message.success("操作成功"),this.getCustomerMetadataList()},async enableTemplate(e){let t=`是否启用【code=${e.code}】${e.name}的元数据`;const a=this.tableData.find((t=>t.code===e.code&&t.template_id!==e.template_id));a&&(t=`是否将【code=${e.code}】的元数据从【${a.o||"标准"}】切换到【${e.o||"标准"}】`),this.$confirm(t,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((async()=>{let t={};const a={template_id:e.template_id};try{t=await(0,r.Nr)(a)}catch(l){t=l,console.error(l)}0===t.errcode?(this.$message.success("启用成功!"),this.getProjectMetadataList()):this.$message.error(t.errmsg||"启用失败")})).catch((()=>{}))},async syncDataSource(e){const t=`是否更新【code=${e.code}】${e.name}的元数据`;this.$confirm(t,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((async()=>{let t={};const a={template:JSON.stringify(e.metadata),template_id:e.template_id};try{t=await(0,r.u5)(a)}catch(l){t=l,console.error(l)}0===t.errcode?(this.$message.success("同步成功!"),this.getProjectMetadataList()):this.$message.error(t.errmsg||"同步失败")})).catch((()=>{}))},getUpdateSql(e){let t="-- 元数据更新："+e.name+"\n";t+="REPLACE INTO `kf_front_template_detail` ",t+="( `id`, `template_id`, `template`, `extra_front`, `template_field_json`, `created_by`, `created_on`, `modified_by`, `modified_on`, `is_deleted`, `update_timestamp` ) ",t+="VALUES ( ";const a=s()().format("YYYY-MM-DD")+"平台自动生成SQL",l=this.doTransform(e.standard);t+=`'${e.detail_id}', '${e.template_id}', ${l}, '', '', '${a}', now(), '${e.name}',  now(), 0, now() );`,(0,d.Q)(t),this.$message.success("复制成功")},doTransform(e){let t=JSON.stringify(JSON.stringify(JSON.parse(e)));return t=`'${t.substring(1,t.length-1)}'`,t}}},m=u,p=a(9512),y=(0,p.Z)(m,l,i,!1,null,"480d24fd",null),h=y.exports}}]);