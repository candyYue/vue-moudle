(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"6zNx":function(t,e,n){"use strict";var a=n("T3ad");n.n(a).a},DaE6:function(t,e,n){},IHUz:function(t,e,n){"use strict";n.r(e);n("VRzm");var a={components:{ScriptNav:n("li5v").a},data:function(){return{navList:[{label:"话术",name:"Admin-List"},{label:"配置",name:"Admin-Setting"}]}}},i=(n("Udzx"),n("KHd+")),r=Object(i.a)(a,function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("script-nav",{attrs:{navList:this.navList}}),e("router-view")],1)},[],!1,null,"739b2fd2",null);e.default=r.exports},T3ad:function(t,e,n){},Udzx:function(t,e,n){"use strict";var a=n("DaE6");n.n(a).a},li5v:function(t,e,n){"use strict";n("Z2Ku"),n("L9s1"),n("f3/d"),n("VRzm");var a={data:function(){return{activeName:this.$route.name,routerList:this.navList}},props:{navList:{type:Array,default:function(){return[]}}},watch:{navList:function(t){this.routerList=t},$route:{handler:function(){this.routerListener()},immediate:!0}},methods:{handleClick:function(t){t.name.includes("Admin-List")?this.$router.push({name:t.name,query:{es_id:this.$route.params.id}}):this.$router.push({name:t.name})},routerListener:function(){this.$route.name.indexOf("AICall-talk-script")>-1?this.activeName="AICall-talk-script":this.activeName=this.$route.name}}},i=(n("6zNx"),n("KHd+")),r=Object(i.a)(a,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-tabs",{on:{"tab-click":t.handleClick},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},t._l(t.navList,function(t){return n("el-tab-pane",{key:t.name,attrs:{label:t.label,name:t.name}})}))},[],!1,null,null,null);e.a=r.exports}}]);