/* 向当前页面注入代码 */
var Vm = {
    init : function(){
        var doc = window.getBrowser().selectedBrowser.contentDocument;
        var img = doc.getElementsByTagName('img');
        alert(img.length);
    } 
};

        /*
    var myExtension = {
      myListener: function(evt) {
        alert("从页面传过来的参数 " +
              evt.target.getAttribute("attribute1") + "/" + 
              evt.target.getAttribute("attribute2")+"\r\n"+evt.target.getAttribute("name")+"\r\n"+evt.target.getAttribute("age"));
      }
    }
    document.addEventListener("MyExtensionEvent", function(e) { myExtension.myListener(e); }, false, true); 
    */
    function showDocument(){
        var doc = gBrowser.selectedBrowser.contentDocument;
        var $div = $('div',doc);
        dump($div.length);
        alert($div.length);
    }
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
            var doc = e.originalTarget;
            // doc即网页中的document
            if(doc.location.href.search("baidu") > -1)
                doc.getElementsByTagName("form")[0].innerHTML='来搞点破坏: - )';
            myExtension.checkType(doc.location.href);
        },
        checkType : function(value){
           if(value.search('baidu') > -1){
                document.getElementById('urlbar').value = "http://www.baidu.com:myself";
           }
        }
    }
