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
