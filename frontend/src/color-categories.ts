export interface ColorCategoryView {
  key: string;
  name: string;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!,
  );
}

export function colorOptions(categories: ColorCategoryView[]): string {
  return categories
    .map(category => `<option value="${escapeHtml(category.key)}">${escapeHtml(category.name)}</option>`)
    .join('');
}

export function colorLegend(categories: ColorCategoryView[]): string {
  if (categories.length === 0) {
    return '<span class="empty">Belum ada kategori warna.</span>';
  }
  return categories
    .map(category => `<span><i class="color-swatch ${escapeHtml(category.key)}"></i>${escapeHtml(category.name)}</span>`)
    .join('');
}

export function colorEditorRows(categories: ColorCategoryView[]): string {
  return categories
    .map(
      (category, index) => `<label class="color-name-row">
        <i class="color-swatch ${escapeHtml(category.key)}"></i>
        <span><small>Warna ${index + 1}</small><input data-color-key="${escapeHtml(category.key)}" value="${escapeHtml(category.name)}" maxlength="40" required></span>
      </label>`,
    )
    .join('');
}
