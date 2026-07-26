//go:build windows

package service

import (
	"errors"
	"syscall"
	"time"
)

var beepProc = syscall.NewLazyDLL("kernel32.dll").NewProc("Beep")

type alarmTone struct {
	frequency uint32
	duration  uint32
}

var alarmPattern = []alarmTone{
	{frequency: 880, duration: 320},
	{frequency: 1046, duration: 320},
	{frequency: 880, duration: 500},
}

// PlayAlarmSound plays an application-controlled Windows alarm. It is a
// fallback for machines where toast notification audio is disabled.
func PlayAlarmSound() error {
	for index, tone := range alarmPattern {
		result, _, callErr := beepProc.Call(uintptr(tone.frequency), uintptr(tone.duration))
		if result == 0 {
			if callErr != syscall.Errno(0) {
				return callErr
			}
			return errors.New("Windows tidak dapat memutar bunyi alarm")
		}
		if index < len(alarmPattern)-1 {
			time.Sleep(100 * time.Millisecond)
		}
	}
	return nil
}
