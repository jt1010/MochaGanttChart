/**
 * Created by mocha on 2017/2/23.
 */
function GanttChart(el,data,config) {
    var GanttChart = {};
    GanttChart.data = {
        sourcesData: data,
        oneDayTime: 86400000,
        timeParams: '',
        listParams: '',
        typeParams: ''
    };
    GanttChart.dom = {
        container: el,
        Gantt: '',
        GLegend: '',
        GTimeAxis: '',
        GList: '',
        GMain: '',
        scrollT: '',
        scrollL: '',
        scrollM: '',
        TimeAxis: '',
        mUl: '',
        wUl: '',
        iUl: '',
        GTable: ''
    };
    GanttChart.config = {
        GanttW: config.GanttW || 1086,
        GanttH: config.GanttH || 600,
        GLegendW: config.GLegendW || 300,
        GLegendH: config.GLegendH || 70,
        weekW: config.weekW || 70,
        weekC: config.weekC || 3,
        itemH: config.itemH || 50,
        color:{
            "project": "#4F99E9",
            "stage":"#54CAAA",
            "task":"#F26A59"
        }
    };
    GanttChart.setting = function (obj) {
        for(var k in obj){
            if(this.config.hasOwnProperty(k))
                this.config[k] = obj[k];
        }
    };
    GanttChart.functions = {
        createGanttDoms: function () {
            var config = GanttChart.config,
                dom = GanttChart.dom,
                tools = GanttChart.tools;
            dom.container.innerHTML = '';
            dom.Gantt = tools.CandA('div',{'id':'Gantt','class':'Gantt'},dom.container);
            dom.GLegend = tools.CandA('div',{'id':'Gantt-legend','class':'Gantt-legend'},dom.Gantt);
            dom.GTimeAxis = tools.CandA('div',{'id':'Gantt-time-axis','class':'Gantt-time-axis'},dom.Gantt);
            dom.GList = tools.CandA('div',{'id':'Gantt-list','class':'Gantt-list'},dom.Gantt);
            dom.GMain = tools.CandA('div',{'id':'Gantt-main','class':'Gantt-main'},dom.Gantt);
            dom.scrollT = tools.CandA('div',{'class':'scroll-box'},dom.GTimeAxis);
            dom.scrollL = tools.CandA('div',{'class':'scroll-box'},dom.GList);
            dom.scrollM = tools.CandA('div',{'class':'scroll-box'},dom.GMain);
            dom.TimeAxis = tools.CandA('div',{'class':'time-axis'},dom.scrollT);
            dom.mUl = tools.CandA('ul',{'class':'month'},dom.TimeAxis);
            dom.wUl = tools.CandA('ul',{'class':'week'},dom.TimeAxis);
            dom.iUl = tools.CandA('ul',{'id':'name-list','class':'items'},dom.scrollL);
            dom.GTable = tools.CandA('div',{'id':'Gantt-table','class':'Gantt-table'},dom.scrollM);
            tools.setDomStyle(dom.Gantt,{
                'width':config.GanttW+'px',
                'height':config.GanttH+'px'
            });
            tools.setDomStyle(dom.GLegend,{
                'width':config.GLegendW+'px',
                'height':config.GLegendH+'px'
            });
            tools.setDomStyle(dom.GTimeAxis,{
                'width':(config.GanttW - config.GLegendW)+'px',
                'height':config.GLegendH+'px',
                'left':config.GLegendW+'px'
            });
            tools.setDomStyle(dom.scrollT,{
                'height':(config.GLegendH+20)+'px'
            });
            tools.setDomStyle(dom.TimeAxis,{
                'height':config.GLegendH+'px'
            });
            tools.setDomStyle(dom.mUl,{
                'height':(config.GLegendH*0.6)+'px'
            });
            tools.setDomStyle(dom.wUl,{
                'height':(config.GLegendH*0.4)+'px'
            });
            tools.setDomStyle(dom.GList,{
                'width':config.GLegendW+'px',
                'height':(config.GanttH - config.GLegendH)+'px',
                'top':config.GLegendH+'px'
            });
            tools.setDomStyle(dom.scrollL,{
                'height':(config.GanttH - config.GLegendH)+'px',
                'width':(config.GLegendW+20)+'px'
            });
            tools.setDomStyle(dom.iUl,{
                'width':config.GLegendW+'px'
            });
            tools.setDomStyle(dom.GMain,{
                'width':(config.GanttW - config.GLegendW)+'px',
                'height':(config.GanttH - config.GLegendH)+'px',
                'top':config.GLegendH+'px',
                'left':config.GLegendW+'px'
            });
        },
        drawGanttLegend: function () {
            var dom = GanttChart.dom,
                data = GanttChart.data,
                config = GanttChart.config,
                type = data.typeParams;
            var sLegendW = (config.GLegendW-41)/type.count,
                sLegendH = config.GLegendH-41;
            var lHtml ='';
            var legendStyle = 'width:'+sLegendW+'px;'+
                'height:'+sLegendH+'px;'+
                'line-height:'+sLegendH+'px;';
            for(var t in type.types){
                var iconBg = config.color[type.types[t]],
                    iconH = sLegendH/3,
                    iconW = (sLegendW/3-5);
                var iconStyle = 'background-color:'+iconBg+';'+
                    'height:'+iconH+'px;'+
                    'width:'+iconW+'px;'+
                    'margin-top:'+iconH+'px;';
                if(type.types[t]=='milepost'){
                    iconStyle = '';
                }
                lHtml += '<div class="legend legend-'+type.types[t]+'" style="'+legendStyle+'">' +
                    '<span class="legend-icon" style="'+iconStyle+'"></span>' +
                    '<span class="legend-text">'+t+'</span>' +
                    '</div>';
            }
            dom.GLegend.innerHTML = lHtml;
        },
        drawGanttTimeAxis: function () {
            var dom = GanttChart.dom,
                data = GanttChart.data,
                config = GanttChart.config,
                tools = GanttChart.tools,
                t = data.timeParams;
            if((t.totalWeeks * config.weekW)<(config.GanttW - config.GLegendW)){
                config.weekW = (config.GanttW - config.GLegendW)/t.totalWeeks;
                if(config.weekW>100){
                    config.weekC = 7;
                }
            }
            var wHtml = '',mHtml = '';
            for(var y=t.startYear;y<=t.endYear;y++){
                var sM = y==t.startYear?t.startMonth:1,
                    eM = y==t.endYear?t.endMonth:12;
                for(var m=sM;m<=eM;m++){
                    var fixed = y+'-'+m,
                        fixedWidth = t.monthListFix[fixed]*(config.weekW/7) + 'px',
                        tm = m<10?'0'+m:m;
                    mHtml +='<li _fixed="'+fixedWidth+'" style="width: '+fixedWidth+';height: '+(config.GLegendH*0.6)+'px;line-height: '+(config.GLegendH*0.6)+'px" title="'+y+'年'+tm+'月">'+y+'-'+tm+'</li>';
                }
            }
            for(var w=0;w<t.totalWeeks;w++){
                var weekday = new Date(t.startDay + (w*7*data.oneDayTime)),
                    weekText = (weekday.getMonth()+1)+'.'+(weekday.getDate());
                wHtml += '<li style="width: '+config.weekW+'px;height: '+(config.GLegendH*0.4)+'px;line-height: '+(config.GLegendH*0.4)+'px">'+weekText+'</li>';
            }
            dom.wUl.innerHTML = wHtml;
            dom.mUl.innerHTML = mHtml;
            tools.setDomStyle(dom.TimeAxis,{'width':t.totalWeeks * config.weekW +'px'});
        },
        drawGanttList: function () {
            var dom = GanttChart.dom,
                data = GanttChart.data,
                config = GanttChart.config;
            var listHtml = '';
            createGanttList(data.sourcesData);
            dom.iUl.innerHTML = listHtml;
            function createGanttList(d,f) {
                for(var i in d){
                    var item = d[i];

                    var paddingL = item.type == 'project'?20:item.type == 'stage'?40:item.type == 'task'?60:0;
                    var style = 'height:'+config.itemH+'px;'+
                        'line-height:'+config.itemH+'px;'+
                        'padding-left:'+paddingL+'px';
                    var iconHtml = '<i class="icon-'+item.type+'"></i>';
                    if(item.type == 'stage'){
                        iconHtml = '<em class="hideItem"></em>' + iconHtml;
                        var fID = item.id;
                        f = 'top';
                    }else if(item.type == 'project'){
                        f = 'top';
                    }else{
                        var fID = f;
                    }
                    var liHtml = '<li class="item" style="'+style+'" _id="'+item.id+'" _for="'+f+'">'+iconHtml+item.name+'</li>';
                    listHtml += liHtml;
                    if(item.subItem.length>0){
                        createGanttList(item.subItem,fID);
                    }
                }
            }
        },
        drawGanttTable: function () {
            var dom = GanttChart.dom,
                data = GanttChart.data,
                config = GanttChart.config,
                tools = GanttChart.tools;
            var tableHtml = '';
            createGanttTable(data.sourcesData,data.timeParams);
            dom.GTable.innerHTML = tableHtml;
            tools.setDomStyle(dom.GTable,{'width':data.timeParams.totalWeeks * config.weekW +'px'});
            function createGanttTable(d,t) {
                for(var i in d){
                    var item = d[i];
                    var trHtml = '<div style="height:'+config.itemH+'px;" class="Gantt-tr" _for="'+item.id+'">';
                    for(var j=0;j<t.totalWeeks;j++){
                        trHtml += '<div class="Gantt-td" style="width:'+config.weekW+'px;height: '+config.itemH+'px;">';
                        for(var c=0;c<config.weekC;c++){
                            trHtml += '<span style="width:'+config.weekW/config.weekC+'px;"></span>';
                        }
                        trHtml += '</div>';
                    }
                    trHtml += '</div>';
                    tableHtml += trHtml;
                    if(item.subItem.length>0){
                        createGanttTable(item.subItem,t);
                    }
                }
            }
        },
        drawGantt: function () {
            var data = GanttChart.data,
                config = GanttChart.config,
                tools = GanttChart.tools;
            var trList = document.getElementsByClassName('Gantt-tr');
            for(var i=0;i<trList.length;i++){
                var _for = trList[i].getAttribute('_for');
                var curObj = data.listParams[_for];
                var left = (curObj.startTime - data.timeParams.startDay)/data.oneDayTime * config.weekW/7,
                    width = (curObj.endTime - curObj.startTime)/data.oneDayTime * config.weekW/7;
                var style = 'width:'+width+'px;' +
                    'left:'+left+'px';
                var tips = curObj.name + '\n开始时间：'+
                    tools.getFormatDate(curObj.startTime,'-')+'\n结束时间：'+
                    tools.getFormatDate(curObj.endTime,'-');
                var attrObj = {
                    'class': 'Gantt-bar Gantt-'+curObj.type,
                    'style': style,
                    '_tips': tips
                };
                tools.CandA('div',attrObj,trList[i]);
                if(curObj.milepost.length>0){
                    for(var m in curObj.milepost){
                        var mstyle = 'left:'+(curObj.milepost[m].startTime - data.timeParams.startDay)/data.oneDayTime * config.weekW/7+'px';
                        var mtips = curObj.milepost[m].name+'\n计划达成时间：'+tools.getFormatDate(curObj.milepost[m].startTime,'-');
                        var mAttr = {
                            'class': 'Gantt-milepost',
                            'style': mstyle,
                            '_tips': mtips
                        };
                        tools.CandA('div',mAttr,trList[i]);
                    }
                }
            }
        },
        bindGanttTableEvent: function () {
            var dom = GanttChart.dom,
                config = GanttChart.config;
            var nameList = document.getElementById('name-list').getElementsByTagName('li');
            var tableTr = document.getElementById('Gantt-table').getElementsByClassName('Gantt-tr');
            dom.GList.onclick = function (e) {
                var targetName = e.target.tagName.toLowerCase();
                var classType =  e.target.getAttribute('class');
                var _this = e.target;
                var fId = _this.parentNode.getAttribute('_id');
                if(targetName == 'em'&& classType == 'hideItem'){
                    _this.removeAttribute('class');
                    _this.setAttribute('class','showItem');
                    for(var i=0;i<nameList.length;i++){
                        if(nameList[i].getAttribute('_for') == fId){
                            nameList[i].style.height = 0;
                            nameList[i].style.borderBottom = 'none';
                            var id = nameList[i].getAttribute('_id');
                            for(var j=0;j<tableTr.length;j++){
                                if(tableTr[j].getAttribute('_for') == id){
                                    tableTr[j].style.height = 0;
                                }
                            }
                        }
                    }
                }else if(targetName == 'em'&& classType == 'showItem'){
                    for(var i=0;i<nameList.length;i++){
                        if(nameList[i].getAttribute('_for') == fId){
                            nameList[i].style.height = config.itemH + 'px';
                            nameList[i].style.borderBottom= '1px #D8D8D8 solid';
                            var id = nameList[i].getAttribute('_id');
                            for(var j=0;j<tableTr.length;j++){
                                if(tableTr[j].getAttribute('_for') == id){
                                    tableTr[j].style.height = config.itemH + 'px';
                                }
                            }
                        }
                    }
                    _this.removeAttribute('class');
                    _this.setAttribute('class','hideItem');
                }
            }
        },
        bindScrollLinkage: function () {
            var dom = GanttChart.dom;
            dom.scrollM.onscroll = function () {
                var sx, sy;
                sy = dom.scrollM.scrollTop;
                sx = dom.scrollM.scrollLeft;
                dom.scrollL.scrollTop = sy;
                dom.scrollT.scrollLeft = sx;
            }
        },
        bindGanttBarTips: function () {
            var dom = GanttChart.dom;
            var GanttX = dom.Gantt.offsetLeft - document.documentElement.scrollLeft,
                GanttY = dom.Gantt.offsetTop - document.documentElement.scrollTop;
            dom.GTable.onmouseover = function (e) {
                var targetName = e.target.tagName.toLowerCase();
                var tipText = e.target.getAttribute('_tips');
                if(targetName == 'div'&& tipText!==null){
                    var orther = document.getElementById('Gantt-tips');
                    if(orther){
                        orther.parentNode.removeChild(orther);
                    }
                    var tip = document.createElement('div');
                    tip.setAttribute('class','Gantt-tips');
                    tip.setAttribute('id','Gantt-tips');
                    tip.innerText = tipText;
                    var style = 'left:'+(e.pageX - GanttX + 5)+'px;top:'+(e.pageY - GanttY + 5)+'px;';
                    tip.setAttribute('style',style);
                    dom.Gantt.appendChild(tip);
                }else{
                    var tip = document.getElementById('Gantt-tips');
                    if(tip){
                        tip.parentNode.removeChild(tip);
                    }
                }
            };
            dom.GTable.onmouseleave = function () {
                var tip = document.getElementById('Gantt-tips');
                if(tip){
                    tip.parentNode.removeChild(tip);
                }
            };
            dom.GTable.onmousemove = function (e) {
                var targetName = e.target.tagName.toLowerCase();
                var tipText = e.target.getAttribute('_tips');
                if(targetName == 'div'&& tipText!==null){
                    var tip = document.getElementById('Gantt-tips');
                    var style = 'left:'+(e.pageX - GanttX + 5)+'px;top:'+(e.pageY - GanttY + 5)+'px;';
                    tip.setAttribute('style',style);
                }
            };
        },
        setTimeParams: function () {
            var data = GanttChart.data,
                tools = GanttChart.tools;
            var timeZone = {
                min: data.sourcesData[0].startTime,
                max: 0
            };
            compareTime(data.sourcesData);
            var start = new Date(timeZone.min),
                end = new Date(timeZone.max),
                startDay = start.getTime() - start.getDay()*data.oneDayTime,
                endDay = end.getTime() + (6 - end.getDay())*data.oneDayTime,
                totalDays = (endDay - startDay)/data.oneDayTime,
                totalWeeks = Math.ceil(totalDays/7),
                monthListFix = tools.getMonthlyDays(startDay,endDay);
            data.timeParams = {
                startYear : start.getFullYear(),
                endYear : end.getFullYear(),
                startMonth : new Date(startDay).getMonth() + 1,
                endMonth : new Date(endDay).getMonth() + 1,
                startDate : start.getDate(),
                endDate : end.getDate(),
                startDay: startDay,
                endDay: endDay,
                totalDays: totalDays,
                totalWeeks: totalWeeks,
                monthListFix: monthListFix
            };
            function compareTime(d) {
                for(var i in d){
                    if(timeZone.min > d[i].startTime)
                        timeZone.min = d[i].startTime;
                    if(timeZone.max < d[i].endTime)
                        timeZone.max = d[i].endTime;
                    if(d[i].subItem.length>0)
                        compareTime(d[i].subItem);
                    if(d[i].milepost.length>0)
                        compareTime(d[i].milepost);
                }
            }
        },
        setListParams: function () {
            var data = GanttChart.data,
                tools = GanttChart.tools;
            var listParams = {};
            tools.getListParam(data.sourcesData,listParams);
            data.listParams = listParams;
        },
        setTypeParams: function () {
            var data = GanttChart.data,
                tools = GanttChart.tools;
            var typeParams = {
                count:0,
                types:{}
            };
            tools.getTypeParam(data.sourcesData,typeParams);
            data.typeParams = typeParams;
        }
    };
    GanttChart.tools = {
        CandA: function(t,o,f) {
            var nd = document.createElement(t);
            for(var i in o){
                nd.setAttribute(i,o[i]);
            }
            f.appendChild(nd);
            return nd;
        },
        setDomStyle: function (d,s) {
            for(var i in s){
                d.style[i] = s[i];
            }
        },
        getListParam: function (d,obj) {
            for(var i in d){
                var item = d[i];
                var key = item.id;
                obj[key] = {
                    startTime: '',
                    endTime: '',
                    type: '',
                    name: '',
                    milepost:''
                };
                obj[key].startTime = item.startTime;
                obj[key].endTime = item.endTime;
                obj[key].type = item.type;
                obj[key].name = item.name;
                obj[key].milepost = item.milepost;
                if(item.subItem.length>0){
                    this.getListParam(item.subItem,obj);
                }
            }
        },
        getTypeParam: function (d,obj) {
            for(var i in d){
                var item = d[i];
                var key = item.typeName;
                if(obj.types[key]==undefined){
                    obj.count += 1;
                }
                obj.types[key] = item.type;
                if(item.subItem.length>0){
                    this.getTypeParam(item.subItem,obj);
                }
                if(item.milepost.length>0){
                    this.getTypeParam(item.milepost,obj);
                }
            }
        },
        getMonthlyDays: function (s,e) {
            var arr = [];
            for(var i=s;i<e;i+= GanttChart.data.oneDayTime){
                var t = new Date(i),
                    key = t.getFullYear() + '-' + (t.getMonth()+1);
                if(arr[key]==null||arr[key]==undefined){
                    arr[key]=1;
                }else{
                    arr[key]++;
                }
            }
            return arr;
        },
        getFormatDate: function (time,Separator) {
            var t = new Date(time);
            var y = t.getFullYear(),
                m = (t.getMonth()+1)<10?'0'+(t.getMonth()+1):(t.getMonth()+1),
                d = t.getDate()<10?'0'+t.getDate():t.getDate();
            return y+Separator+m+Separator+d;
        }
    };
    GanttChart.init = function () {
        var func = this.functions;
        func.createGanttDoms();
        func.setTimeParams();
        func.setListParams();
        func.setTypeParams();
        func.drawGanttLegend();
        func.drawGanttTimeAxis();
        func.drawGanttList();
        func.drawGanttTable();
        func.bindScrollLinkage();
        func.drawGantt();
        func.bindGanttBarTips();
        func.bindGanttTableEvent();
    };
    return GanttChart;
}