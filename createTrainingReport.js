(function () {
    "use strict";

    kintone.events.on('app.record.create.show', function(event) {
        //ボタン
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