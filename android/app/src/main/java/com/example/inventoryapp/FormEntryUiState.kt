package com.example.inventoryapp

data class FormEntryUiState(
    val medicationName: String = "",
    val medicationQuantity: Int = 0,
    val medicationStrength: String = "",
    val medicationLocation: String = "",
    val onMedicationNameChange: (String) -> Unit = {},
    val onMedicationQuantityChange: (Int) -> Unit = {},
    val onMedicationStrengthChange: (String) -> Unit = {},
    val onMedicationLocationChange: (String) -> Unit = {},
    var onRecordVoiceNoteClicked: () -> Unit = {},
    val snackbarText: String = "",
)
