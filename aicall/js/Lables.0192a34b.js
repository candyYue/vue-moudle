(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{Cwky:function(e,t,l){"use strict";l.d(t,"f",function(){return s}),l.d(t,"c",function(){return r}),l.d(t,"a",function(){return i}),l.d(t,"b",function(){return o}),l.d(t,"d",function(){return c}),l.d(t,"e",function(){return b});var a=l("oI6n"),n={required:!0,message:"请输入话术内容",trigger:["blur","change"]},s={title:[{required:!0,message:"请输入话术名称",trigger:["blur","change"]},{validator:function(e,t,l){a.b.test(t)?l(new Error("请不要输入非法字符")):l()},trigger:["blur","change"]}],"noinput[0].text":[n,a.a],"noinput[1].text":[n,a.a],"noinput[2].text":[n,a.a],"nomatch[0].text":[n,a.a],"nomatch[1].text":[n,a.a],"nomatch[2].text":[n,a.a],intention:{validator:function(e,t,l){if(t.value&&!t.text)return l(new Error("请输入话术"));l()},trigger:["blur","change"]},session:{validator:function(e,t,l){if(t.value&&!t.text)return l(new Error("请输入话术"));l()},trigger:["blur","change"]}},r={cluster_id:{required:!0,message:"请选择聚类名称",trigger:["blur","change"]},script:[{required:!0,message:"请输入话术",trigger:["blur","change"]},{validator:function(e,t,l){a.b.test(t)?l(new Error("请不要输入非法字符")):l()},trigger:["blur","change"]}]},i={title:[{required:!0,message:"请输入聚类名称",trigger:["blur","change"]},a.a]},o={title:[{required:!0,message:"请输入字段内容",trigger:["blur","change"]},a.a]},c={title:[{required:!0,message:"请输入标签内容",trigger:["blur","change"]},a.a]},b={title:[{required:!0,message:"请输入短信名称",trigger:["blur","change"]},a.a],content:[{required:!0,message:"请输入短信内容",trigger:["blur","change"]},a.a]}},ObVq:function(e,t,l){"use strict";var a=l("PUBJ");l.n(a).a},PUBJ:function(e,t,l){},oI6n:function(e,t,l){"use strict";l.d(t,"b",function(){return a}),l.d(t,"a",function(){return n});var a=/[<>&'"]{1,}/,n={validator:function(e,t,l){t&&a.test(t)&&l(new Error("请不要输入非法字符")),l()},trigger:["change","blur"]}},ubKm:function(e,t,l){"use strict";l.r(t);l("rGqo"),l("yt8O"),l("T39b");var a=l("iv4g"),n=l("yT7P"),s=(l("91GP"),l("Z2Ku"),l("L9s1"),l("L2JU")),r=l("gXkj"),i=l("Cwky"),o=l("nc4g"),c=l("+7xr"),b=l("oI6n"),u={data:function(){var e=this;return{labelsLimit:20,labelsRules:Object.assign(i.d,{labelsTemp:{validator:function(t,l,a){return l&&b.b.test(l)?a(new Error("请不要输入非法字符")):0===e.labelsform.content.length?a(new Error("请输入标签")):l&&b.b.test(l)?a(new Error("请不要输入非法字符")):l&&e.labelsform.content.includes(l)?a(new Error("标签文本不能相同")):e.labelsform.content.length===e.labelsLimit?a(new Error("此标签组已达".concat(e.labelsLimit,"个标签，无法继续添加"))):void a()},trigger:"none"}}),labelsModal:!1,modalType:0,labelsModalTit:{0:"新建标签组",1:"编辑标签组"},labelsform:{id:"",title:"",labelsTemp:"",content:[]},loading:!1}},computed:Object(n.a)({},Object(s.c)({labelsListTotal:"AICall/labelsListTotal",labelsList:"AICall/labelsList"})),methods:Object(n.a)({},Object(s.b)({getLabels:"AICall/getLabels",delLabels:"AICall/delLabels",saveLabels:"AICall/saveLabels"}),{handleNew:function(){if(this.labelsListTotal>=200)return r.b.$warning({content:"您的字段数量已达200个，无法新建"}),!1;this.openModal(),this.modalType=0,this.labelsform.id=""},handleEdit:function(e){var t=e.id,l=e.title,a=e.content;this.openModal(),this.modalType=1,this.labelsform={id:t,title:l,content:a}},handleDelete:function(e){var t=this;r.a.$error({title:"删除提示",content:"您确定要删除该标签组吗？",successCallback:function(){t.delLabels({id:e}).then(function(e){0===e.status&&(o.a.$emit("reloadList",c.PAGE_HANDLER.DEL),r.b.$success({content:"删除成功"}))})}})},handleSave:function(){var e=this,t=this.labelsform,l={id:t.id,content:t.content,title:t.title};this.$refs.labelsform.validate(function(t){if(!t)return!1;e.loading=!0,e.saveLabels(l).then(function(t){0===t.status&&(e.closeModal(),r.b.$success({content:"保存成功"}),0===e.modalType?o.a.$emit("reloadList",c.PAGE_HANDLER.ADD):o.a.$emit("reloadList",c.PAGE_HANDLER.EDIT)),e.loading=!1})})},addLabels:function(){var e=this.labelsform.content?this.labelsform.content.length:0,t=this.labelsform.content?this.labelsform.content:[];if(this.$refs.labelsTemp.clearValidate(),this.labelsform.labelsTemp){if(e>=1&&(this.$refs.labelsform.validateField("labelsTemp"),e===this.labelsLimit))return!1;if(b.b.test(this.labelsform.labelsTemp))return this.$refs.labelsform.validateField("labelsTemp"),!1;var l=Object(a.a)(t);l.unshift(this.labelsform.labelsTemp),this.labelsform.labelsTemp="",this.labelsform.content=Object(a.a)(new Set(l))}else this.$refs.labelsform.validateField("labelsTemp")},removeLabels:function(e){var t=Object(a.a)(this.labelsform.content);t.splice(e,1),this.labelsform.content=t},openModal:function(){this.labelsModal=!0,this.$refs.labelsform.resetFields(),this.labelsform.content=[],this.loading=!1},closeModal:function(){this.labelsModal=!1}})},d=(l("ObVq"),l("KHd+")),f=Object(d.a)(u,function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",[l("table-pagination",{attrs:{name:"标签组",router:"AICall-talk-labels",pageKey:"label",total:e.labelsListTotal},on:{handleNew:e.handleNew,getList:e.getLabels}},[l("el-table",{attrs:{data:e.labelsList}},[l("el-table-column",{attrs:{prop:"title",label:"标签组名称",align:"left",width:"200"}}),l("el-table-column",{attrs:{label:"标签集合","class-name":"tags-cell"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",{attrs:{title:t.row.content&&t.row.content.join(" / ")}},[e._v(e._s(t.row.content&&t.row.content.join(" / ")))])]}}])}),l("el-table-column",{attrs:{label:"操作",width:"100","class-name":"visible-cell"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-button",{attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(l){e.handleEdit(t.row)}}}),l("el-button",{attrs:{type:"text",icon:"el-icon-delete"},on:{click:function(l){e.handleDelete(t.row.id)}}})]}}])})],1)],1),l("Modal",{class:["modal-padding-25",{"modal-has-tip":1===e.modalType}],attrs:{title:e.labelsModalTit[e.modalType],loading:e.loading,draggable:""},on:{cancel:e.closeModal,comfirm:e.handleSave},model:{value:e.labelsModal,callback:function(t){e.labelsModal=t},expression:"labelsModal"}},[1===e.modalType?l("p",{staticClass:"modal-tip"},[e._v("所编辑的标签需要在相应的话术编辑页面进行保存才可生效。")]):e._e(),l("el-form",{ref:"labelsform",attrs:{model:e.labelsform,rules:e.labelsRules,"label-width":"100px"}},[l("el-form-item",{attrs:{label:"标签组名称",prop:"title"}},[l("el-input",{attrs:{maxlength:"20"},model:{value:e.labelsform.title,callback:function(t){e.$set(e.labelsform,"title","string"==typeof t?t.trim():t)},expression:"labelsform.title"}})],1),l("el-form-item",{ref:"labelsTemp",staticClass:"required-form",attrs:{label:"标签集合",prop:"labelsTemp"}},[l("div",{staticClass:"flex-layout-form"},[l("el-input",{attrs:{maxlength:"20"},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.addLabels(t):null}},model:{value:e.labelsform.labelsTemp,callback:function(t){e.$set(e.labelsform,"labelsTemp","string"==typeof t?t.trim():t)},expression:"labelsform.labelsTemp"}}),l("el-button",{staticClass:"button__add",attrs:{icon:"el-icon-plus",size:"mini"},on:{click:e.addLabels}})],1)]),e.labelsform.content&&e.labelsform.content.length?l("div",{staticClass:"tags-collection"},e._l(e.labelsform.content,function(t,a){return l("span",{key:a,staticClass:"text-tag"},[e._v("\n            "+e._s(t)+"\n            "),l("i",{staticClass:"el-icon-close",on:{click:function(t){e.removeLabels(a)}}})])})):e._e()],1)],1)],1)},[],!1,null,"5d263b73",null);t.default=f.exports}}]);