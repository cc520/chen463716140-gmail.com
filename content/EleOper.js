/* 操作元素管理
 * 2013.4.18
 * 拥有保存修改元素，最后生成样式代码，管理新添加的元素的代码
 * */
(function($) {
    /* 基本方法 */
    var OPER = {
        //运用样式并保存状态
        css : function(obj) {
           this.$ele.css(obj);
           this.storeCss(obj);
           return this;
        },
        //获得选择器
        getSelector : function() {
           var $ele = null,
                $prs = null,
                selector = '',
                idx = 0;
           $ele = this.$ele,
           $prs = $ele.parents(),
           idx = $ele.parent().children().index($ele);
           selector =  this.toSelector($prs);
           return {
                'selector' : selector,
                'idx' : idx
           };
        },
        toSelector : function($prs) {
            var o = [],
                pr = null,
                tag = '',
                sel = '',
                idx = 0;
            for(var len=$prs.length,i=len-1;i>-1;i--){
               pr =  $prs.get(i);
               tag = pr.tagName;
               sel = pr.id ? '#' + pr.id : pr.className ? '.' + pr.className.slice(0,(idx = pr.className.indexOf(' ')) === -1 ? pr.className.length : idx) : ''; 
               o.push(tag + sel);
            }
            return o.join(' > ');
        },
        storeCss : function(style) {
           $.extend(this.styles,style);
           return this;
        },
        //取得当前元素操作
        getOp : function() {
           var selector = this.getSelector(),
                styles = this.styles;
           return {
                'selector' : selector,
                'styles' : styles
           };
        }
    };
    function SimpleOper($ele,oper){
       this.$ele = $ele;
       this.styles = {};
       this.apply(oper);
       return this;
    };
    SimpleOper.prototype = {
        simpleKey : {
           V_C : 99,
           V_D : 100,
           V_F : 102,
           V_P : 112,
           V_T : 116,
           V_H : 104
        },
        remove : function() {
            this.css({
                display : 'none'
            });
            this.$ele.parent().trigger('mousemove._v')
            return this;
        },
        fix : function() {
            //这个还要细化
            this.css({
                position : 'fixed' 
            });
            return this;
        },
        //摘录选择区域
        filter : function() {
            this.$ele.parents().andSelf()
                .siblings(':not(head)').hide();
            return this;
        },
        cut : function() {
            var $prs = this.$ele.parents(),
                len = $prs.length;
            $prs.eq(len-1).append(this.$ele);
        },
        apply : function(oper) {
            var $self = this,
                KEYS = $self.simpleKey;
            //alert(oper);
            switch(oper){
                case KEYS.V_C:
                    $self.remove();
                break;
                case KEYS.V_F : 
                    $self.fix();
                break;
                case KEYS.V_T : 
                    $self.filter();
                break;
                case KEYS.V_H : 
                    $self.cut();
                break;
                default:
                break;
            }
            return this;
        }
    };
    $.extend(SimpleOper.prototype,OPER);
    /* 具体编辑样式的 */
    var DETAIL_OPER = {
        keys : {
            ENTER_KEY : 13,
            ESC_KEY : 27
        },
        //改变边框状态为编辑状态
        editState : function() {
            
        },
        bindKey : function(ck) {
           var win = this.getWin(),
                $self = this,
                KEYS = $self.keys;
           $(win).bind('keypress',function(e) {
                switch(e.keyCode){
                    case KEYS.ENTER_KEY: 
                        $self.save();
                    case KEYS.ESC_KEY: 
                        $self.quit();
                        //执行回调返回原来状态
                        if(ck) ck();
                        break;
                    default : 
                        break;
                }
                return false;
           });
        },
        unbindKey : function() {
           var win = this.getWin();
           $(win).unbind('keypress');
           return this;
        },
        //启动
        run : function(ck) {
            //绑定操作事件
            this.bindKey(ck);
        },
        //退出
        quit :function() {
           this.unbindKey();
        },
        getWin : function() {
            return gBrowser.contentWindow;
        }
    };
    function DetailOper($ele){
        this.$ele = $ele;
        this.styles = [];
    };
    $.extend(DetailOper.prototype,OPER,DETAIL_OPER);

    window._Vm.set('SimpleOper',SimpleOper);
    window._Vm.set('DetailOper',DetailOper);

}(jQuery))
