(function(){
    "use strict";

    kintone.events.on('app.record.create.show', function(event){
        window.alert('レコード表示イベント')
    })
})