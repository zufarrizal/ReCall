package model

import "testing"

func TestColorCategoryValidate(t *testing.T) {
	category := ColorCategory{Key: " TEAL ", Name: "  Kesehatan  "}
	if err := category.Validate(); err != nil {
		t.Fatalf("kategori valid ditolak: %v", err)
	}
	if category.Key != "teal" || category.Name != "Kesehatan" {
		t.Fatalf("normalisasi kategori gagal: %+v", category)
	}

	invalid := []ColorCategory{
		{Key: "../blue", Name: "Agenda"},
		{Key: "blue", Name: " "},
		{Key: "blue", Name: "12345678901234567890123456789012345678901"},
	}
	for _, item := range invalid {
		if err := item.Validate(); err == nil {
			t.Fatalf("kategori tidak valid diterima: %+v", item)
		}
	}
}
