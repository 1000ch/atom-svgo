'use babel';

import svgo from 'svgo';

function minify(pretty = false) {
  const editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  let options = {};
  if (pretty) {
    options.js2svg = {
      pretty: pretty
    };
  }

  let text = editor.getText();
  new svgo(options).optimize(text, result => {
    let position = editor.getCursorBufferPosition();
    editor.setText(result.data);
    editor.setCursorBufferPosition(position);
  });
}

export function activate(state) {
  atom.commands.add('atom-workspace', 'svgo:minify', () => minify(false));
  atom.commands.add('atom-workspace', 'svgo:prettify', () => minify(true));
}
