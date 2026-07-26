package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"ReCall/internal/model"
	_ "modernc.org/sqlite"
)

type SQLiteRepository struct {
	db *sql.DB
}

func Open(appDir string) (*SQLiteRepository, error) {
	if err := os.MkdirAll(appDir, 0o700); err != nil {
		return nil, fmt.Errorf("membuat direktori data: %w", err)
	}
	db, err := sql.Open("sqlite", filepath.Join(appDir, "recall.db"))
	if err != nil {
		return nil, fmt.Errorf("membuka database: %w", err)
	}
	db.SetMaxOpenConns(1)
	if _, err = db.Exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;`); err != nil {
		db.Close()
		return nil, fmt.Errorf("mengonfigurasi database: %w", err)
	}
	repo := &SQLiteRepository{db: db}
	if err = repo.migrate(); err != nil {
		db.Close()
		return nil, err
	}
	return repo, nil
}

func (r *SQLiteRepository) migrate() error {
	_, err := r.db.Exec(`
CREATE TABLE IF NOT EXISTS agendas (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 120),
	description TEXT NOT NULL DEFAULT '',
	start_at TEXT NOT NULL,
	end_at TEXT NOT NULL,
	color TEXT NOT NULL DEFAULT 'blue',
	alarm INTEGER NOT NULL DEFAULT 1,
	alarm_offset INTEGER NOT NULL DEFAULT 10 CHECK(alarm_offset BETWEEN 0 AND 10080),
	notified_at TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_agendas_start_at ON agendas(start_at);
CREATE INDEX IF NOT EXISTS idx_agendas_alarm ON agendas(alarm, start_at, notified_at);`)
	if err != nil {
		return fmt.Errorf("migrasi database: %w", err)
	}
	return nil
}

func (r *SQLiteRepository) ListRange(ctx context.Context, from, to time.Time) ([]model.Agenda, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id,title,description,start_at,end_at,color,alarm,alarm_offset,
COALESCE(notified_at,''),created_at,updated_at FROM agendas
WHERE start_at < ? AND end_at > ? ORDER BY start_at`, to.Format(time.RFC3339), from.Format(time.RFC3339))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]model.Agenda, 0)
	for rows.Next() {
		var a model.Agenda
		if err = rows.Scan(&a.ID, &a.Title, &a.Description, &a.StartAt, &a.EndAt, &a.Color,
			&a.Alarm, &a.AlarmOffset, &a.NotifiedAt, &a.CreatedAt, &a.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, a)
	}
	return items, rows.Err()
}

func (r *SQLiteRepository) Save(ctx context.Context, a *model.Agenda) (model.Agenda, error) {
	if err := a.Validate(); err != nil {
		return model.Agenda{}, err
	}
	now := time.Now().Format(time.RFC3339)
	if a.ID == 0 {
		result, err := r.db.ExecContext(ctx, `INSERT INTO agendas
(title,description,start_at,end_at,color,alarm,alarm_offset,created_at,updated_at)
VALUES(?,?,?,?,?,?,?,?,?)`, a.Title, a.Description, a.StartAt, a.EndAt, a.Color, a.Alarm, a.AlarmOffset, now, now)
		if err != nil {
			return model.Agenda{}, err
		}
		a.ID, _ = result.LastInsertId()
		a.CreatedAt, a.UpdatedAt = now, now
		return *a, nil
	}
	result, err := r.db.ExecContext(ctx, `UPDATE agendas SET title=?,description=?,start_at=?,end_at=?,
color=?,alarm=?,alarm_offset=?,notified_at=NULL,updated_at=? WHERE id=?`,
		a.Title, a.Description, a.StartAt, a.EndAt, a.Color, a.Alarm, a.AlarmOffset, now, a.ID)
	if err != nil {
		return model.Agenda{}, err
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		return model.Agenda{}, errors.New("agenda tidak ditemukan")
	}
	a.UpdatedAt, a.NotifiedAt = now, ""
	return *a, nil
}

func (r *SQLiteRepository) Delete(ctx context.Context, id int64) error {
	if id <= 0 {
		return errors.New("ID agenda tidak valid")
	}
	result, err := r.db.ExecContext(ctx, `DELETE FROM agendas WHERE id=?`, id)
	if err != nil {
		return err
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		return errors.New("agenda tidak ditemukan")
	}
	return nil
}

func (r *SQLiteRepository) Due(ctx context.Context, now time.Time) ([]model.Agenda, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id,title,description,start_at,end_at,color,alarm,alarm_offset,
COALESCE(notified_at,''),created_at,updated_at FROM agendas
WHERE alarm=1 AND notified_at IS NULL AND datetime(start_at, printf('-%d minutes', alarm_offset)) <= datetime(?)
AND datetime(start_at) >= datetime(?, '-1 day') ORDER BY start_at LIMIT 20`,
		now.Format(time.RFC3339), now.Format(time.RFC3339))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []model.Agenda
	for rows.Next() {
		var a model.Agenda
		if err = rows.Scan(&a.ID, &a.Title, &a.Description, &a.StartAt, &a.EndAt, &a.Color,
			&a.Alarm, &a.AlarmOffset, &a.NotifiedAt, &a.CreatedAt, &a.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, a)
	}
	return items, rows.Err()
}

func (r *SQLiteRepository) MarkNotified(ctx context.Context, id int64, at time.Time) error {
	_, err := r.db.ExecContext(ctx, `UPDATE agendas SET notified_at=? WHERE id=?`, at.Format(time.RFC3339), id)
	return err
}

func (r *SQLiteRepository) Close() error { return r.db.Close() }
