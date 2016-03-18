'use babel';

import * as fs from 'fs';
import SVGO from 'svgo';

function minify(pretty = false) {
  const editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  let position = editor.getCursorBufferPosition();
  let text = editor.getText();
  let selectedText = editor.getSelectedText();
  let svgo = new SVGO({ js2svg: { pretty } });

  if (selectedText.length !== 0) {
    svgo.optimize(selectedText, result => {
      if (result.data) {
        let range = editor.getSelectedBufferRange();
        editor.setTextInBufferRange(range, result.data);
        editor.setCursorBufferPosition(position);
      }
    });
  } else {
    svgo.optimize(text, result => {
      if (result.data) {
        editor.setText(result.data);
        editor.setCursorBufferPosition(position);
      }
    });
  }
}

export function activate(state) {
  atom.commands.add('atom-workspace', 'svgo:minify', () => minify(false));
  atom.commands.add('atom-workspace', 'svgo:pretty', () => minify(true));
}
