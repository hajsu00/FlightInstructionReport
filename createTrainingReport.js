(function () {
    "use strict";

    kintone.events.on('app.record.create.show', function(event) {
        //ボタン
        const element = document.createElement('button');
        element.id='get_space';
        element.innerText ='取得';
        element.onclick = function () {
            //const rec = kintone.app.record.get();

            //const trainee = rec.record.練習生.value[0].name;    //出力結果（フィールド値を設定/未設定）＝＞ '（正常に表示）'/ '（空欄）'
            //const trainee = rec.record.練習生.value[0];         //出力結果（フィールド値を設定/未設定）＝＞ '[Object] [Object]'/'（undefind）'
            const trainee = rec.record.練習生.value;              //出力結果 （フィールド値を設定/未設定）＝＞ '[Object] [Object]'/'（空欄）'
            //const trainee = event["record"]["練習生"]["value"];
            
            var key = Object.keys(trainee);
            //console.log( key );

            //window.alert(key);
            console.log(key);

        }
        kintone.app.record.getSpaceElement('get_space').appendChild(element);
    });
})();

    /*
    function getLogFromHakkoukiroku(a, b, c, d){

    }
    */