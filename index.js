'use babel';

import { normalize, join } from 'path';
import { spawn } from 'child_process';

const SVGO_PATH = normalize(join(__dirname, 'node_modules', '.bin', 'svgo'));

function minify(pretty = false) {
  const editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  let args = ['--input', editor.getPath(), '--output', '-'];
  if (pretty) {
    args.push('--pretty');
  }

  let chunks = [];
  let cp = spawn(SVGO_PATH, args);
  cp.stdout.on('data', chunk => {
    chunks.push(chunk);
  });

  cp.on('error', error => {
    console.error(error);
  });

  cp.on('exit', () => {
    let position = editor.getCursorBufferPosition();
    editor.setText(Buffer.concat(chunks).toString());
    editor.setCursorBufferPosition(position);
  });
}

export function activate(state) {
  atom.commands.add('atom-workspace', 'svgo:minify', () => minify(false));
  atom.commands.add('atom-workspace', 'svgo:prettify', () => minify(true));
}
