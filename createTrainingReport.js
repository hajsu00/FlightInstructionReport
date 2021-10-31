(function () {
    "use strict";

    kintone.events.on('app.record.create.show', function(event) {
        //ボタン
        const element = document.createElement('button');
        element.id='get_space';
        element.innerText ='取得';
        element.onclick = function () {

            //const trainee = '';
            const rec = kintone.app.record.get();
            /*
            if (rec){
                //var trainee = rec['record']['練習生']['value'][0].name;   //連想配列
                trainee = rec.record.練習生.value;
            }
            */
            //const trainee = rec.record['練習生'].value[0].name;
            const trainee = rec.record.練習生.value;
            if (trainee == null){
                window.alert('練習生を選択してください。');
            }else{
                //作成日時を取得する
                //const createDate = rec.record.作成日時.value[0].value;
                //window.alert(createDate);
                //getLogFromHakkoukiroku(trainee, draftingDate, subject);
                window.alert(trainee);
                /*
                var params = {
                    //'app' : kintone.app.getId(),
                    app : kintone.app.getId(),    //https://developer.cybozu.io/hc/ja/articles/202331474-%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AE%E5%8F%96%E5%BE%97-GET-
                    fields: ['前席'],
                    query: '練習生 in ("' + user + '")' order by 
                };
                //https://muac.cybozu.com/k/8/
                //kintone.api(pathOrUrl, method, params, successCallback, failureCallback)
                kintone.api(kintone.api.url('/k/8/record.json', true), 'GET', params, function(resp){
                    //success:レコード番号を表示する
                    alert(resp.record.record_no.value);
                }, function(resp){
                    // error:エラーの場合はメッセージを表示する
                    var errmsg = 'レコード取得時にエラーが発生しました。';
                    // レスポンスにエラーメッセージが含まれる場合はメッセージを表示する
                    if(resp.message !== undefined){
                        errmsg += '\n' + resp.message;
                    }
                    alert(errmsg);
                */
            };
        }
        kintone.app.record.getSpaceElement('get_space').appendChild(element);
    });
})();

    /*
    function getLogFromHakkoukiroku(a, b, c, d){

    }
    */