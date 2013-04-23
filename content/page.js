/* 页面重组插件
 * 收集采集功能
 * 描述：用户在网页上采集所需要的区域，然后保存收集起来，可以写批注，最终应该有一个收集列表（这跟snagit屏幕截图很相似，只是现在变成网页内容截取）
 * 步骤：
 * 1.选择模块（模仿Firebug 选择区域）
 * 2.预览模块（标题、内容、批注）
 * 3.保存模块（本地存储再上传数据到服务器）
 * 2013.4.13 
 * */
/* 这是选择框的模式 */
//管理删除元素的实例化
(function($) {
    //选择模块
    var Collect = {
        keys : {
           "V_+" : 61,
           "V_-" : 45
        },
        _mods : {},
        build : function() {
            var context = this.doc,
                $b = this.$b;
            if(undefined === $b){
                $b = {};
                $b.l = $('<div class="box-shadow-left box-shadow"/>').css({
                    position : 'absolute',
                    zIndex : '9999',
                    boxShadow : '-1px 0 1px 1px #1B8FC0',
                    width: 0
                });
                $b.r = $('<div class="box-shadow-right box-shadow"/>').css({
                    position : 'absolute',
                    zIndex : '9999',
                    boxShadow : '1px 0 1px 1px #1B8FC0',
                    width: 0
                });
                $b.t = $('<div class="box-shadow-top box-shadow"/>').css({
                    position : 'absolute',
                    zIndex : '9999',
                    boxShadow : '0 -1px 1px 1px #1B8FC0',
                    height: 0
                });
                $b.b = $('<div class="box-shadow-bottom box-shadow"/>').css({
                    position : 'absolute',
                    zIndex : '9999',
                    boxShadow : '0 1px 1px 1px #1B8FC0',
                    height: 0
                });

                this.$b = $b;
            }
        
            $('body',context).append($b.l,$b.r,$b.t,$b.b);
            return $b;
        },
        off : function() {
           var context = this.doc; 
           $('html',context).undelegate('._v');
          // this.unbindKey();
           return this;
        },
        on : function($b) {
            var $bl = $b.l,
                $bb = $b.b,
                $bt = $b.t,
                $br = $b.r;
            var $self = this,
                context = $self.doc;
            $self.dy_ele = jQuery();
            //flag标识着是否为人工触发，为了解决放大缩小问题
            $('html',context).delegate('*:not(.box-shadow)', 'mousemove._v', function(e,flag) {
                var $ele,
                    off,
                    h,
                    w;
                //!设置当前选择的元素，用于便捷操作
                if($self.dy_ele === this) return false;
                $self.dy_ele = this;
                if(!flag){
                    $self.tmp_store = [];
                }
                $ele = $(this);
                off = $ele.offset();
                h = $ele.outerHeight();
                w = $ele.outerWidth();
                $bl.offset(off).height(h);
                $br.offset({
                    'left' : parseInt(off.left) + parseInt(w),
                    'top' : parseInt(off.top)
                }).height(h);
                $bt.offset(off).width(w);
                $bb.offset({
                    'left' : parseInt(off.left),
                    'top' : parseInt(off.top) + parseInt(h)
                }).width(w);
                return false;
            }).delegate('*:not(.box-shadow)','click._v',function(e) {
                /* 下面进入操作的命令 进入编辑状态消失变为编辑框 */
                //找到模块
                $self.stop();
                var EleOper = $self._mods['DetailOper'];
                //构造当前编辑元素
                var $o_ele = new EleOper($(this));
                //将当前编辑保存
                $self.addEleOp($o_ele);
                $o_ele.run(function(){
                    $self.run();
                });
                return false;
            });
            this.bindKey();
        },
        addEleOp : function(op) {
           this.opers.push(op);
           return this;
        },
        getOps : function() {
            var opers = this.opers,
                o = [];
            //alert(opers.length);
            for(var i=0,len=opers.length;i<len;i++){
                o.push(opers[i].getOp());
            }
            return o;
        },
        bindKey :function() {
           var win = this.win, 
               KEYS = this.keys,
               $self = this;
           $(win).bind('keypress',function(e) {
               var $ele,EO,which,tmp_store,$pr;
               KEYS = $self.keys;
               $ele = $($self.dy_ele);
               //记录操作前的元素，防止放大缩小后丢失
               which = e.which;
               tmp_store = $self.tmp_store;

               switch(which){
                   case KEYS['V_+'] :
                      tmp_store.push($ele);
                      $pr = $ele.parent();
                      $pr.trigger('mousemove._v',true);
                   break;
                   case KEYS['V_-'] : 
                      $pr = tmp_store.pop();
                      if($pr){
                        $pr.trigger('mousemove._v',true);
                      }
                      break; 
                   default:
                   EO = $self._mods['SimpleOper'];
                   $self.addEleOp(new EO($ele,e.which));
                   break;
               }
               return false;
           });
        },
        unbindKey : function() {
            var win = this.win;
            $(win).unbind('keypress');
            return this;
        },
        //选择启动 初始化框
        run : function(){
            var $b = this.build();
            this.on($b);
            return this;
        },
        //选择停止 删除框与事件
        stop : function() {
            this.off();
            for(var p in this.$b){
                this.$b[p].remove();
            }
        }
    };
    function Collect_Action(win,doc){
        this.win = win;
        this.doc = doc;
        this.dy_ele = null;
        this.tmp_store = [];              //放大缩小时候用保留状态
        this.opers = [];                 //每个页面选择器保存操作
        /* 元素操作构造器 */
        this._mods['DetailOper'] = window._Vm.get('DetailOper');
        this._mods['SimpleOper'] = window._Vm.get('SimpleOper');
        return this;
    }
    Collect_Action.prototype = Collect;
    /* 管理所有的Collect实例，以及保存的处理 */
    var Collect_Manage = {
        _N : 0,                                             //标记选择实例化数量
        cols : [],
        _mods : {},
        pageConfig : [],
        /* 模块 */
        extend : function() {
            var args = arguments;
            for(var i=0,len=args.length;i<len;i++) {
                var mod = args[i];
                this._mods[mod] = window._Vm.get(mod);
            }
            return this;
        },
        getMod : function(name) {
            var mod = this._mods[name];
            if(!mod) {
                alert('没有模块 ： ' + name);
                return this;
            };
            return this._mods[name];
        },
        onPageLoad : function() {
            /* 页面加载或者切换tab时 判断是否为编辑页面 */
            var doc = this.getDoc();
            if(doc._v_i === undefined){
                this.closePanel();
            }else{
                this.showPanel();
            }
        },
        apply: function() {
            var pconfig = this.pageConfig,
                doc = this.getDoc(),
                href = doc.location.href,
                css = null, 
                pc = null,
                idx = 0;
            //存在预览对象
            var obj = top._previewObj;
            if(obj){
                dump('ag');
                var name = obj.name,
                    css = obj.css,
                    link = obj.link;
                this.inCss(doc,css);
                document.getElementById('urlbar').value = name + ':' + link;
            }else{
                dump('three');
                //if(doc._vie) return;
                for(var i=0,len=pconfig.length;i<len;i++){
                    pc = pconfig[i];
                    if(pc['href'] === href && pc['is_default']){
                        css = pc['cs'];
                        this.inCss(doc,css);
                        document.getElementById('urlbar').value = pc['name']  + ':' + href;
                        doc._v_name = pc['name'];
                    }
                }
                //doc._vie = true;
            }
            return this;
        },
        applyLoc : function() {
           var doc = this.getDoc(),
                href = doc.location.href,
                name = doc._v_name || '';
           if(doc._v_name){
               document.getElementById('urlbar').value = name + ':' + href;
           }
           return this;
        },
        //预览页面
        loadPage : function(name,link) {
            var win = top;
            win._previewObj = {
                name : name,
                link : link,
                css :  this.getCss(name,link)
            };

            gBrowser.selectedTab = gBrowser.addTab(link);
            var newBrowserTab = gBrowser.getBrowserForTab(gBrowser.selectedTab);
            newBrowserTab.addEventListener('load',function() {
                newBrowserTab.contentDocument._v_name = name;
                top._previewObj = null;
                dump(true);
            },true);

        },
        getCss : function(name,href) {
            var pcs = this.pageConfig,
                css = null,
                pc = null;
            for(var i=0,len=pcs.length;i<len;i++){
                pc = pcs[i];
                if(pc['href'] === href && pc['name'] === name){
                    css = pc['cs'];
                    break;
                }
            }
            return css;
        },
        inCss : function(doc,css) {
           var selector = '',
                cssText = '',
                arr = [];
           for(var i=0,len=css.length;i<len;i++){
                var ele = css[i],
                    sys = ele.styles,
                    p = '',
                    tx = '';
                selector = ele.selector.selector + ' > *:nth-child(' + (ele.selector.idx + 1) + ')';
                for(p in sys){
                    tx += p + ':' + sys[p] + '!important;';
                }
                arr.push(selector + '{' + tx + '}');
            };
            this.addStyle(doc,arr.join(''));
           return this;
        },
        addStyle : function(doc,styles) {
            var styleEle,stylesheet;
            var head = doc.getElementsByTagName('head')[0],
                styleEle = doc.createElement('style');
            head.insertBefore(styleEle,head.firstChild);
            styleEle.innerHTML = styles;
            return this;
        },
        /* 控制tabs动向，以及页面刷新 */
        init : function() {
          var $self = this;
          window._previewObj = null;
          this.extend('IO','SimpleOper');
          this.read();
          var container = gBrowser.tabContainer;
          //标签属性变化触发事件
          container.addEventListener("TabAttrModified", function(e) {
            $self.applyLoc();
            $self.onPageLoad();
          }, false);

        window.addEventListener("load", function(){myExtension.init()}, false);
        //打开浏览器时执行 myExtension.init()
        var myExtension = {
            init: function() {
                var appcontent = document.getElementById("appcontent");
                //appcontent是所有页面父节点的ID
                if(appcontent)
                    appcontent.addEventListener("DOMContentLoaded", this.onPageLoad, true);
                    //DOMContentLoaded事件触发myExtension.onPageLoad
            },
            onPageLoad: function(e) {
                $self.apply();
            }
        }
          return this;
        },
        run : function() {
            var doc = this.getDoc(),
                win = this.getWin();
            if(undefined !== doc._v_i ) {
                alert(doc._v_i);
                alert('已启动');
                return;
            }
            var col = new Collect_Action(win,doc);
            col.run();
            //添加标记
            doc._v_i = this._N;
            //添加到队列中
            this.add(this._N,col);
            //显示面板
            this.showPanel();
            return this;
        },
        add : function(idx,item) {
            this.cols[idx] = item;
            this._N++;
        },
        remove : function(idx) {
            this.cols[idx] = null;
        },
        find : function(idx) {
            var cls = this.cols;
            return cls[idx];
        },
        quit : function() {
            var doc = this.getDoc(),
                idx = doc._v_i;
            var col = this.find(idx);
            col.stop();
            //删除选择器
            this.remove(idx);
            //关闭面板
            this.closePanel();
            delete doc._v_i;
            return this;
        },
        getDoc: function() {
           return gBrowser.selectedBrowser.contentDocument;
        },
        getWin : function() {
           return gBrowser.contentWindow; 
        },
        // 编辑操作 
        closePanel : function() {
            var v_nav_bar = document.getElementById('v_nav_bar');
            v_nav_bar.setAttribute('hidden',true);
        },
        showPanel : function() {
            var v_nav_bar = document.getElementById('v_nav_bar');
            v_nav_bar.setAttribute('hidden',false);
        },
        // IO 操作 
        save : function(f_name,is_default) {
            var context = this.getDoc(),
                idx = context._v_i,
                col = null,
                cssText = null,
                href = '',
                o = null,
                pc = this.pageConfig;
            col = this.find(idx);
            cssText = col.getOps();     
            href = context.location.href;
            o = {
                'name' : f_name,
                'is_default' : is_default,
                'href' : href,
                'cs' : cssText
            };
            this.pageConfig.push(o);
            var filename = 'collect_save.txt',
                m_IO = this.getMod('IO');
            o = $.toJSON(pc);
            //alert(o);
            m_IO.save(o,filename);
            //alert('保存了');
            this.refresh();
        },
        //刷新列表
        refresh : function() {
           var $icon = $('.icon.sel');
           $icon.trigger('click');
        },
        read : function() {
           var filename = 'collect_save.txt',
                m_IO = this.getMod('IO');
           var pc = m_IO.read(filename);
           //alert('读取：\n' + pc);
           pc = $.parseJSON(pc);
           if(!pc || typeof pc != 'object'){
                pc = [];
           }else if(!$.isArray(pc)){
                pc = [pc];
           }
           this.pageConfig = pc;
        }
    };
    Collect_Manage.init();
    window._Vm.set('Collect_Manage',Collect_Manage);
}(jQuery));
