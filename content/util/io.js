(function() {
    var IO = {
        save : function(output,filename) {
            var savefile = this._savePath(filename);
        　　var file = Components.classes["@mozilla.org/file/local;1"]
        　　　　.createInstance(Components.interfaces.nsILocalFile);
        　　file.initWithPath( savefile );
        　　if ( file.exists() == false ) {
        　　　　file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
        　　}
        　　var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
        　　　　.createInstance( Components.interfaces.nsIFileOutputStream );
        　　outputStream.init( file, 0x04 | 0x08 | 0x20, 420, 0 );
        　　//var output = document.getElementById('blog').value;
        　　var result = outputStream.write( output, output.length );
        　　outputStream.close();
            return this;
        },
        _savePath : function(savefile) {
            const DIR_SERVICE = new Components.Constructor("@mozilla.org/file/directory_service;1","nsIProperties");
            try {
            　　 path=(new DIR_SERVICE()).get("ProfD", Components.interfaces.nsIFile).path;
            } catch (e) {
            　　 alert("error");
            }
            if (path.search('\/\/') != -1) {
            　　 path = path + "";
            } else {
            　　 path = path + "\\";
            }
            savefile = path+savefile; 
            return savefile;
        },
        read : function(savefile) {
         savefile = this._savePath(savefile);
    　　 var file = Components.classes["@mozilla.org/file/local;1"]
    　　　　　.createInstance(Components.interfaces.nsILocalFile);
    　　 file.initWithPath( savefile );
    　　 if ( file.exists() == false ) {
    　　　　　alert("File does not exist");
    　　 }
    　　 var is = Components.classes["@mozilla.org/network/file-input-stream;1"]
    　　　　　.createInstance( Components.interfaces.nsIFileInputStream );
    　　 is.init( file,0x01, 00004, null);
    　　 var sis = Components.classes["@mozilla.org/scriptableinputstream;1"]
    　　　　　.createInstance( Components.interfaces.nsIScriptableInputStream );
    　　 sis.init( is );
    　　 var output = sis.read(sis.available());
         return output;
    //　　 this.deserialize(output); 
        }
    };
    window._Vm.set('IO',IO);
}());
