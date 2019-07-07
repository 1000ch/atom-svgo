'use babel';

import os from 'os';
import path from 'path';
import execa from 'execa';

const unix = path.normalize(path.join(__dirname, 'node_modules', '.bin', 'svgo'));
const win = path.normalize(path.join(__dirname, 'node_modules', '.bin', 'svgo.cmd'));
const svgo = os.type() === 'Windows_NT' ? win : unix;

export function activate() {
  atom.commands.add('atom-text-editor:not([mini])', 'svgo:minify', () => {
    minify(atom.workspace.getActiveTextEditor());
  });

  atom.commands.add('atom-text-editor:not([mini])', 'svgo:prettify', () => {
    prettify(atom.workspace.getActiveTextEditor());
  });
}

export function minify(editor) {
  if (!editor) {
    return Promise.reject(new Error('editor is invalid'));
  }

  const indent = atom.config.get('svgo.indent');
  const disable = atom.config.get('svgo.disable');
  const disables = disable.length === 0 ? [] : disable.split(' ');

  const args = [
    '--string', editor.getText(),
    '--indent', indent,
    ...disables.map(name => `--disable=${name}`),
    '--output', '-'
  ];

  return process(args)
    .then(stdout => setText(editor, stdout.toString()))
    .catch(error => atom.notifications.addError(error.toString(), {}));
}

export function prettify(editor) {
  if (!editor) {
    return Promise.reject(new Error('editor is invalid'));
  }

  const indent = atom.config.get('svgo.indent');
  const disable = atom.config.get('svgo.disable');
  const disables = disable.length === 0 ? [] : disable.split(' ');

  const args = [
    '--string', editor.getText(),
    '--indent', indent,
    '--pretty',
    ...disables.map(name => `--disable=${name}`),
    '--output', '-'
  ];

  return process(args)
    .then(result => setText(editor, result.stdout.toString()))
    .catch(error => atom.notifications.addError(error.toString(), {}));
}

function process(args) {
  return execa(svgo, args, {
    encoding: null
  });
}

function setText(editor, text) {
  const position = editor.getCursorBufferPosition();
  editor.setText(text);
  editor.setCursorBufferPosition(position);
  return editor;
}
