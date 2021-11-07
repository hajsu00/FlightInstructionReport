(function () {
    "use strict";

    kintone.events.on('app.record.create.show', function(event) {
        //フィールドを編集不可にする
        disableBasicFields(event);

        //取得ボタン
        const element = document.createElement('button');
        element.id='get_studentInfo';
        element.innerText ='取得';
        element.onclick = function () {
            const rec = kintone.app.record.get();
            const studentName = rec.record.練習生.value;
            if (studentName.length === 0){
                alert('練習生を選択してください');
            }else{
                //練習生の飛行経歴を取得する




                //練習生の取組みテーマを取得する





            }
        }
        kintone.app.record.getSpaceElement('get_studentInfo').appendChild(element);

        //ユーザーが操縦教官であるか判定する
        return new kintone.Promise(function(resolve, reject){
            kintone.api(        //ユーザーの所属組織エクスポート API（JSON）
                kintone.api.url('/v1/user/organizations', true), // pathOrUrl
                'GET', // method
                {code:kintone.getLoginUser()['code']}, // params
                function(resp) { // 成功時のcallback
                    //some()メソッドで指定の要素があるか判定する。あればtrueが返る。
                    if(resp.organizationTitles.some(element => element = '操縦教官')){      //https://techacademy.jp/magazine/22267
                        console.log('ユーザーは操縦教官です');
                        
                    }else{
                        console.log('ユーザーは操縦教官ではありません');
                        disableEvaluateFields(event);
                    }
                    resolve(event);
                }
            );
        });
    });

    function disableBasicFields(myEvent){
        myEvent.record.起票日.disabled = true;
        myEvent.record.今回取組み事項.disabled = true;
        myEvent.record.対象フライト.disabled = true;
        myEvent.record.これまでの課目実施回数.disabled = true;
    };

    function disableEvaluateFields(myEvent){
        myEvent.record.評価_離陸上昇.disabled = true;
        myEvent.record.コメント_離陸上昇.disabled = true;
        myEvent.record.評価_離脱機速セット.disabled = true;
        myEvent.record.コメント_離脱機速セット.disabled = true;
        myEvent.record.評価_直線.disabled = true;
        myEvent.record.コメント_直線.disabled = true;
        myEvent.record.評価_旋回.disabled = true;
        myEvent.record.コメント_旋回.disabled = true;
        myEvent.record.評価_場周経路.disabled = true;
        myEvent.record.コメント_場周経路.disabled = true;
        myEvent.record.評価_第３旋回.disabled = true;
        myEvent.record.コメント_第３旋回.disabled = true;
        myEvent.record.評価_第４旋回.disabled = true;
        myEvent.record.コメント_第４旋回.disabled = true;
        myEvent.record.評価_アプローチ.disabled = true;
        myEvent.record.コメント_アプローチ.disabled = true;
        myEvent.record.評価_フレア接地舵.disabled = true;
        myEvent.record.コメント_フレア接地舵.disabled = true;
        myEvent.record.評価_地上滑走.disabled = true;
        myEvent.record.コメント_地上滑走.disabled = true;
        myEvent.record.総評.disabled = true;
    }
})();

