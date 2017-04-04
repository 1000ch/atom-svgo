'use babel';

import { join } from 'path';
import { minify, prettify } from '..';

const fixture = join(__dirname, 'fixture.svg');

describe('SVGO plugin for Atom', () => {
  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    atom.config.set('svgo.indent', 2);
    atom.config.set('svgo.disable', '');

    waitsForPromise(() => {
      return Promise.all([
        atom.packages.activatePackage('language-svg')
      ]);
    });
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
      waitsForPromise(() => {
        return atom.workspace.open(fixture)
          .then(editor => minify(editor))
          .then(editor => {
            expect(editor.getText()).toEqual('<svg width="10" height="20">test</svg>');
          });
      });
    });

    it('prettify', () => {
      waitsForPromise(() => {
        return atom.workspace.open(fixture)
          .then(editor => prettify(editor))
          .then(editor => {
            expect(editor.getText()).toEqual(`<svg width="10" height="20">
  test
</svg>
`);
        });
      });
    });
  });
});
