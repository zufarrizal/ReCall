package main

import (
	"context"
	"embed"

	"github.com/getlantern/systray"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/windows/icon.ico
var trayIcon []byte

func main() {
	app := NewApp()
	go systray.Run(func() {
		systray.SetIcon(trayIcon)
		systray.SetTitle("ReCall")
		systray.SetTooltip("ReCall — Agenda & Pengingat")
		show := systray.AddMenuItem("Buka ReCall", "Tampilkan kalender")
		quit := systray.AddMenuItem("Keluar", "Tutup ReCall")
		go func() {
			for {
				select {
				case <-show.ClickedCh:
					app.ShowWindow()
				case <-quit.ClickedCh:
					app.Quit()
					return
				}
			}
		}()
	}, func() {})

	err := wails.Run(&options.App{
		Title:     "ReCall",
		Width:     1280,
		Height:    820,
		MinWidth:  900,
		MinHeight: 620,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 246, G: 247, B: 251, A: 1},
		OnStartup:        app.startup,
		OnShutdown:       app.shutdown,
		OnBeforeClose: func(ctx context.Context) bool {
			app.HideWindow()
			return true
		},
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
		},
		Bind: []interface{}{
			app,
		},
	})

	systray.Quit()
	if err != nil {
		println("Error:", err.Error())
	}
}
