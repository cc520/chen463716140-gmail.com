/* 配置管理 
 * 1.书签配置
 * */
/* config的结构如下
 * [{
 *   name: name,                    保存的名字
 *   is_default : is_default,       当前网页是否使用
 *   href : href,                   应用的网站
 *   cs : cssText                   应用的样式
 * },
 * ...
 * ]
 *
 * */
(function(window) {
    function Config(){
        this.pconfig = null;
        this.load();
    };
    Config.prototype = {
        filename : 'collect_save.txt',
        add : function(oc) {
            this.pconfig.push(oc);
            return this;
        },
        index : function(name) {
            var pconfig = this.pconfig,
                tmp  = null,
                n = '';
            for(var i=0,len=pconfig.length;i<len;i++){
                tmp = pconfig[i];
                n = tmp.name;
                if(n === name)
                    return i;
            };
            throw new Error('没有此名字');
        },
        remove : function(idx) {
            alert(idx);
            this.pconfig.splice(idx,1);
            return this;
        },
        update : function(name,prop) {
            var idx = this.index(name),
                upConfig = this.pconfig[idx];
            //简单的覆盖
            for(var p in prop){
                upConfig[p] = prop[p];
            }
        },
        getMod : function(name) {
           return window._Vm.get(name);
        },
        save : function() {
           var m_IO = null,
               filename = this.filename,
               pc = this.pconfig;
           m_IO = this.getMod('IO');
           alert($.toJSON);
           pc = $.toJSON(pc);
           m_IO.save(filename,pc);
           return this;
        },
        load : function() {
           var m_IO = null,
               filename = this.filename,
               pc = null;
           m_IO = this.getMod('IO');
           pc = m_IO.read(filename);
           this.pconfig = $.parseJSON(pc);
           return pc;
        },
        read : function() {
            var pc = this.pconfig;
            if(!pc)
               pc = this.load();
            if(!pc || typeof pc != 'object'){
                pc = [];
            }else if(!$.isArray(pc)){
                pc = [pc];
            }
            return pc;
        }
    };
    window._Vm.set('Config',Config);
})(window);
