'use babel';

import path from 'path';

const fixture = path.join(__dirname, 'fixture.svg');
const { minify, prettify } = require('..');

describe('SVGO plugin for Atom', () => {
  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    atom.config.set('svgo.indent', 2);
    atom.config.set('svgo.disable', '');
  });

  describe('define functions', () => {
    it('have minify()', () => {
      expect(typeof minify).toEqual('function');
    });

    it('have prettify()', () => {
      expect(typeof prettify).toEqual('function');
    });
  });

  describe('process fixture.svg and', () => {
    it('minify', () => {
      waitsForPromise(() =>
        atom.workspace.open(fixture).then(editor => minify(editor)).then((editor) => {
          expect(editor.getText()).toEqual('<svg width="10" height="20">test</svg>');
        })
      );
    });

    it('prettify', () => {
      waitsForPromise(() =>
        atom.workspace.open(fixture).then(editor => prettify(editor)).then((editor) => {
          expect(editor.getText()).toEqual(`<svg width="10" height="20">
  test
</svg>
`);
        })
      );
    });
  });
});
