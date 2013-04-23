(function() {
    function Vm(){
       this.mods = this.mods || {};
       return this;
    };
    Vm.prototype = {
        set : function(name,fn) {
           this.mods[name] = this.mods[name] || fn;
           return this;
        },
        get : function(name) {
            var mod = this.mods[name];
            if(mod === null) alert('No Module : ' + name);
            return mod;
        }
    };
    window._Vm = new Vm();
}());
