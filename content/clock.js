function initClock(){
    showTime();
    setInterval(showTime,1000);
};
function toDataForPage()
{
    var browser_count = gBrowser.browsers.length;
    for(var i =0;i<browser_count;i++)
    {
        var cur_browser = gBrowser.getBrowserAtIndex(i);
        var elm = cur_browser.contentDocument.createElement("MyCustomElm");
        elm.setAttribute("FF_Name","ffseasun");
        elm.setAttribute("desc","extensions 初学者");
        cur_browser.contentDocument.documentElement.appendChild(elm);
        
        var evt = cur_browser.contentDocument.createEvent("Events");
        evt.initEvent("MyCustomEvt",true,false);//true表示事件可以冒泡，false表示不可以用 preventDefault() 方法取消事件。
        elm.dispatchEvent(evt);
    }
}
function showTime() {
    var current = document.getElementById('currentTime');
    current.value = new Date().toLocaleTimeString();
    current.select();
};
