package model

import (
	"errors"
	"strings"
	"time"
)

// Agenda is a scheduled activity stored in local time.
type Agenda struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	StartAt     string `json:"startAt"`
	EndAt       string `json:"endAt"`
	Color       string `json:"color"`
	Alarm       bool   `json:"alarm"`
	AlarmOffset int    `json:"alarmOffset"`
	NotifiedAt  string `json:"notifiedAt,omitempty"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

func (a *Agenda) Validate() error {
	a.Title = strings.TrimSpace(a.Title)
	a.Description = strings.TrimSpace(a.Description)
	if a.Title == "" {
		return errors.New("judul agenda wajib diisi")
	}
	if len(a.Title) > 120 {
		return errors.New("judul agenda maksimal 120 karakter")
	}
	if len(a.Description) > 2000 {
		return errors.New("catatan agenda maksimal 2000 karakter")
	}
	start, err := time.Parse(time.RFC3339, a.StartAt)
	if err != nil {
		return errors.New("waktu mulai tidak valid")
	}
	end, err := time.Parse(time.RFC3339, a.EndAt)
	if err != nil {
		return errors.New("waktu selesai tidak valid")
	}
	if !end.After(start) {
		return errors.New("waktu selesai harus setelah waktu mulai")
	}
	if end.Sub(start) > 7*24*time.Hour {
		return errors.New("durasi agenda maksimal 7 hari")
	}
	if a.AlarmOffset < 0 || a.AlarmOffset > 10080 {
		return errors.New("pengingat harus antara 0 dan 10080 menit")
	}
	a.Color, err = NormalizeColorKey(a.Color)
	if err != nil {
		return err
	}
	return nil
}
