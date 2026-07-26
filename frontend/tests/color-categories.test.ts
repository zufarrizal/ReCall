import assert from 'node:assert/strict';
import test from 'node:test';
import { colorEditorRows, colorLegend, colorOptions } from '../src/color-categories.ts';

test('renderer kategori memakai nama dinamis dan mengamankan HTML', () => {
  const categories = [
    { key: 'blue', name: 'Pekerjaan' },
    { key: 'cyan', name: '<Kuliah & Belajar>' },
  ];

  assert.match(colorOptions(categories), /Pekerjaan/);
  assert.match(colorLegend(categories), /color-swatch cyan/);
  assert.match(colorEditorRows(categories), /data-color-key="blue"/);
  assert.doesNotMatch(colorOptions(categories), /<Kuliah/);
  assert.match(colorOptions(categories), /&lt;Kuliah &amp; Belajar&gt;/);
});
