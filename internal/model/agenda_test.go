package model

import (
	"testing"
	"time"
)

func TestAgendaValidate(t *testing.T) {
	start := time.Now().Add(time.Hour).Truncate(time.Second)
	valid := Agenda{Title: " Rapat ", StartAt: start.Format(time.RFC3339), EndAt: start.Add(time.Hour).Format(time.RFC3339), Color: "invalid", AlarmOffset: 10}
	if err := valid.Validate(); err != nil {
		t.Fatalf("agenda valid ditolak: %v", err)
	}
	if valid.Title != "Rapat" || valid.Color != "blue" {
		t.Fatalf("normalisasi gagal: %+v", valid)
	}
	valid.EndAt = valid.StartAt
	if err := valid.Validate(); err == nil {
		t.Fatal("waktu selesai yang sama seharusnya ditolak")
	}
}
