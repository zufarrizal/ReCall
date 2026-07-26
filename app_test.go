package main

import (
	"context"
	"testing"
)

func TestBeforeCloseAllowsExplicitQuit(t *testing.T) {
	app := NewApp()
	app.quit.Store(true)
	if app.beforeClose(context.Background()) {
		t.Fatal("explicit quit must not be cancelled")
	}
}
