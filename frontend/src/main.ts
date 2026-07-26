import './style.css';
import './color-categories.css';
import {
  DeleteAgenda,
  HideWindow,
  ListAgendas,
  ListColorCategories,
  SaveAgenda,
  SaveColorCategories,
  TestAlarmSound,
} from '../wailsjs/go/main/App';
import { EventsOn } from '../wailsjs/runtime/runtime';
import type { model } from '../wailsjs/go/models';
import { layoutOverlappingAgendas } from './calendar-layout';
import { colorEditorRows, colorLegend, colorOptions } from './color-categories';

type Agenda = model.Agenda;
type ColorCategory = model.ColorCategory;

const state = {
  selectedDate: dayStart(new Date()),
  days: 3,
  agendas: [] as Agenda[],
  colors: [] as ColorCategory[],
  editing: null as Agenda | null,
};

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<div class="shell">
 <aside>
  <div class="brand"><b>R</b><span><strong>ReCall</strong><small>Agenda & pengingat</small></span></div>
  <button class="primary wide" id="new">＋ Agenda baru</button>
  <section class="mini">
   <header><button id="mp">‹</button><strong id="ml"></strong><button id="mn">›</button></header>
   <div class="week"><i>Sn</i><i>Sl</i><i>Rb</i><i>Km</i><i>Jm</i><i>Sb</i><i>Mg</i></div>
   <div class="month" id="month"></div>
  </section>
  <section class="color-section">
   <header><strong>Kategori warna</strong><button id="manage-colors">Atur nama</button></header>
   <div class="legend" id="color-legend"></div>
  </section>
  <div class="tray"><b>◉</b><span><strong>Aktif di background</strong><small>Tutup jendela untuk sembunyikan ke tray.</small><button id="test-sound">Uji suara alarm</button></span></div>
 </aside>
 <main>
  <header class="toolbar">
   <div class="nav"><button class="secondary" id="today">Hari ini</button><button class="icon bordered" id="prev">‹</button><button class="icon bordered" id="next">›</button><span><h1 id="range"></h1><small id="count"></small></span></div>
   <div class="actions"><div class="switch"><button data-days="1">Hari</button><button data-days="3" class="active">3 Hari</button><button data-days="7">Minggu</button></div><button class="icon bordered" id="hide">—</button></div>
  </header>
  <section class="calendar-scroll"><div class="calendar" id="calendar"></div></section>
 </main>
</div>
<div class="backdrop hidden" id="editor">
 <div class="modal">
  <header><span><p>Jadwal kegiatan</p><h2 id="form-title">Agenda baru</h2></span><button class="icon" data-close>×</button></header>
  <form id="form">
   <label>Judul<input id="title" maxlength="120" required placeholder="Contoh: Rapat mingguan"></label>
   <label>Catatan<textarea id="description" maxlength="2000" rows="3" placeholder="Tambahkan detail kegiatan"></textarea></label>
   <div class="form-grid"><label>Tanggal<input id="date" type="date" required></label><label>Waktu mulai<input id="start" type="time" required></label><label>Waktu selesai<input id="end" type="time" required></label></div>
   <div class="form-grid two"><label>Kategori warna<select id="color"></select></label><label>Pengingat<select id="offset"><option value="0">Saat dimulai</option><option value="5">5 menit sebelumnya</option><option value="10">10 menit sebelumnya</option><option value="30">30 menit sebelumnya</option><option value="60">1 jam sebelumnya</option><option value="1440">1 hari sebelumnya</option></select></label></div>
   <label class="check"><input id="alarm" type="checkbox" checked>Aktifkan alarm untuk agenda ini</label>
   <footer><button type="button" class="danger ghost hidden" id="delete">Hapus</button><i></i><button type="button" class="secondary" data-close>Batal</button><button class="primary" id="save">Simpan agenda</button></footer>
  </form>
 </div>
</div>
<div class="backdrop hidden" id="color-editor">
 <div class="modal color-modal">
  <header><span><p>Personalisasi kalender</p><h2>Atur nama warna</h2></span><button class="icon" data-color-close>×</button></header>
  <p class="helper">Gunakan nama yang bermakna, misalnya Pekerjaan, Kuliah, atau Keluarga. Warna agenda yang sudah ada tidak berubah.</p>
  <form id="color-form">
   <div class="color-editor-list" id="color-list"></div>
   <footer><i></i><button type="button" class="secondary" data-color-close>Batal</button><button class="primary" id="save-colors">Simpan nama</button></footer>
  </form>
 </div>
