//go:build !windows

package service

// PlayAlarmSound is intentionally silent outside Windows.
func PlayAlarmSound() error { return nil }
