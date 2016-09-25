'use babel';

import { type } from 'os';
import { normalize, join } from 'path';
import { spawn } from 'child_process';

const unix = normalize(join(__dirname, 'node_modules', '.bin', 'svgo'));
const win = normalize(join(__dirname, 'node_modules', '.bin', 'svgo.cmd'));
const SVGO_PATH = type() === 'Windows_NT' ? win : unix;

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
  let errors = [];

  let cp = spawn(SVGO_PATH, args);
  cp.stdout.on('data', chunk => {
    chunks.push(chunk);
  });

  cp.stderr.on('data', error => {
    errors.push(error);
  });

  cp.on('error', error => {
    atom.notifications.addError(error, {});
  });

  cp.on('exit', code => {
    if (code === 2) {
      atom.notifications.addError(Buffer.concat(errors).toString(), {});
    } else {
      let position = editor.getCursorBufferPosition();
      editor.setText(Buffer.concat(chunks).toString());
      editor.setCursorBufferPosition(position);
    }
  });
}

export function activate() {
  atom.commands.add('atom-workspace', 'svgo:minify', () => minify(false));
  atom.commands.add('atom-workspace', 'svgo:prettify', () => minify(true));
}