</div>
<div class="backdrop hidden" id="confirm"><div class="modal compact"><h2>Hapus agenda?</h2><p>Agenda ini akan dihapus permanen dari kalender.</p><footer><i></i><button class="secondary" id="cancel-delete">Batal</button><button class="danger" id="confirm-delete">Ya, hapus</button></footer></div></div>
<div class="backdrop hidden" id="alarm-modal"><div class="modal alarm"><div>⏰</div><p>Pengingat agenda</p><h2 id="alarm-title"></h2><span id="alarm-detail"></span><button class="primary wide" id="dismiss">Saya mengerti</button></div></div>
<div class="toasts" id="toasts"></div>`;

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const value = (selector: string) => $<HTMLInputElement>(selector).value;

function dayStart(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(value: Date, amount: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function key(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function iso(date: Date) {
  const offset = date.getTimezoneOffset();
  const sign = offset <= 0 ? '+' : '-';
  const absolute = Math.abs(offset);
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, -1)
    + `${sign}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
}

function fmt(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

function esc(value: string) {
  return value.replace(
    /[&<>"']/g,
    character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!,
  );
}

async function load() {
  try {
    state.agendas = await ListAgendas(iso(state.selectedDate), iso(addDays(state.selectedDate, state.days)));
    render();
  } catch (error) {
    toast(String(error), 'error');
  }
}

async function loadColors() {
  try {
    state.colors = await ListColorCategories();
    renderColors();
  } catch (error) {
    toast(String(error), 'error');
  }
}

function render() {
  renderMonth();
  renderCalendar();
  document.querySelectorAll<HTMLButtonElement>('[data-days]').forEach(button => {
    button.classList.toggle('active', Number(button.dataset.days) === state.days);
  });
}

function renderColors() {
  const select = $<HTMLSelectElement>('#color');
  const selected = select.value;
  $('#color-legend').innerHTML = colorLegend(state.colors);
  select.innerHTML = colorOptions(state.colors);
  select.value = state.colors.some(color => color.key === selected) ? selected : (state.colors[0]?.key ?? '');
}

function renderMonth() {
  const base = state.selectedDate;
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const start = addDays(first, -((first.getDay() + 6) % 7));
  $('#ml').textContent = fmt(base, { month: 'long', year: 'numeric' });
  $('#month').innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    const classes = [
      date.getMonth() !== base.getMonth() ? 'muted' : '',
      key(date) === key(new Date()) ? 'today' : '',
      key(date) === key(base) ? 'selected' : '',
    ].join(' ');
    return `<button class="${classes}" data-date="${key(date)}">${date.getDate()}</button>`;
  }).join('');
}

