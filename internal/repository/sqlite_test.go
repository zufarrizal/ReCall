package repository

import (
	"context"
	"testing"
	"time"

	"ReCall/internal/model"
)

func TestSQLiteCRUDAndDue(t *testing.T) {
	repo, err := Open(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	defer repo.Close()
	now := time.Now().Truncate(time.Second)
	item, err := repo.Save(context.Background(), &model.Agenda{
		Title: "Tes alarm", StartAt: now.Add(5 * time.Minute).Format(time.RFC3339),
		EndAt: now.Add(time.Hour).Format(time.RFC3339), Color: "green", Alarm: true, AlarmOffset: 10,
	})
	if err != nil {
		t.Fatal(err)
	}
	items, err := repo.ListRange(context.Background(), now, now.Add(24*time.Hour))
	if err != nil || len(items) != 1 {
		t.Fatalf("list gagal: items=%d err=%v", len(items), err)
	}
	due, err := repo.Due(context.Background(), now)
	if err != nil || len(due) != 1 {
		t.Fatalf("agenda jatuh tempo tidak ditemukan: items=%d err=%v", len(due), err)
	}
	if err = repo.MarkNotified(context.Background(), item.ID, now); err != nil {
		t.Fatal(err)
	}
	due, _ = repo.Due(context.Background(), now)
	if len(due) != 0 {
		t.Fatal("agenda yang sudah diberitahukan muncul kembali")
	}
	if err = repo.Delete(context.Background(), item.ID); err != nil {
		t.Fatal(err)
	}
}

func TestSQLiteColorCategoriesCanBeRenamed(t *testing.T) {
	repo, err := Open(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	defer repo.Close()
	ctx := context.Background()

	categories, err := repo.ListColorCategories(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if len(categories) != 10 {
		t.Fatalf("jumlah warna=%d, ingin 10", len(categories))
	}
	if categories[0].Key != "blue" || categories[0].Name != "Kegiatan" {
		t.Fatalf("warna awal tidak sesuai: %+v", categories[0])
	}

	updated, err := repo.SaveColorCategories(ctx, []model.ColorCategory{
		{Key: "blue", Name: "Pekerjaan"},
		{Key: "cyan", Name: "Kuliah"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if updated[0].Name != "Pekerjaan" || updated[5].Name != "Kuliah" {
		t.Fatalf("nama warna tidak tersimpan: %+v", updated)
	}

	if _, err = repo.SaveColorCategories(ctx, []model.ColorCategory{
		{Key: "unknown", Name: "Tidak Ada"},
	}); err == nil {
		t.Fatal("warna yang tidak tersedia seharusnya ditolak")
	}

	now := time.Now().Truncate(time.Second)
	if _, err = repo.Save(ctx, &model.Agenda{
		Title: "Warna asing", StartAt: now.Format(time.RFC3339),
		EndAt: now.Add(time.Hour).Format(time.RFC3339), Color: "unknown",
	}); err == nil {
		t.Fatal("agenda dengan warna yang tidak tersedia seharusnya ditolak")
	}
}

func TestSQLiteColorCategoryNamePersistsAfterReopen(t *testing.T) {
	appDir := t.TempDir()
	repo, err := Open(appDir)
	if err != nil {
		t.Fatal(err)
	}
	ctx := context.Background()
	if _, err = repo.SaveColorCategories(ctx, []model.ColorCategory{
		{Key: "blue", Name: "Pekerjaan"},
	}); err != nil {
		t.Fatal(err)
	}
	if err = repo.Close(); err != nil {
		t.Fatal(err)
	}

	reopened, err := Open(appDir)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	categories, err := reopened.ListColorCategories(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if categories[0].Name != "Pekerjaan" {
		t.Fatalf("nama warna ditimpa saat migrasi ulang: %+v", categories[0])
	}
}
