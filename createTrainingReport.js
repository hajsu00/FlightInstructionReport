(function () {
    "use strict";

    kintone.events.on('app.record.create.show', function(event) {

        //ユーザーが操縦教官であるか判定する
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
            }
        }
        );

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
                console.log(studentName[0].name);
                console.log('studentName = ', studentName);
            }
        }
        kintone.app.record.getSpaceElement('get_studentInfo').appendChild(element);
        return event;
    });
})();