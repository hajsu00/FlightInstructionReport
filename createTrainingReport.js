(function () {
    "use strict";
    kintone.events.on(['app.record.create.show', 'app.record.edit.show'], function (event){

        //飛行経歴欄を編集不可にする
        var record = event.record;

        //練習生記入部分
        record['練習生']['disabled']= true;
        record['総飛行時間']['disabled']= true;
        record['総飛行回数']['disabled']= true;
        record['単独飛行時間'].disabled = true;
        record['単独飛行回数'].disabled = true;
        record['同型機による飛行時間'].disabled = true;
        record['同型機による飛行回数'].disabled = true;
        record['前回フライトからの経過日数'].disabled = true;
        record['失速'].disabled = true;
        record['サブG'].disabled = true;
        record['索切れ'].disabled = true;
        record['同課目実施回数'].disabled = true;

        var user_group,
        group_ary_count,
        user_group_ary = new Array(0);
        var user = kintone.getLoginUser();
        /*--ユーザーの所属組織のコードを表示する--*/
        return kintone.api('/v1/user/groups', 'GET', {
            code: user.code
        }, function (resp) {
            //所属グループの数を数える
            group_ary_count = resp.groups.length;
            //「学生」グループに所属していた場合、「評価（操縦教員記入）」欄を編集不可にする
            for (var i = 0; i < group_ary_count; i++) {
                user_group = resp.groups[i].code;
                user_group_ary.push(user_group);
            }
            // alert('あなたが所属するグループは（apiの中）' + user_group_ary[0]);
            console.log('user_group_ary', user_group_ary);
            console.log('user_group_aryにInstructorsは含まれているか', user_group_ary.indexOf('Instructors'));

            //ログインユーザーが教官でない場合、「評価（操縦教員記入）」欄を編集不可にする
            if (user_group_ary.indexOf('Instructors') !== -1) {
                record['評価_上昇'].disabled = true;
                record['コメント_上昇'].disabled = true;
                record['評価_直線'].disabled = true;
                record['コメント_直線'].disabled = true;
                record['評価_旋回'].disabled = true;
                record['コメント_旋回'].disabled = true;
                record['評価_離脱・機速セット'].disabled = true;
                record['コメント_離脱・機速セット'].disabled = true;
                record['評価_場周経路・偏流'].disabled = true;
                record['コメント_場周経路・偏流'].disabled = true;
                record['評価_チェックポイント通過'].disabled = true;
                record['コメント_チェックポイント通過'].disabled = true;
                record['評価_第３旋回'].disabled = true;
                record['コメント_第３旋回'].disabled = true;
                record['評価_第４旋回'].disabled = true;
                record['コメント_第４旋回'].disabled = true;
                record['評価_進入'].disabled = true;
                record['コメント_進入'].disabled = true;
                record['評価_フレアー・接地'].disabled = true;
                record['コメント_フレアー・接地'].disabled = true;
                record['評価_地上滑走'].disabled = true;
                record['コメント_地上滑走'].disabled = true;
                record['総評'].disabled = true;
            }
            //ボタン
            var mySpaceFieldButton = document.createElement('button');
            mySpaceFieldButton.id = 'my_space_field';
            mySpaceFieldButton.innerText = '情報取得';
            // ボタンクリック時の処理
            mySpaceFieldButton.onclick = function () {
                window.confirm('いま押しましたね？')
            }
            //メニューの右側の空白部分にボタンを設置
            kintone.app.record.getSpaceElement('my_space_field').appendChild(mySpaceFieldButton);
            return event;
        });
    });

})();
