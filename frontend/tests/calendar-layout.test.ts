import assert from 'node:assert/strict';
import test from 'node:test';
import { layoutOverlappingAgendas } from '../src/calendar-layout.ts';

const agenda = (id: number, start: string, end: string) => ({
  id,
  startAt: `2026-07-26T${start}:00+07:00`,
  endAt: `2026-07-26T${end}:00+07:00`,
});

test('agenda yang terpisah memakai lebar penuh', () => {
  const result = layoutOverlappingAgendas([
    agenda(1, '09:00', '10:00'),
    agenda(2, '10:00', '11:00'),
  ]);

  assert.deepEqual(result.map(item => [item.agenda.id, item.column, item.columns]), [
    [1, 0, 1],
    [2, 0, 1],
  ]);
});

test('agenda pada waktu yang sama ditempatkan berdampingan', () => {
  const result = layoutOverlappingAgendas([
    agenda(1, '09:00', '10:00'),
    agenda(2, '09:00', '10:00'),
    agenda(3, '09:00', '10:00'),
  ]);

  assert.deepEqual(result.map(item => [item.agenda.id, item.column, item.columns]), [
    [1, 0, 3],
    [2, 1, 3],
    [3, 2, 3],
  ]);
});

test('kolom digunakan kembali dalam kelompok benturan berantai', () => {
  const result = layoutOverlappingAgendas([
    agenda(1, '09:00', '12:00'),
    agenda(2, '09:00', '10:00'),
    agenda(3, '10:00', '11:00'),
  ]);

  assert.deepEqual(result.map(item => [item.agenda.id, item.column, item.columns]), [
    [1, 0, 2],
    [2, 1, 2],
    [3, 1, 2],
  ]);
});
