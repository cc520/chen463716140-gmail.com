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
       $tree.bind('select',function(e) {
          var currentIndex = this.currentIndex;  
          var name = this.view.getCellText(currentIndex, fidx);
          var link = this.view.getCellText(currentIndex, seldx);
          tCol.loadPage(name,link);
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

$(window).bind('load',function() {
   new T_Mark('#v_pageMark','collect_save.txt');
})
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
