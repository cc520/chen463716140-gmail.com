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
var Collect = {
    flag : null,
    keys : {
        'CANCEL_MOD' : 113, //q
        'RUN_K_MOD' : 107, //k
        'RUN_PIC_MOD' : 112, //p
    },
    sel_k_mod : function(){
        window._nowSel = jQuery(),
            _nowSelCls = 'selBlock';
        var $bl = $('<div class="box-shadow-left box-shadow"/>');
        var $br = $('<div class="box-shadow-right box-shadow"/>');
        var $bt = $('<div class="box-shadow-top box-shadow"/>');
        var $bb = $('<div class="box-shadow-bottom box-shadow"/>');
        $('body').append($bl,$br,$bt,$bb);
        window._nowBlock = jQuery();
        //初始化为true
        Collect.is_k_mod_now = true;
        $('html').delegate('*:not(.box-shadow)', 'mousemove', function(e) {
            if(!Collect.is_k_mod_now) return;
            if(window._nowBlock === this) return false;
            window._nowBlock = this;
            var $self = $(this),
                off = $self.offset(),
                h = $self.outerHeight(),
                w = $self.outerWidth();
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
        }); 
    },
    /* 截图模式与普通模式 */
    sel_pic_mod : function(){
    },
    cancel : function() {

    },
    /* 键盘控制 */
    keyControl :function() {
        var $self = this;
       $(window).bind('keypress',function(e){
           var keyCode = e.keyCode;
           switch(keyCode){
               case keys.CANCEL_MOD : 
                  $self.cancel();
                  break;
               case keys.RUN_K_MOD :
                  $self.sel_k_mod();
                  break;
               case keys.RUN_PIC_MOD:
                  $self.sel_pic_mod();
                  break; 
               default:
                  break;
           };
       });
       return this;
    },
    init : function(){
        this.keyControl();
        return this;
    }
};
jQuery(document).ready(function($) {
    Collect.init().sel_k_mod();
});

