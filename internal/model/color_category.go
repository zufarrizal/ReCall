package model

import (
	"errors"
	"regexp"
	"strings"
	"unicode/utf8"
)

var colorKeyPattern = regexp.MustCompile(`^[a-z][a-z0-9-]{0,23}$`)

// ColorCategory maps a safe visual color key to a user-defined display name.
type ColorCategory struct {
	Key  string `json:"key"`
	Name string `json:"name"`
}

func (c *ColorCategory) Validate() error {
	c.Key = strings.TrimSpace(strings.ToLower(c.Key))
	c.Name = strings.TrimSpace(c.Name)
	if !colorKeyPattern.MatchString(c.Key) {
		return errors.New("kode warna tidak valid")
	}
	if c.Name == "" {
		return errors.New("nama warna wajib diisi")
	}
	if utf8.RuneCountInString(c.Name) > 40 {
		return errors.New("nama warna maksimal 40 karakter")
	}
	return nil
}

func NormalizeColorKey(value string) (string, error) {
	value = strings.TrimSpace(strings.ToLower(value))
	if value == "" {
		return "blue", nil
	}
	if !colorKeyPattern.MatchString(value) {
		return "", errors.New("warna agenda tidak valid")
	}
	return value, nil
}
