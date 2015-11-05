'use babel';

import fs from 'fs';
import SVGO from 'svgo';

const minify = () => {

  const editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  let position = editor.getCursorBufferPosition();
  let text = editor.getText();
  let selectedText = editor.getSelectedText();
  let svgo = new SVGO();

  if (selectedText.length !== 0) {
    svgo.optimize(selectedText, result => {
      if (result.data) {
        let range = editor.getSelectedBufferRange();
        editor.setTextInBufferRange(range, result.data);
      }
    });
  } else {
    svgo.optimize(text, result => {
      if (result.data) {
        editor.setText(result.data);
      }
    });
  }

  editor.setCursorBufferPosition(position);
};

export const activate = (state) => {
  atom.commands.add('atom-workspace', 'svgo:minify', () => minify());
};