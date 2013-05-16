/* 操作书签 */

function T_Mark(tree_id,filename){
    this.filename = filename;
    this.$tree = $(tree_id);
    this.m_IO = window._Vm.get('IO');
    var xul = this.initTree();
    this.$tree.find('treechildren').append(xul);
    /* 绑定事件 */
    this.bindEvent();
    return this;
};

T_Mark.extend(FileFold.prototype,{
    bindEvent : function() {
       var $tree = this.$tree,
            d_tree = $tree.get(0),
            fidx = d_tree.columns.getColumnAt(0),
            seldx = d_tree.columns.getColumnAt(1),
            tCol = top._Vm.get('Collect_Manage');
       d_tree.addEventListener('select',function(e) {
            dump(e);
            //window._wPop.query();
       });
    },
    readData : function(){
        var filename = this.filename,
            obj = '';
        obj = this.m_IO.read(filename);
        obj = $.parseJSON(obj);
        var data = {
            head : [
                'name',
                'href'
            ],
            body : obj
        };
        return data;
    },
   initTree : function(){
        var data = this.readData();
        var root = new FileFold('ROOT',data.body);
        var xul = root.rootToPageXUL();
        return xul;
    }
});
/* 上下文管理 */
var TreePop = {
    tree : null,
    m_Coll : top._Vm.get('Collect_Manage'), //模块引入
    addNewFold : function() {
       alert('NewFold');
    },
    getIndex : function() {
       return this.tree.currentIndex; 
    },
    query : function() {
        var idx = this.getIndex();
        var name = this.getCell(idx,0);
        var link = this.getCell(idx,1);
        this.m_Coll.loadPage(name,link);
        return this;
    },
    getCell : function(row,col) {
        var tree = this.tree,
            idx = tree.columns.getColumnAt(col);
        return tree.view.getCellText(row,idx);
    },
    //取消应用
    cancelApp : function() {
        this._appUtil(false);
        return this;
    },
    getConfig : function() {
        var m_Coll = this.m_Coll,
            pc = m_Coll.getConfig();
        return pc;
    },
    _refresh : function() {
        this.m_Coll.save();
        return this;
    },
    //应用
    app : function() {
       this._appUtil(true);
       return this;
    },
    _appUtil : function(flag) {
       var idx = this.getIndex(),
           pc = this.getConfig();
        pc.update(idx,{
            "is_default" : flag 
        });
        this._refresh();
    },
    //删除配置
    del : function() {
        var idx = this.getIndex(),
            m_Coll = this.m_Coll,
            pc = m_Coll.getConfig();
        pc.remove(idx);
        //刷新
        this._refresh();
        return this;
    },
    config : function() {
        var idx = this.getIndex(),
            pc = this.getConfig(),
            m_Coll = this.m_Coll,
            config = null;
        config = {
            pc : pc,
            idx : idx,
            m_Coll : m_Coll
        };
        window.openDialog('chrome://V+/content/web_mark_config.xul','属性','chrome,centerscreen,modal',config);
        return this;
    },
    //没有任何东西选中
    noState : function() {
       $('#v_cancelApp').attr('hidden',true);
       $('#v_app').attr('hidden',true);
       //$(this.popitem).find('menuitem').attr('disabled',true);
       return this;
    },
    appOrCancel : function(e) {
        var idx = this.getIndex();
        var is_app = this.getCell(idx,2);
        if(!this.tree.view.selection.isSelected(idx)){
           this.noState();
        }else{
            is_app = is_app == 'true' ? true : false;
            $('#v_cancelApp').attr('hidden',!is_app);
            $('#v_app').attr('hidden',is_app);
        }
        return this;
    }
};
function WebTreePop(treeid,popid){
   var $self = this;
   this.tree = document.getElementById(treeid);
   this.popitem = document.getElementById(popid);
   this.tree.addEventListener('contextmenu',function(e) {
        $self.appOrCancel(e);
        return false;
   });
   return this;
};
WebTreePop.prototype = TreePop;

window.addEventListener('load',function() {
    new T_Mark('#v_pageMark','collect_save.txt');
    window._wPop = new WebTreePop('v_pageMark','v_webContext');
});
/*
        var data = {
            head : [
                'name',
                'link'
            ],
            body : [
            {
                name : '土豆页面',
                type : 1,
                files : [
                    {
                        link : 'http://www.tudou.com',
                        name : '土豆主页新改版',
                        type : 0
                    },{
                        link : 'http://www.tudou.com',
                        name : '土豆主页改2',
                        type : 0
                    }
                ]
            },{
                link:'http://www.baidu.com',
                name : '百度改页面',
                type : 0
            }   
            ]
        };*/
