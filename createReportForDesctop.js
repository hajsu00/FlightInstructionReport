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
            const exerciseName = rec.record.訓練課目.value;

            if (studentName.length === 0){
                alert('練習生を選択してください');
            }else{
                //グループフィールドを見やすく開閉する
                kintone.app.record.setGroupFieldOpen('練習生情報', true);

                //「今回取組み事項」を取得する
                const paramLatestId = {
                    "app": 33,
                    "query": '練習生 in ("' + studentName[0].code + '") order by $id desc limit 1',
                };

                return kintone.api(
                    kintone.api.url('/k/v1/records.json', true), 'GET', paramLatestId,
                    ).then(function(resp1) {
                        //最新レコードから順に、前席搭乗者と一致するレコードを調べる
                        let i = 0;
                        if(resp1.records[0]){      //選択した練習生の練習記録が存在する場合
                            event.record.今回取組み事項.value = resp1.records[0].次回取組み事項.value;
                            event.record.初フライト日.value = resp1.records[0].初フライト日.value;
                            if(!event.record.初フライト日.disabled){
                                event.record.初フライト日.disabled = true;
                            }
                            
                        }else{      //選択した練習生の練習記録が存在しない場合
                                alert('練習記録が存在しません。新しく起票してください。');
                                event.record.練習生.value =　studentName;
                                event.record.対象フライト.value = '1';
                                event.record.これまでの課目実施回数.value = '0';
                                event.record.訓練課目.value = '操舵要領';
                                event.record.初フライト日.disabled = false;
                                kintone.app.record.set(event);
                                return event;
                        }
                        event.record.練習生.value = studentName    //これがないとなぜかフィールド値がリセットされる
                        kintone.app.record.set(event);

                    //選択した練習生の飛行経歴を「発航記録」から取得
                        const paramFlightLog = {
                            "app": 8,
                            "query": '前席 in ("' + studentName[0].code + '") and 日付 >= "' + event.record.初フライト日.value + '" order by $id asc',
                        }
                    return kintone.api(kintone.api.url('/k/v1/records.json', true),'GET',paramFlightLog);
                    }).then(function(resp2){
                        let totalFlightNum = 0;
                        let totalExerciseNum = 0;
                        let i = 0;
                        if (resp2.records[0]){
                            while(resp2.records[i]){    //発航記録のレコードが存在する限り繰り返す
                                totalFlightNum = totalFlightNum + 1;
                                if(resp2.records[i].訓練課目選択.value === exerciseName){
                                    totalExerciseNum = totalExerciseNum + 1;
                                }else if(exerciseName === undefined){      //「訓練課目」が空白の場合
                                    alert('訓練課目を選択してください');
                                    event.record.対象フライト.value = '';
                                    event.record.これまでの課目実施回数.value = '';
                                    event.record.訓練課目.value = '';
                                    kintone.app.record.set(event);
                                    return;
                                }else{
                                    //何もしない
                                }
                                i ++;
                            }
                        }else{
                            alert('選択された練習生のフライト履歴が「発航記録」アプリ上に存在しません。');
                            event.record.初フライト日.value = '';
                            kintone.app.record.set(event);
                            return;
                        }
                        
                        event.record.対象フライト.value = totalFlightNum + 1;
                        event.record.これまでの課目実施回数.value = totalExerciseNum;
                        event.record.訓練課目.value = exerciseName;     //これをしないと「訓練課目」フィールドがリセットされてしまう
                        
                        //デバッグ用
                        console.log('総飛行回数 = ' + totalFlightNum + ', 課目実施回数 = ' + totalExerciseNum);
                        //フィールドに反映
                        kintone.app.record.set(event);      //なぜreturn eventじゃないのか

                    //エラーが発生した場合、メッセージを出す
                    }).catch(function(resp) {
                        console.log('Promiseに関するエラーが発生しました');
                        return event;
                    });
                };
        };
        kintone.app.record.getSpaceElement('get_studentInfo').appendChild(element);

        //ユーザーが操縦教官であるか判定する
        return kintone.api(        //ユーザーの所属組織エクスポート API（JSON）
            kintone.api.url('/v1/user/organizations', true), // pathOrUrl
            'GET', // method
            {code:kintone.getLoginUser()['code']}, // params
        ).then(function(resp) { // 成功時のcallback
                //some()メソッドで指定の要素があるか判定する。あればtrueが返る。
                const user = kintone.getLoginUser();
                if(resp.organizationTitles.some(element => element = '操縦教官')){      //https://techacademy.jp/magazine/22267
                    //「操縦教員」フィールドにログインユーザーを記入する
                    event.record.操縦教員.value = [{            
                        "code": user.code,
                        "name": user.name        
                      }];;
                      event.record.操縦教員.disabled = true;
                }else{  //ログインユーザーが練習生の場合
                    //「練習生」フィールドにログインユーザーを記入する
                    event.record.練習生.value = [{            
                        "code": user.code,
                        "name": user.name        
                      }];;
                    event.record.練習生.disabled = true;
                    //評価（教官記入欄）を編集不可にする
                    disableEvaluateFields(event);
                    //グループフィールドを見やすく開閉する
                    kintone.app.record.setGroupFieldOpen('フライト振り返り', true);
                }
                return event;
            }
        );
    });

    function disableBasicFields(myEvent){
        myEvent.record.起票日.disabled = true;
        myEvent.record.今回取組み事項.disabled = true;
        myEvent.record.対象フライト.disabled = true;
        myEvent.record.これまでの課目実施回数.disabled = true;
        myEvent.record.初フライト日.disabled = true;
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