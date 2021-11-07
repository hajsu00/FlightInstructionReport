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

            //過去のレコード有無を調べる
            const studentName = rec.record.練習生.value;
            if (studentName.length === 0){
                alert('練習生を選択してください');
            }else{
                //グループフィールドを見やすく開閉する
                kintone.app.record.setGroupFieldOpen('練習生情報', true);

                //練習生の飛行経歴を取得する
                return new kintone.Promise(function(resolve, reject){       //https://tech.nerune.co/other/kintone-promise/
                    const paramLatestId = {
                        "app": 33,
                        "query": "order by $id desc limit 1 offset 0",
                    };
                    const LatestId = getLatestId(paramLatestId, event);
                    console.log(LatestId);
/*
                    kintone.api(
                        kintone.api.url('/k/v1/records.json', true),
                        'GET',
                        paramLatestId,
                        function(resp) {
                            const recordId = resp.records[0].$id.value;
                            console.log('latestId', recordId);
                            //return recordId;
                      }, function(resp) {
                            const errmsg = 'レコード取得時にエラーが発生しました。';
                            // レスポンスにエラーメッセージが含まれる場合はメッセージを表示する
                            if (resp.message !== undefined) {
                            errmsg += '\n' + resp.message;
                        }
                        alert(errmsg);
                        resolve(event);
                      }
                    );
                    */
                });

                console.log(studentName[0].name);



                //練習生の取組みテーマを取得する
                
                



            }
        }
        kintone.app.record.getSpaceElement('get_studentInfo').appendChild(element);

        //ユーザーが操縦教官であるか判定する
        return new kintone.Promise(function(resolve, reject){       //https://tech.nerune.co/other/kintone-promise/
            kintone.api(        //ユーザーの所属組織エクスポート API（JSON）
                kintone.api.url('/v1/user/organizations', true), // pathOrUrl
                'GET', // method
                {code:kintone.getLoginUser()['code']}, // params
                function(resp) { // 成功時のcallback
                    //some()メソッドで指定の要素があるか判定する。あればtrueが返る。
                    if(resp.organizationTitles.some(element => element = '操縦教官')){      //https://techacademy.jp/magazine/22267
                        
                        
                    }else{  //ログインユーザーが練習生の場合
                        //評価（教官記入欄）を編集不可にする
                        disableEvaluateFields(event);
                        //グループフィールドを見やすく開閉する
                        kintone.app.record.setGroupFieldOpen('フライト振り返り', true);

                    }
                    resolve(event);
                }
            );
        });
    });

    function getLatestId(myParam, myEvent){
        kintone.api(
            kintone.api.url('/k/v1/records.json', true),
            'GET',
            myParam,
            function(resp) {
                const recordId = resp.records[0].$id.value;
                console.log('latestId', recordId);
                //return recordId;
          }, function(resp) {
                const errmsg = 'レコード取得時にエラーが発生しました。';
                // レスポンスにエラーメッセージが含まれる場合はメッセージを表示する
                if (resp.message !== undefined) {
                errmsg += '\n' + resp.message;
            }
            alert(errmsg);
            resolve(myEvent);
          }
        );
    }

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