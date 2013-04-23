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
            colIndex = d_tree.columns.getColumnAt(1),
            $self = this;
       $tree.bind('select',function(e) {
          var currentIndex = this.currentIndex;  
          var value = this.view.getCellText(currentIndex, colIndex);
          if(value !== 'DEFAULT')
            $self.showContent(value);
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
            body : [
                {
                    'name':'游戏',
                    'type': 1,
                    'files' : [
                    {
                        'name' : '游民星空',
                        'href' : 'http://www.sogou.com'
                    },
                    {
                        'name' : '游戏王',
                        'href' : 'http://www.baidu.com'
                    }
                    ] 
                },
                {
                    'name' : '百度',
                    'href' : 'http://www.baidu.com',
                    'type' : 0
                }
            ]
        };
        return data;
    },
   initTree : function(){
        var data = this.readData();

        var root = new FileFold('ROOT',data.body);
        var xul = root.rootToXUL();
        return xul;
    }
});
$(window).bind('load',function() {
   new T_Mark('#v_htmlMark','collect_save.txt');
})