function renderCalendar() {
  const days = Array.from({ length: state.days }, (_, index) => addDays(state.selectedDate, index));
  const last = days.at(-1)!;
  $('#range').textContent = state.days === 1
    ? fmt(days[0], { weekday: 'long', day: 'numeric', month: 'long' })
    : `${days[0].getDate()}–${fmt(last, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  $('#count').textContent = `${state.agendas.length} agenda pada rentang ini`;

  const hours = Array.from({ length: 24 }, (_, index) => index);
  const calendar = $('#calendar');
  calendar.style.setProperty('--days', String(state.days));
  calendar.dataset.days = String(state.days);
  calendar.innerHTML = `
    <div class="corner"></div>
    ${days.map(date => `<div class="day-head ${key(date) === key(new Date()) ? 'is-today' : ''}"><span>${fmt(date, { weekday: 'short' })}</span><b>${date.getDate()}</b></div>`).join('')}
    <div class="times">${hours.map(hour => `<div>${String(hour).padStart(2, '0')}:00</div>`).join('')}</div>
    ${days.map(date => `<div class="day-col" data-date="${key(date)}">${hours.map(hour => `<div class="slot" data-hour="${hour}"></div>`).join('')}${blocks(date)}${key(date) === key(new Date()) ? nowLine() : ''}</div>`).join('')}`;
}

function blocks(day: Date) {
  return layoutOverlappingAgendas(state.agendas.filter(agenda => key(new Date(agenda.startAt)) === key(day)))
    .map(({ agenda, column, columns }) => {
      const start = new Date(agenda.startAt);
      const end = new Date(agenda.endAt);
      const top = (start.getHours() * 60 + start.getMinutes()) / 60 * 64;
      const height = Math.max(34, (end.getTime() - start.getTime()) / 3600000 * 64 - 4);
      const columnWidth = 100 / columns;
      const left = column * columnWidth;
      const startLabel = start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const endLabel = end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const label = esc(`${agenda.title}, ${startLabel}–${endLabel}`);
      return `<button class="agenda-card ${agenda.color}" data-id="${agenda.id}" aria-label="${label}" title="${label}" style="top:${top}px;height:${height}px;left:calc(${left}% + 4px);right:auto;width:calc(${columnWidth}% - 8px)"><b>${esc(agenda.title)}</b><span>${startLabel}–${endLabel}</span>${agenda.alarm ? '<i>◉</i>' : ''}</button>`;
    })
    .join('');
}

function nowLine() {
  const now = new Date();
  const top = (now.getHours() * 60 + now.getMinutes()) / 60 * 64;
  return `<div class="now" style="top:${top}px"><i></i></div>`;
}

function openEditor(agenda?: Agenda, date?: Date, hour = 9) {
  state.editing = agenda ?? null;
  const start = agenda ? new Date(agenda.startAt) : new Date(date ?? state.selectedDate);
  if (!agenda) start.setHours(hour, 0, 0, 0);
  const end = agenda ? new Date(agenda.endAt) : new Date(start.getTime() + 3600000);
  $('#form-title').textContent = agenda ? 'Ubah agenda' : 'Agenda baru';
  $<HTMLInputElement>('#title').value = agenda?.title ?? '';
  $<HTMLTextAreaElement>('#description').value = agenda?.description ?? '';
  $<HTMLInputElement>('#date').value = key(start);
  $<HTMLInputElement>('#start').value = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
  $<HTMLInputElement>('#end').value = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
  $<HTMLSelectElement>('#color').value = agenda?.color ?? state.colors[0]?.key ?? 'blue';
  $<HTMLInputElement>('#alarm').checked = agenda?.alarm ?? true;
  $<HTMLSelectElement>('#offset').value = String(agenda?.alarmOffset ?? 10);
  $('#delete').classList.toggle('hidden', !agenda);
  $('#editor').classList.remove('hidden');
  setTimeout(() => $<HTMLInputElement>('#title').focus(), 50);
}

function closeEditor() {
  $('#editor').classList.add('hidden');
}

function openColorEditor() {
  $('#color-list').innerHTML = colorEditorRows(state.colors);
  $('#color-editor').classList.remove('hidden');
  setTimeout(() => $<HTMLInputElement>('#color-list input').focus(), 50);
}

function closeColorEditor() {
  $('#color-editor').classList.add('hidden');
}

$<HTMLFormElement>('#form').addEventListener('submit', async event => {
  event.preventDefault();
  const date = value('#date');
  const start = new Date(`${date}T${value('#start')}:00`);
  const end = new Date(`${date}T${value('#end')}:00`);
  const button = $<HTMLButtonElement>('#save');
  button.disabled = true;
  try {
    await SaveAgenda({
      id: state.editing?.id ?? 0,
      title: value('#title'),
      description: value('#description'),
      startAt: iso(start),
      endAt: iso(end),
      color: value('#color'),
      alarm: $<HTMLInputElement>('#alarm').checked,
      alarmOffset: Number(value('#offset')),
      notifiedAt: '',
      createdAt: state.editing?.createdAt ?? '',
      updatedAt: state.editing?.updatedAt ?? '',
    });
    closeEditor();
    toast(state.editing ? 'Agenda berhasil diperbarui.' : 'Agenda berhasil dibuat.', 'success');
    await load();
  } catch (error) {
    toast(String(error), 'error');
  } finally {
    button.disabled = false;
  }
});

$<HTMLFormElement>('#color-form').addEventListener('submit', async event => {
  event.preventDefault();
  const button = $<HTMLButtonElement>('#save-colors');
  const categories = Array.from(document.querySelectorAll<HTMLInputElement>('[data-color-key]'))
    .map(input => ({ key: input.dataset.colorKey ?? '', name: input.value }));
  button.disabled = true;
  try {
    state.colors = await SaveColorCategories(categories);
    renderColors();
    closeColorEditor();
    toast('Nama warna berhasil disimpan.', 'success');
  } catch (error) {
    toast(String(error), 'error');
  } finally {
    button.disabled = false;
  }
});

$('#new').onclick = () => openEditor();
document.querySelectorAll('[data-close]').forEach(element => element.addEventListener('click', closeEditor));
$('#manage-colors').onclick = openColorEditor;
document.querySelectorAll('[data-color-close]').forEach(element => element.addEventListener('click', closeColorEditor));
$('#today').onclick = () => {
  state.selectedDate = dayStart(new Date());
  load();
};
$('#prev').onclick = () => {
  state.selectedDate = addDays(state.selectedDate, -state.days);
  load();
};
$('#next').onclick = () => {
  state.selectedDate = addDays(state.selectedDate, state.days);
  load();
};
$('#mp').onclick = () => {
  state.selectedDate = new Date(state.selectedDate.getFullYear(), state.selectedDate.getMonth() - 1, state.selectedDate.getDate());
  load();
};
$('#mn').onclick = () => {
  state.selectedDate = new Date(state.selectedDate.getFullYear(), state.selectedDate.getMonth() + 1, state.selectedDate.getDate());
  load();
};
$('#hide').onclick = () => HideWindow();
document.querySelectorAll<HTMLButtonElement>('[data-days]').forEach(button => {
  button.onclick = () => {
    state.days = Number(button.dataset.days);
    load();
  };
});

$('#test-sound').onclick = async () => {
  const button = $<HTMLButtonElement>('#test-sound');
  button.disabled = true;
  try {
    await TestAlarmSound();
    toast('Suara alarm berhasil diputar.', 'success');
  } catch (error) {
    toast(String(error), 'error');
  } finally {
    button.disabled = false;
  }
};

$('#month').onclick = event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-date]');
  if (button) {
    state.selectedDate = dayStart(new Date(`${button.dataset.date}T00:00:00`));
    load();
  }
};

$('#calendar').onclick = event => {
  const card = (event.target as HTMLElement).closest<HTMLButtonElement>('.agenda-card');
  if (card) {
    const agenda = state.agendas.find(item => item.id === Number(card.dataset.id));
    if (agenda) openEditor(agenda);
    return;
  }
  const slot = (event.target as HTMLElement).closest<HTMLElement>('.slot');
  const column = (event.target as HTMLElement).closest<HTMLElement>('.day-col');
  if (slot && column) {
    openEditor(undefined, new Date(`${column.dataset.date}T00:00:00`), Number(slot.dataset.hour));
  }
};

$('#delete').onclick = () => $('#confirm').classList.remove('hidden');
$('#cancel-delete').onclick = () => $('#confirm').classList.add('hidden');
$('#confirm-delete').onclick = async () => {
  if (!state.editing) return;
  try {
    await DeleteAgenda(state.editing.id);
    $('#confirm').classList.add('hidden');
    closeEditor();
    toast('Agenda berhasil dihapus.', 'success');
    await load();
  } catch (error) {
    toast(String(error), 'error');
  }
};

$('#dismiss').onclick = () => $('#alarm-modal').classList.add('hidden');
EventsOn('agenda:alarm', (agenda: Agenda) => {
  $('#alarm-title').textContent = agenda.title;
  $('#alarm-detail').textContent = `${new Date(agenda.startAt).toLocaleString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}${agenda.description ? ` — ${agenda.description}` : ''}`;
  $('#alarm-modal').classList.remove('hidden');
});
EventsOn('agenda:changed', load);
EventsOn('colors:changed', loadColors);

function toast(message: string, kind: 'success' | 'error') {
  const element = document.createElement('div');
  element.className = `toast ${kind}`;
  element.textContent = message.replace(/^Error:\s*/, '');
  $('#toasts').append(element);
  setTimeout(() => element.remove(), 4200);
}

loadColors();
load();
setInterval(renderCalendar, 60000);
