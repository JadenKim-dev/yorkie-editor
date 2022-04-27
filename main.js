function addChange(editor, from, to, text) {  // codemirror의 원격 편집을 위한 함수, 원작자가 제공해줌  // https://github.com/codemirror/CodeMirror/pull/5619
    let adjust = editor.listSelections().findIndex(({anchor, head}) => {
      return CodeMirror.cmpPos(anchor, head) == 0 && CodeMirror.cmpPos(anchor, from) == 0
    })
    editor.operation(() => {
      editor.replaceRange(text, from, to, 'yorkie')
      if (adjust > -1) {
        let range = editor.listSelections()[adjust]
        if (range && CodeMirror.cmpPos(range.head, CodeMirror.changeEnd({from, to, text})) == 0) {
          let ranges = editor.listSelections().slice()
          ranges[adjust] = {anchor: from, head: from}
          editor.setSelections(ranges)
        }
      }
    })
  }

async function main() {  // 안에서 await를 사용했기 때문에 async로 작성해줌
    
    console.log("hit");
    var editor = CodeMirror.fromTextArea(document.getElementById('codemirror'), {
        lineNumbers: true
    });
    
    // 클라이언트 생성 및 활성화
    const client = yorkie.createClient("http://localhost:8080");  // http로 해야 됨!!!
    await client.activate();
    
    // 문서 생성 및 클라이언트에게 붙이기
    const doc = yorkie.createDocument("docs", "doc1");
    await client.attach(doc);

    // Text 데이터 타입을 만들어서, 코드미러에서 변경한 사항들이 저장되도록
    doc.update((root) => {
        if (!root.content) {  // content라는 property가 존재하지 않을 경우 만들어 줌
            root.createText('content');  // Text 라는 데이터타입을 content property에 만들게 됨
        }
    });

    // -> 이제 codemirror와 yorkie를 연동시켜야 한다. code mirror의 변경사항을 yorkie에 반영하고, yorkie의 내용을 code mirror에 반영해야 한다.
    // 1. (codemirror -> yorkie) handler
    editor.on("beforeChange", (cm, change) => {  //  editor의 변경사항을 감지
        console.log(change);
        if (change.origin == 'yorkie' || change.origin === 'setValue') {  // 변경이 일어나는 것을 필터
            return;
        }
        // CodeMirror.pos : 커서의 위치를 나타냄 -> 일반 숫자 인덱스로 바꿔야 함  // 수정 시 영역을 잡아서 할 수 있기 때문에 from, to를 사용
        const from = editor.indexFromPos(change.from);
        const to = editor.indexFromPos(change.from);
        const content = change.text.join('\n');  // codemirror는 multi line인 경우 배열로 옴 -> 텍스트를 \n으로 눌러준다
        doc.update((root) => {
            root.content.edit(from, to, content)  // yorkie document를 update
        })
        
    });

    // 2. (yorkie -> codemirror) handler
        // doc.getRoot().content : text를 가져옴 
    doc.getRoot().content.onChanges((changes) => {  // yorkie 문서 안의 text의 변경사항을 감지
        console.log(changes);
        for (const change of changes) {  // changes는 배열로 옴, 이를 순회하는 루프
            // content 변경이 아닌 경우 or 내가 수정한 내용인 경우 반영할 필요가 없음
            if (change.type !== 'content' || change.actor === client.getID()) {
                continue;
            }
            // index를 pos로 변경
            const from = editor.posFromIndex(change.from);
            const to = editor.posFromIndex(change.to);
            addChange(editor, from, to, change.content || '')  // 원격 값을 CodeMirror에 추가

        }
    });

    editor.setValue(doc.getRoot().content.getValue());  // 사이트에 새로 들어온 사용자 or 새로고침한 경우에도 내용이 화면에 보이게 함

}

main();

