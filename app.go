package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"ReCall/internal/model"
	"ReCall/internal/repository"
	"ReCall/internal/service"
	toast "git.sr.ht/~jackmordaunt/go-toast/v2"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx       context.Context
	repo      *repository.SQLiteRepository
	scheduler *service.Scheduler
	startErr  error
}

func NewApp() *App { return &App{} }

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	base, err := os.UserConfigDir()
	if err != nil {
		a.startErr = fmt.Errorf("lokasi data aplikasi tidak tersedia: %w", err)
		return
	}
	a.repo, err = repository.Open(filepath.Join(base, "ReCall"))
	if err != nil {
		a.startErr = err
		return
	}
	a.scheduler = service.NewScheduler(a.repo, a.notify)
	a.scheduler.Start()
}

func (a *App) shutdown(context.Context) {
	if a.scheduler != nil {
		a.scheduler.Stop()
	}
	if a.repo != nil {
		_ = a.repo.Close()
	}
}

func (a *App) ready() error {
	if a.startErr != nil {
		return a.startErr
	}
	if a.repo == nil {
		return errors.New("database belum siap")
	}
	return nil
}

func (a *App) ListAgendas(from, to string) ([]model.Agenda, error) {
	if err := a.ready(); err != nil {
		return nil, err
	}
	start, err := time.Parse(time.RFC3339, from)
	if err != nil {
		return nil, errors.New("tanggal awal tidak valid")
	}
	end, err := time.Parse(time.RFC3339, to)
	if err != nil || !end.After(start) {
		return nil, errors.New("tanggal akhir tidak valid")
	}
	if end.Sub(start) > 62*24*time.Hour {
		return nil, errors.New("rentang kalender maksimal 62 hari")
	}
	return a.repo.ListRange(a.ctx, start, end)
}

func (a *App) SaveAgenda(agenda model.Agenda) (model.Agenda, error) {
	if err := a.ready(); err != nil {
		return model.Agenda{}, err
	}
	saved, err := a.repo.Save(a.ctx, &agenda)
	if err == nil {
		runtime.EventsEmit(a.ctx, "agenda:changed")
	}
	return saved, err
}

func (a *App) DeleteAgenda(id int64) error {
	if err := a.ready(); err != nil {
		return err
	}
	if err := a.repo.Delete(a.ctx, id); err != nil {
		return err
	}
	runtime.EventsEmit(a.ctx, "agenda:changed")
	return nil
}

func (a *App) HideWindow() {
	runtime.WindowHide(a.ctx)
}

func (a *App) ShowWindow() {
	runtime.WindowShow(a.ctx)
	runtime.WindowUnminimise(a.ctx)
}

func (a *App) Quit() { runtime.Quit(a.ctx) }

func (a *App) notify(agenda model.Agenda) {
	start, _ := time.Parse(time.RFC3339, agenda.StartAt)
	message := fmt.Sprintf("Dimulai pukul %s", start.Local().Format("15:04"))
	if agenda.Description != "" {
		message += " — " + agenda.Description
	}
	notification := toast.Notification{AppID: "ReCall", Title: agenda.Title, Body: message, Audio: toast.Default}
	_ = notification.Push()
	runtime.EventsEmit(a.ctx, "agenda:alarm", agenda)
}
