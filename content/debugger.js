var ioService = Components.classes['@mozilla.org/network/io-service;1'] 
.getService(Components.interfaces.nsIIOService); 

var WindowMediator = Components  
.classes['@mozilla.org/appshell/window-mediator;1']  
.getService(Components.interfaces.nsIWindowMediator);  
var browser = WindowMediator.getMostRecentWindow('navigator:browser');  
/*
alert(browser.gBrowser.mTabs.length);
var browsers = WindowMediator.getEnumerator('navigator:browser');  
var browser;  
while (browsers.hasMoreElements()) {  
browser = browsers.getNext().QueryInterface(Components.interfaces.nsIDOMWindowInternal);  
browser.BrowserTryToCloseWindow();  
}  
*/
var file = Components.classes['@mozilla.org/file/local;1']  
.createInstance(Components.interfaces.nsILocalFile);  
file.initWithPath('D:\\temp\\temp.txt');  
if(file.exists())
file.remove(false);
file.create(file.NORMAL_FILE_TYPE,0666);

backupFolder = file.parent.parent; // C:\  
backupFolder.append('backup'); // C:\backup  
backupFolder.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0666);  
file.copyTo(backupFolder, file.leafName+'.bak');  


var path = 'D:\\temp\\temp.txt';  
var file = Components.classes['@mozilla.org/file/local;1']  
.createInstance(Components.interfaces.nsILocalFile);  
file.initWithPath(path);  
var ioService = Components.classes['@mozilla.org/network/io-service;1']  
.getService(Components.interfaces.nsIIOService);  
var url = ioService.newFileURI(file);  
var fileURL = url.spec;  
alert(fileURL); // "file:///C:/temp/temp.txt"  
