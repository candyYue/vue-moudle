(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"2Fo5":function(t,e,a){"use strict";var i=a("uMWL");a.n(i).a},"9S8S":function(t,e,a){"use strict";var i=a("Ne3X");a.n(i).a},"9qKe":function(t,e,a){"use strict";var i=a("yT7P");a("f3/d");var n={name:"breadcrumb",props:{pathKey:String},data:function(){var t={question:{path:"/enterprise/question",key:"问题",name:"问题库"},script:{path:"/enterprise/talk",key:"话术",name:"话术管理"},task:{path:"/enterprise/task",key:"任务",name:"任务管理"}};return{path:t,RoutePath:t[this.pathKey].path,Route:t[this.pathKey].name,subRoute:""}},methods:{back:function(){var t=Object(i.a)({},this.$route.meta),e=(t.edit,function(t,e){if(null==t)return{};var a,i,n={},s=Object.keys(t);for(i=0;i<s.length;i++)a=s[i],e.indexOf(a)>=0||(n[a]=t[a]);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(i=0;i<l.length;i++)a=l[i],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(n[a]=t[a])}return n}(t,["edit"]));this.$router.push({path:this.RoutePath,query:e})}},mounted:function(){var t=this.$route.params&&this.$route.params.id;"task"===this.pathKey?this.subRoute=this.path[this.pathKey].key+"详情":this.subRoute=t&&"new"===t?"新建"+this.path[this.pathKey].key:"编辑"+this.path[this.pathKey].key}},s=(a("2Fo5"),a("KHd+")),l=Object(s.a)(n,function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"el-breadcrumb"},[e("span",{staticClass:"el-breadcrumb__item"},[e("span",{staticClass:"path-name",on:{click:this.back}},[this._v(this._s(this.Route))]),e("i",{staticClass:"el-breadcrumb__separator el-icon-arrow-right"})]),e("span",{staticClass:"el-breadcrumb__item"},[this._v("\n    "+this._s(this.subRoute)+"\n  ")])])},[],!1,null,null,null);e.a=l.exports},CoYH:function(t,e,a){"use strict";var i=a("G1D9");a.n(i).a},FNce:function(t,e,a){},"FZ/W":function(t,e,a){},G1D9:function(t,e,a){},Ne3X:function(t,e,a){},PWzE:function(t,e,a){"use strict";a.r(e);a("ls82");var i,n,s=a("MECJ"),l=(a("T39b"),a("HEwt"),a("a94B")),r=(a("yt8O"),a("RW0V"),a("rGqo"),a("yT7P")),o=(a("VRzm"),a("9qKe")),c=a("L2JU"),u=a("tNJY"),d=a("nc4g"),h=a("gXkj"),p=(a("KKXr"),a("Vd3H"),function(t,e){return t.length>e.length?1:0}),f=a("dm+Y"),m={name:"recordDetail",props:{recordDetailShow:{type:Boolean,default:!1},cluedata:{type:Object,default:function(){return{}}}},data:function(){return{dailyrecord:[],callaudio:!1,audioSrc:"",play:!0,slidervalue:0,currentTime:0,duration:0,flag:!0}},filters:{formatDate:function(){return Object(f.b)()("hh:mm:ss")}},computed:Object(r.a)({},Object(c.c)({recordDetailList:"AICall/recordDetailList"})),methods:Object(r.a)({},Object(c.b)({recordDetail:"AICall/recordDetail",getRecordUrl:"AICall/getRecordUrl"}),{highlightText:function(t,e){e.sort(p);var a=t.split(e[e.length-1]).join('<span class="highlight">'+e[e.length-1]+"</span>");return e.length>1?this.highlightText(a,e.slice(0,-1)):a},showRecord:function(){this.recordDetailList.record=u.a.parseString(this.recordDetailList.content,{textKey:"text",valueKey:"value",attrKey:"attr"}),this.recordDetailList.record.calllog[0].instruct=this.recordDetailList.record.calllog[0].item.filter(function(t){return"instruct"===t.attr.action.value}),this.recordDetailList.record.calllog[0].match=this.recordDetailList.record.calllog[0].item.filter(function(t){return"match"===t.attr.action.value}),this.recordDetailList.record.calllog[0].item=this.recordDetailList.record.calllog[0].item.filter(function(t){return"dialog"===t.attr.action.value}),this.dailyrecord=this.recordDetailList.record.calllog[0]},recordAction:function(t){var e=this;0===t&&this.getRecordUrl({cc_number:this.cluedata.cc_number,operate:t}).then(function(t){0===t.status?(e.play=!0,e.audioSrc=t.data.url,setTimeout(function(t){e.resetRecord()},0),e.callaudio=!0):h.b.$info({content:t.info})}),1===t&&this.getRecordUrl({cc_number:this.cluedata.cc_number,operate:t}).then(function(t){0===t.status?window.location.href=t.data.url:h.b.$info({content:t.info})})},togglePlay:function(){var t=this.play?"pause":"play";this.play=!this.play,this.$refs.audioRecord[t]()},changeSlider:function(t){this.$refs.audioRecord.currentTime=t/100*this.duration;var e=this.play?"play":"pause";this.$refs.audioRecord[e]()},handleProgress:function(){var t=this.$refs.audioRecord,e=t&&t.currentTime?this.duration*t.currentTime/t.duration:0;this.currentTime=e,this.slidervalue=e/this.duration*100},closeaudio:function(){this.$refs.audioRecord.pause(),this.callaudio=!1},closeRecordDetail:function(){this.$refs.audioRecord.pause(),this.$emit("closeRecordDetail"),this.callaudio=!1},resetRecord:function(){var t=this;this.$refs.audioRecord.addEventListener("error",function(){return window.open(t.$refs.audioRecord.src),!1}),this.$refs.audioRecord.addEventListener("canplay",function(){t.duration=t.cluedata.duration,t.$refs.audioRecord.addEventListener("timeupdate",t.handleProgress)}),this.changeSlider(0)}}),mounted:function(){d.a.$on("showRecord",this.showRecord)}},_=(a("9S8S"),a("KHd+")),b=Object(_.a)(m,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"record-detail"},[a("Modal",{attrs:{title:"通话详情",showFooter:!1},on:{cancel:t.closeRecordDetail},model:{value:t.recordDetailShow,callback:function(e){t.recordDetailShow=e},expression:"recordDetailShow"}},[Object.keys(t.dailyrecord).length?a("div",{staticClass:"record-body"},[a("div",{staticClass:"record-date"},[t._v("\n        "+t._s(t.timeStamp(t.recordDetailList.call_time)("YY年MM月DD日"))+"\n      ")]),a("div",{staticClass:"record-content"},[a("div",{staticClass:"dialog"},[a("p",{staticClass:"dialog-item"},[a("span",{staticClass:"time"},[t._v(t._s(t._f("formatSecond")(t.recordDetailList.call_time?t.recordDetailList.call_time:t.dailyrecord.item[0].attr.timeseconds.value)))]),a("span",[a("i",{staticClass:"record-download",on:{click:function(e){t.recordAction(1)}}}),a("i",{staticClass:"record-listen",on:{click:function(e){t.recordAction(0)}}})])]),a("div",[t._l(t.dailyrecord.item,function(e,i){return a("div",{key:i,staticClass:"recorditem"},["string"==typeof e.text?a("p",{key:i,class:"string"==typeof e.text?e.attr.user.value:""},[a("i"),a("span",{staticClass:"calllog",domProps:{innerHTML:t._s(e.attr.keywords&&1===t.cluedata.intention&&e.attr.keywords.value?t.highlightText(e.text,e.attr.keywords.value.split(";")):e.text)}})]):t._e()])}),a("p",{staticClass:"endtime"},[t._v("通话结束 "+t._s(t._f("formatSecond")(t.dailyrecord.instruct.length?t.dailyrecord.item[t.dailyrecord.item.length-1].attr.timeseconds.value:t.recordDetailList.hangup_time)))]),t.dailyrecord.instruct.length?a("div",{staticClass:"dialog-item"},[a("span",{staticClass:"time"},[t._v(t._s(t._f("formatSecond")(t.dailyrecord.instruct[0].attr.timeseconds.value)))]),"success"===t.dailyrecord.instruct[0].attr.status.value?a("span",{staticClass:"margin-left8"},[t._v("转为人工坐席")]):t._e(),"fail"===t.dailyrecord.instruct[0].attr.status.value?a("span",{staticClass:"error-text margin-left8"},[t._v("转为人工坐席失败")]):t._e(),a("p",{staticClass:"endtime"},[t._v("通话结束 "+t._s(t._f("formatSecond")(t.recordDetailList.hangup_time)))])]):t._e()],2)])]),a("transition",{attrs:{name:"fade-in"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:t.callaudio,expression:"callaudio"}],staticClass:"call-audio record-audio"},[a("audio",{ref:"audioRecord",attrs:{src:t.audioSrc,controls:"",autoplay:"",hidden:""},on:{ended:function(e){t.play=!1}}}),a("span",[t._v("通话录音：")]),a("button",{staticClass:"audio-control",on:{click:t.togglePlay}},[a("i",{class:t.play?"el-icon-audiopause":"el-icon-audioplay"})]),a("el-slider",{attrs:{"show-tooltip":!1},on:{change:t.changeSlider},model:{value:t.slidervalue,callback:function(e){t.slidervalue=e},expression:"slidervalue"}}),a("span",[t._v(t._s(t._f("formatSecond")(t.currentTime)))]),t._v(" | "),a("span",[t._v(t._s(t._f("formatSecond")(t.duration)))]),a("span",{staticClass:"audio-close"},[a("i",{staticClass:"el-icon-close",on:{click:t.closeaudio}})])],1)])],1):t._e()])],1)},[],!1,null,null,null).exports,v=a("WQji"),g=a("Y+6y"),y=a("9LuB"),k=a("9y2E"),C=a("QIt3"),I=[{label:1,value:"意向性A"},{label:2,value:"意向性B"},{label:3,value:"意向性C"},{label:4,value:"意向性D"},{label:5,value:"意向性E"},{label:6,value:"意向性F"}],w={data:function(){var t=this;return{intentionTips:[{type:"A类高意向：",note:"1.触发四个或四个以上问题。2.主流程走完。3.通话时间2分钟以上。"},{type:"B类一般意向：",note:"1.触发两个以上问题。2.通话1~2分钟。3.全局回应在忙、发我短信、在开车、开会、晚点打过来。"},{type:"C类低意向：",note:"1.通话时间大于30s小于1分钟。2.流程进行完2个节点就挂机。"},{type:"D类没意向：",note:"1.接通后立即挂机。"},{type:"E类没意向：",note:"1.接通后没声音直到挂机。 2.通话中、无人接听。"},{type:"F类未接听：",note:"空号、停机、说脏话"}],pickerBeginDateBefore:{disabledDate:function(e){var a=t.formInline.time.endTime;return a?e.getTime()>a:e.getTime()>Date.now()}},pickerBeginDateAfter:{disabledDate:function(e){var a=t.formInline.time.beginTime;return a&&e.getTime()<a||e.getTime()>Date.now()}},task_id:parseInt(this.$route.params.id),clue_id:null,statistics:[{name:"progress",lable:"任务进度：",value:"",hidden:!1},{name:"rate",lable:"接通率：",value:"",hidden:!1},{name:"average",lable:"平均通话时长：",value:"",hidden:!1},{name:"count",lable:"转人工次数：",value:"",hidden:!0}],formInline:{mobile:"",script_id:"",manual_status:"",time:{beginTime:"",endTime:""},call_status:"",call_result:"",label:[],intention:[],duration:[]},intentionAll:!1,intentions:I,isIndeterminate:!1,call_status:[{value:0,label:"未联系"},{value:1,label:"已联系"}],call_result:[{value:2,label:"通话成功"},{value:3,label:"未接听"},{value:1,label:"接听后挂掉"}],manual_status_list:[{value:2,label:"转接成功"},{value:1,label:"转接失败"}],currentpage:1,pageKey:"taskId",recordDetailShow:!1,multipleSelection:[],cluedata:{},CluesList:[],starticon:"el-icon-pause"}},components:{Breadcrumb:o.a,Tooltip:v.a,recordDetail:b,Loading:g.a},computed:Object(r.a)({},Object(c.c)({EpInfo:"AICall/EpInfo",free:"AICall/free",scriptList:"AICall/scriptList",taskCluesListTotal:"AICall/taskCluesListTotal",taskCluesList:"AICall/taskCluesList",task_status:"AICall/task_status",ai_count:"AICall/ai_count",labelsList:"AICall/labelsList",recordDetailList:"AICall/recordDetailList",limitMap:"limitMap"}),{currentlimit:function(){return this.limitMap[this.pageKey]||10},startBtn:function(){return-1===this.task_status||0===this.task_status?(this.starticon="el-icon-play","开始任务"):3===this.task_status||5===this.task_status||6===this.task_status?(this.starticon="el-icon-play","继续任务"):1===this.task_status||2===this.task_status||7===this.task_status?(this.starticon="el-icon-pause","暂停任务"):void 0},labelsOptions:function(){return this.labelsList.map(function(t){return{value:t.id,label:t.title,children:t.content?t.content.map(function(t){return{label:t,value:t}}):""}})||[]},opts:function(){var t={task_id:parseInt(this.$route.params.id),mobile:this.formInline.mobile,script_id:this.formInline.script_id,call_status:this.formInline.call_status,call_result:this.formInline.call_result,manual_status:this.formInline.manual_status,duration:this.formInline.duration,intention:this.formInline.intention,start_time:this.formInline.time.beginTime,end_time:this.formInline.time.endTime,label:this.formInline.label,page:this.currentpage,limit:this.currentlimit};for(var e in t)""!==t[e]&&void 0!==t[e]&&null!==t[e]&&0!==t[e].length||delete t[e];return t}}),directives:{numberOnly:y.a},watch:{$route:"handlePage",formInline:{handler:function(t,e){t.intention.length===this.intentions.length?(this.intentionAll=!0,this.isIndeterminate=!1):0===t.intention.length?(this.intentionAll=!1,this.isIndeterminate=!1):(this.intentionAll=!1,this.isIndeterminate=!0)},deep:!0},taskCluesList:function(t){t.length?this.CluesList=t:this.CluesList=[]}},methods:Object(r.a)({},Object(c.b)({getLabels:"AICall/getLabels",getScripts:"AICall/getScripts",taskStatistics:"AICall/taskStatistics",taskClues:"AICall/taskClues",controlTask:"AICall/controlTask",reCall:"AICall/reCall",recordDetail:"AICall/recordDetail",delRecords:"AICall/delRecords",getEpInfo:"AICall/getEpInfo",getfree:"AICall/getfree",changeLimit:"changeLimit"}),{intentionValue:function(t){return{1:"A类",2:"B类",3:"C类",4:"D类",5:"E类",6:"F类"}[t.intention]},handleCheckAllChange:function(t){this.formInline.intention=t?I.map(function(t){return t.label}):[],this.isIndeterminate=!1},handleCheckedIntentionChange:function(t){var e=t.length;this.intentionAll=e===this.intentions.length,this.isIndeterminate=e>0&&e<this.intentions.length},gettaskStatistics:function(){var t=this;this.taskStatistics({task_id:this.$route.params.id}).then(function(e){var a=["".concat(e.data.completed," / ").concat(e.data.total),"".concat(e.data.success_rate," %"),t.duration(e.data.avg_duration)("hh:mm:ss"),"".concat(e.data.manual_times,"次")];t.statistics.forEach(function(t,e){t.value=a[e]})}),"1"===this.EpInfo.enterprise_type?this.statistics[3].hidden=!1:this.statistics[3].hidden=!0},handlePage:function(){var t,e=this;if(0===this.formInline.call_status){var a=+this.$route.query.page||1,i=+this.$route.query.limit||this.currentlimit,n=+this.$route.query.mobile||"",s=+this.$route.query.script_id||"",l=0==this.$route.query.call_status?0:+this.$route.query.call_status;this.currentpage=a,this.formInline.mobile=n,this.formInline.script_id=s,this.formInline.call_status=l,this.changeLimit({key:this.pageKey,limit:i}),t={limit:i,task_id:parseInt(this.$route.params.id),mobile:n,script_id:s,call_status:l,page:a}}else{var o=+this.$route.query.page||1,c=+this.$route.query.limit||this.currentlimit,u=+this.$route.query.mobile||"",d=+this.$route.query.script_id||"",h=+this.$route.query.call_status||"",p=+this.$route.query.call_result||"",f=+this.$route.query.manual_status||"",m=this.$route.query.duration?"string"==typeof this.$route.query.duration?[this.$route.query.duration]:this.$route.query.duration.map(function(t){return t}):[],_=this.$route.query.intention?"string"==typeof this.$route.query.intention?[+this.$route.query.intention]:this.$route.query.intention.map(function(t){return+t}):[],b=+this.$route.query.start_time||"",v=+this.$route.query.end_time||"",g=this.$route.query.label?[+this.$route.query.label[0],this.$route.query.label[1]]:[];this.currentpage=o,this.formInline=Object(r.a)({},this.formInline,{mobile:u,script_id:d,call_status:h,call_result:p,manual_status:f,duration:m,intention:_,label:g}),this.formInline.time.beginTime=b,this.formInline.time.endTime=v,this.changeLimit({key:this.pageKey,limit:c}),t={task_id:parseInt(this.$route.params.id),mobile:u,script_id:d,manual_status:f,call_status:h,call_result:p,duration:m,intention:_,page:o,limit:c,start_time:b?b/1e3:"",end_time:v?v/1e3+86400-1:"",label:g.length?encodeURI(encodeURI(g[g.length-1])):""}}for(var y in t)""!==t[y]&&void 0!==t[y]&&null!==t[y]&&0!==t[y].length||delete t[y];this.taskClues(t).then(function(){e.fullLoading.close()})},handleCurrentChange:function(t){this.currentpage=t,this.$router.push({name:"AICall-task-id",query:this.opts})},handleSizeChange:function(t){this.changeLimit({key:this.pageKey,limit:t}),this.onSearch()},onSearch:function(){this.currentpage=1,this.$router.push({name:"AICall-task-id",query:this.opts})},exportAction:function(t){delete this.opts.page,delete this.opts.limit;var e=Object(r.a)({},this.opts);e.end_time&&(e.start_time=e.start_time/1e3),e.end_time&&(e.end_time=e.end_time/1e3+86400-1);var a="";Object.keys(e).forEach(function(t){"object"===Object(l.a)(e[t])&&0===e[t].length||(a+="label"===t?"".concat(t,"=").concat(e[t][e[t].length-1],"&"):"".concat(t,"=").concat(e[t],"&"))}),a.length&&(a=a.substr(0,a.length-1)),1===t&&(a+="&export=1",window.location.href="".concat(C.a.AICall.getTaskClues,"?").concat(a),this.$refs.exportList.$el.blur()),2===t&&(a+="&export_record=1",window.location.href="".concat(C.a.AICall.getTaskClues,"?").concat(a),this.$refs.exportText.$el.blur())},cascaderAction:function(){var t=this;setTimeout(function(e){if(0===t.labelsList.length){var a=document.querySelector(".el-cascader-menus");a.classList.add("el-cascader-nodata"),a.innerHTML="无数据"}},0)},deleteClues:function(){if(1===this.task_status)return h.b.$warning({content:"您需要先暂停任务，再进行删除。"}),!1;if(0===this.multipleSelection.length)return h.b.$warning({content:"请您选择需要删除的客户号码。"}),!1;var t=this.multipleSelection.map(function(t){return{clue_id:t.id,calllog_id:t.calllog_id}}),e=this;h.a.$error({title:"删除提示",content:"您确定要删除已选择的客户号码吗？",successCallback:function(){e.delRecords({task_id:e.task_id,records:JSON.stringify(t)}).then(function(a){0===a.status&&(e.taskCluesList.length===t.length&&e.currentpage>1?e.handleCurrentChange(e.currentpage-1):e.handlePage(),h.b.$success({content:"删除成功！"}),e.gettaskStatistics())})}})},recordDetailAction:function(t){var e=this;this.cluedata=t,this.recordDetail({cc_number:t.cc_number,ajax:1}).then(function(t){0===t.status&&(e.recordDetailShow=!0,d.a.$emit("showRecord"))})},closeRecordDetail:function(){this.recordDetailShow=!1},handleSelectionChange:function(t){this.multipleSelection=t},reCallaction:function(){if(0===this.multipleSelection.length)return h.b.$warning({content:"请选择需要重新呼叫的客户号码。"}),!1;if(this.multipleSelection.filter(function(t){return 0===t.record_count}).length)return h.b.$warning({content:"您的选择包含未联系的客户，请选择已联系的客户进行再次呼叫"}),!1;if(!Object(k.a)(this.EpInfo.daily_start_time,this.EpInfo.daily_end_time))return h.b.$warning({content:"现在是非外呼时间段，机器人无法进行外呼任务"}),!1;if(this.multipleSelection.length>=1){var t=Array.from(new Set(this.multipleSelection.map(function(t){return t.id}))),e=this;h.a.$warning({title:"呼叫提示",content:"您确定要进行再次呼叫吗？",successCallback:function(){e.reCall({task_id:e.task_id,clues:t}).then(function(t){0===t.status&&(h.b.$success({content:"已将客户号码添加到任务队列中"}),e.handlePage())})}})}},taskstatusAction:(n=Object(s.a)(regeneratorRuntime.mark(function t(){var e,a,i;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e=this,1!==this.task_status&&7!==this.task_status||(a="pause",h.a.$error({title:"暂停提示",content:"您确定要暂停该任务吗？",successCallback:function(){e.controlTask({id:e.task_id,operate:a}).then(function(t){0===t.status&&(h.b.$success({content:"操作成功！"}),e.handlePage())})}})),0!==this.task_status&&3!==this.task_status&&5!==this.task_status&&6!==this.task_status){t.next=27;break}if(i="start",Object(k.a)(this.EpInfo.daily_start_time,this.EpInfo.daily_end_time)){t.next=9;break}return h.b.$warning({content:"现在是非外呼时间段，机器人无法进行外呼任务"}),t.abrupt("return",!1);case 9:return t.next=11,this.getfree();case 11:if(0!==this.free){t.next=16;break}return h.a.$warning({comfirmText:"继续执行",title:"任务提示",content:"当前没有空闲的机器人可以执行任务，如需".concat(this.ai_count,"个执行任务，请先暂停或修改其他任务。点击继续，机器人将在空闲时自动加入任务。"),successCallback:function(){e.controlTask({id:e.task_id,operate:i}).then(function(t){0===t.status&&(h.b.$success({content:"操作成功！"}),e.handlePage())})}}),t.abrupt("return",!1);case 16:if(!(this.ai_count>this.free&&this.taskCluesListTotal>this.free)){t.next=21;break}return h.a.$warning({comfirmText:"继续执行",title:"任务提示",content:"当前只有".concat(this.free,"个空闲外呼机器人可以执行任务，如需").concat(this.ai_count,"个执行任务，请先暂停或修改其他任务。点击继续，将以").concat(this.free,"个机器人执行任务，待余下的机器人空闲时自动加入任务。"),successCallback:function(){e.controlTask({id:e.task_id,operate:i,ai_count:e.free}).then(function(t){0===t.status&&(h.b.$success({content:"操作成功！"}),e.handlePage())})}}),t.abrupt("return",!1);case 21:if(!(this.ai_count<this.free&&this.taskCluesListTotal>this.ai_count)){t.next=26;break}return h.a.$warning({comfirmText:"快速呼出",cancelText:"普通呼出",title:"任务提示",content:"当前空闲机器人数为".concat(this.free,"个，可以全部执行任务，进行快速呼出，提高任务效率。"),successCallback:function(){e.controlTask({id:e.task_id,operate:i,ai_count:e.free}).then(function(t){0===t.status&&(h.b.$success({content:"操作成功！"}),e.handlePage())})},cancelCallback:function(){e.controlTask({id:e.task_id,operate:i}).then(function(t){0===t.status&&(h.b.$success({content:"操作成功！"}),e.handlePage())})}}),t.abrupt("return",!1);case 26:this.controlTask({id:e.task_id,operate:i}).then(function(t){0===t.status&&(h.b.$success({content:"操作成功！"}),e.handlePage())});case 27:case"end":return t.stop()}},t,this)})),function(){return n.apply(this,arguments)})}),mounted:(i=Object(s.a)(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.fullLoading=this.$loading({lock:!0,background:"rgba(180, 188, 205, 0.35)"}),t.next=3,this.getScripts();case 3:return t.next=5,this.getEpInfo();case 5:this.handlePage(),this.gettaskStatistics(),this.getLabels();case 8:case"end":return t.stop()}},t,this)})),function(){return i.apply(this,arguments)})},$=(a("T6f/"),a("n5dg"),Object(_.a)(w,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"task-id"},[a("Breadcrumb",{attrs:{pathKey:"task"}}),a("div",{staticStyle:{"overflow-x":"auto"}},[a("div",{staticStyle:{width:"100%","min-width":"1400px"}},[a("ul",{staticClass:"statistics overflow-hidden flex-between"},t._l(t.statistics,function(e,i){return a("li",{key:i,class:{"statistics-hidden":e.hidden}},[a("div",{staticClass:"statistic-img",class:"call-"+e.name}),a("p",[a("span",[t._v(t._s(e.lable))]),a("span",{staticClass:"right-count"},[t._v(t._s(e.value))])])])})),a("div",{staticClass:"table-search"},[a("el-form",{attrs:{inline:!0,model:t.formInline,"label-position":"left"}},[a("div",{staticClass:"first-item"},[a("div",{staticClass:"flex-between search-item"},[a("div",[a("span",[t._v("客户号码")]),a("el-input",{directives:[{name:"number-only",rawName:"v-number-only"}],attrs:{placeholder:"请输入号码"},model:{value:t.formInline.mobile,callback:function(e){t.$set(t.formInline,"mobile","string"==typeof e?e.trim():e)},expression:"formInline.mobile"}})],1),a("div",[a("span",[t._v("话术名称")]),a("el-select",{attrs:{placeholder:"请选择话术名称",filterable:"",clearable:"","popper-class":"select-width176"},model:{value:t.formInline.script_id,callback:function(e){t.$set(t.formInline,"script_id",e)},expression:"formInline.script_id"}},t._l(t.scriptList,function(t,e){return a("el-option",{key:e,attrs:{label:t.title,value:t.id,title:t.title}})}))],1),a("div",[a("span",[t._v("联系进度")]),a("el-select",{attrs:{placeholder:"请选择联系进度",filterable:"",clearable:""},model:{value:t.formInline.call_status,callback:function(e){t.$set(t.formInline,"call_status",e)},expression:"formInline.call_status"}},t._l(t.call_status,function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})}))],1),a("div",[a("span",{staticClass:"label"},[t._v("客户标签")]),a("el-cascader",{attrs:{disabled:0===t.formInline.call_status,filterable:"",clearable:"","show-all-levels":!1,options:t.labelsOptions,placeholder:"请选择标签"},on:{focus:t.cascaderAction},model:{value:t.formInline.label,callback:function(e){t.$set(t.formInline,"label",e)},expression:"formInline.label"}})],1),a("div",{directives:[{name:"show",rawName:"v-show",value:"1"!==t.EpInfo.enterprise_type,expression:"EpInfo.enterprise_type !== '1'"}]},[a("span",[t._v("联系结果")]),a("el-select",{attrs:{placeholder:"请选择结果",filterable:"",clearable:"",disabled:0===t.formInline.call_status},model:{value:t.formInline.call_result,callback:function(e){t.$set(t.formInline,"call_result",e)},expression:"formInline.call_result"}},t._l(t.call_result,function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})}))],1),a("div",{directives:[{name:"show",rawName:"v-show",value:"1"===t.EpInfo.enterprise_type,expression:"EpInfo.enterprise_type === '1'"}]},[a("span",[t._v("转为人工坐席")]),a("el-select",{attrs:{placeholder:"请选择结果",filterable:"",clearable:"",disabled:0===t.formInline.call_status},model:{value:t.formInline.manual_status,callback:function(e){t.$set(t.formInline,"manual_status",e)},expression:"formInline.manual_status"}},t._l(t.manual_status_list,function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})}))],1)]),a("div",{staticClass:"dispaly-flex search-item"},["1"===t.EpInfo.enterprise_type?a("div",{staticClass:"flex-1"},[a("span",[t._v("联系结果")]),a("el-select",{attrs:{placeholder:"请选择结果",filterable:"",clearable:"",disabled:0===t.formInline.call_status},model:{value:t.formInline.call_result,callback:function(e){t.$set(t.formInline,"call_result",e)},expression:"formInline.call_result"}},t._l(t.call_result,function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})}))],1):t._e(),a("div",{staticClass:"search-date"},[a("el-form-item",{staticClass:"narrow",attrs:{label:"呼出时间"}},[a("el-date-picker",{attrs:{disabled:0===t.formInline.call_status,type:"date","picker-options":t.pickerBeginDateBefore,format:"yyyy-MM-dd","value-format":"timestamp",placeholder:"开始时间"},model:{value:t.formInline.time.beginTime,callback:function(e){t.$set(t.formInline.time,"beginTime",e)},expression:"formInline.time.beginTime"}})],1),a("el-form-item",{attrs:{label:"至"}},[a("el-date-picker",{attrs:{disabled:0===t.formInline.call_status,type:"date","picker-options":t.pickerBeginDateAfter,format:"yyyy-MM-dd","value-format":"timestamp",placeholder:"结束时间"},model:{value:t.formInline.time.endTime,callback:function(e){t.$set(t.formInline.time,"endTime",e)},expression:"formInline.time.endTime"}})],1)],1),a("div",{staticClass:"flex-3"})])]),a("div",{staticClass:"last-item"},[a("div",{staticClass:"intention"},[a("span",[t._v("客户意向性")]),a("Tooltip",{staticClass:"intention-tooltip"},t._l(t.intentionTips,function(e,i){return a("dl",{key:i},[a("dt",[t._v(t._s(e.type))]),a("dd",[t._v(t._s(e.note))])])})),a("el-checkbox",{attrs:{indeterminate:t.isIndeterminate,disabled:0===t.formInline.call_status},on:{change:t.handleCheckAllChange},model:{value:t.intentionAll,callback:function(e){t.intentionAll=e},expression:"intentionAll"}},[t._v("全选")]),a("el-checkbox-group",{on:{change:t.handleCheckedIntentionChange},model:{value:t.formInline.intention,callback:function(e){t.$set(t.formInline,"intention",e)},expression:"formInline.intention"}},t._l(t.intentions,function(e){return a("el-checkbox",{key:e.label,attrs:{label:e.label,disabled:0===t.formInline.call_status}},[t._v(t._s(e.value))])}))],1),a("div",{staticClass:"duration"},[a("i",{staticClass:"vertical-line"}),a("span",[t._v("通话时长")]),a("el-checkbox-group",{model:{value:t.formInline.duration,callback:function(e){t.$set(t.formInline,"duration",e)},expression:"formInline.duration"}},[a("el-checkbox",{attrs:{label:"1",disabled:0===t.formInline.call_status}},[t._v("5-10秒")]),a("el-checkbox",{attrs:{label:"2",disabled:0===t.formInline.call_status}},[t._v("超过30秒")])],1)],1),a("el-button",{staticClass:"search",attrs:{type:"primary"},on:{click:t.onSearch}},[t._v("搜索")])],1)])],1),a("hr",{staticClass:"horizontal-line"}),a("div",{staticClass:"table_btn"},[a("el-button",{attrs:{type:"primary",icon:t.starticon,disabled:2===t.task_status},on:{click:t.taskstatusAction}},[t._v(t._s(t.startBtn))]),a("div",{staticClass:"float-right"},[a("el-button",{attrs:{type:"primary",icon:"el-icon-call"},on:{click:t.reCallaction}},[t._v("重新呼叫")]),a("el-button",{staticClass:"btn-error",attrs:{icon:"el-icon-close",type:"info"},on:{click:t.deleteClues}},[t._v("批量删除")]),a("el-button",{ref:"exportList",attrs:{icon:"el-icon-export",type:"info"},on:{click:function(e){t.exportAction(1)}}},[t._v("导出客戶列表")]),a("el-button",{ref:"exportText",attrs:{icon:"el-icon-exporttxt",type:"info",disabled:0===t.formInline.call_status||3===t.formInline.call_result},on:{click:function(e){t.exportAction(2)}}},[t._v("导出通话文本")])],1)],1),a("div",{staticClass:"table-clues"},[a("el-table",{ref:"cluesTable",attrs:{data:t.CluesList},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"45"}}),a("el-table-column",{attrs:{label:"序号",width:"70"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s((t.currentpage-1)*t.currentlimit+(e.$index+1)))])]}}])}),a("el-table-column",{attrs:{label:"客户号码",prop:"mobile"}}),a("el-table-column",{attrs:{label:"联系进度",prop:"record_count"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.record_count?t._e():a("span",[t._v("未联系")]),e.row.record_count>0?a("span",[t._v("已联系")]):t._e()]}}])}),a("el-table-column",{attrs:{label:"话术名称",prop:"script_title"}}),a("el-table-column",{attrs:{label:"呼叫时间",prop:"call_time","min-width":"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.record_count?a("span",[t._v(t._s(t._f("formatTime")(e.row.call_time)))]):t._e()]}}])}),a("el-table-column",{attrs:{label:"通话时长",prop:"duration"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.record_count?a("span",[t._v(t._s(t._f("formatSecond")(e.row.duration)))]):t._e()]}}])}),a("el-table-column",{attrs:{label:"联系结果",prop:"call_result"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.record_count&&1===e.row.call_result?a("span",[t._v("接听后挂掉")]):t._e(),e.row.record_count&&2===e.row.call_result?a("span",[t._v("通话成功")]):t._e(),e.row.record_count&&3===e.row.call_result?a("span",[t._v("未接听")]):t._e()]}}])}),"1"===t.EpInfo.enterprise_type?a("el-table-column",{attrs:{label:"转为人工坐席",prop:"manual_status"},scopedSlots:t._u([{key:"default",fn:function(e){return[1===e.row.manual_status?a("span",{staticClass:"error-text"},[t._v("转接失败")]):t._e(),2===e.row.manual_status?a("span",{staticClass:"success-text"},[t._v("转接成功")]):t._e()]}}])}):t._e(),a("el-table-column",{attrs:{label:"意向性",prop:"intention"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.record_count?a("span",[t._v(t._s(t.intentionValue(e.row)))]):t._e()]}}])}),a("el-table-column",{attrs:{label:"标签",prop:"label"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.record_count?a("span",[t._v(t._s(e.row.label))]):t._e()]}}])}),a("el-table-column",{attrs:{label:"呼叫次数",prop:"record_count"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.record_count?a("span",[t._v("第"+t._s(e.row.record_count)+"次")]):t._e()]}}])}),a("el-table-column",{attrs:{label:"操作",prop:"action","class-name":"visible-cell"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text",icon:"el-icon-detail",disabled:!e.row.record_count||3===e.row.call_result},on:{click:function(a){t.recordDetailAction(e.row)}}})]}}])})],1)],1)])]),a("recordDetail",{attrs:{cluedata:t.cluedata,recordDetailShow:t.recordDetailShow},on:{closeRecordDetail:t.closeRecordDetail}}),t.taskCluesList&&t.taskCluesList.length>0?a("el-pagination",{attrs:{"current-page":t.currentpage,"page-size":t.currentlimit,background:"","page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next",total:t.taskCluesListTotal},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}}):t._e()],1)},[],!1,null,null,null));e.default=$.exports},"T6f/":function(t,e,a){"use strict";var i=a("FZ/W");a.n(i).a},WQji:function(t,e,a){"use strict";var i={name:"toop-tip",props:{content:String},data:function(){return{show:!1}},methods:{toggleTip:function(t){this.show=t}}},n=(a("CoYH"),a("KHd+")),s=Object(n.a)(i,function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"tool-tip"},[e("span",{staticClass:"tool-tip-icon"}),e("div",{staticClass:"tool-tip-content"},[this._t("default",[this._v("\n        "+this._s(this.content)+"\n      ")])],2)])},[],!1,null,null,null);e.a=s.exports},n5dg:function(t,e,a){"use strict";var i=a("FNce");a.n(i).a},uMWL:function(t,e,a){}}]);