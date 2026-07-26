package service

import (
	"context"
	"log"
	"sync"
	"time"

	"ReCall/internal/model"
	"ReCall/internal/repository"
)

type Scheduler struct {
	repo   *repository.SQLiteRepository
	notify func(model.Agenda)
	stop   chan struct{}
	once   sync.Once
}

func NewScheduler(repo *repository.SQLiteRepository, notify func(model.Agenda)) *Scheduler {
	return &Scheduler{repo: repo, notify: notify, stop: make(chan struct{})}
}

func (s *Scheduler) Start() {
	go func() {
		s.check()
		ticker := time.NewTicker(20 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				s.check()
			case <-s.stop:
				return
			}
		}
	}()
}

func (s *Scheduler) check() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	now := time.Now()
	items, err := s.repo.Due(ctx, now)
	if err != nil {
		log.Printf("scheduler: %v", err)
		return
	}
	for _, item := range items {
		s.notify(item)
		if err := s.repo.MarkNotified(ctx, item.ID, now); err != nil {
			log.Printf("mark notified agenda %d: %v", item.ID, err)
		}
	}
}

func (s *Scheduler) Stop() { s.once.Do(func() { close(s.stop) }) }
