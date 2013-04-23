/* 网页重组插件
 * 模块管理
 * */
var Vm = {
    mods : {},
    init : function(){
        return this;
    },
    _foreach : function(f){
        for(var mod in this.mods){
            f.call(this,mod);
        }
        return this;
    },
    runMod : function(name){
    }
};
