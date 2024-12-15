package com.example.inventoryapp

import androidx.compose.material3.Button
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

@Composable
fun EntryFormContainer(uiState: FormEntryUiState, onSubmitClicked: () -> Unit) {
    val snackBarHostState = remember { SnackbarHostState() }

    Scaffold(
        modifier = Modifier.padding(16.dp),
        snackbarHost = { SnackbarHost(hostState = snackBarHostState) }) { contentPadding ->
        if (uiState.snackbarText.isNotEmpty()) {
            LaunchedEffect(key1 = uiState.snackbarText) {
                snackBarHostState.showSnackbar(uiState.snackbarText)
            }
        }

        Column(
            modifier = Modifier.padding(contentPadding),
            horizontalAlignment = CenterHorizontally
        ) {
            VoiceNoteSection()

            Text(text = "--- OR ---")

            TextInputFieldsSection(uiState = uiState)

            Button(
                modifier = Modifier.padding(top = 16.dp),
                onClick = { onSubmitClicked() }
            ) {
                Text("Submit")
            }
        }
    }
}

@Composable
fun VoiceNoteSection() {
    Text(text = "Upload inventory note by voice")

    Button(
        modifier = Modifier.padding(top = 16.dp),
        colors = ButtonDefaults.buttonColors(contentColor = Color.White),
        onClick = { }
    ) {
        Icon(
            painter = painterResource(id = R.drawable.baseline_keyboard_voice_24),
            contentDescription = "Record voice note"
        )
        Text(text = "Upload Voice Entry")
    }

    Spacer(Modifier.height(32.dp))
}

@Composable
fun TextInputFieldsSection(uiState: FormEntryUiState) {
    Spacer(Modifier.height(32.dp))

    OutlinedTextField(
        modifier = Modifier
            .fillMaxWidth(),
        value = uiState.medicationName,
        onValueChange = { uiState.onMedicationNameChange(it) },
        label = { Text("Medication Name") },
        placeholder = { Text("Ex: Paracetamol") }
    )

    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
        value = uiState.medicationQuantity.toString(),
        onValueChange = { uiState.onMedicationQuantityChange(it.toInt()) },
        label = { Text("Medication Quantity") },
        placeholder = { Text("Ex: 10") }
    )

    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = uiState.medicationLocation,
        onValueChange = { uiState.onMedicationLocationChange(it) },
        label = { Text("Medication Location") },
        placeholder = { Text("Ex: Rafah") }
    )

    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = uiState.medicationStrength,
        onValueChange = { uiState.onMedicationStrengthChange(it) },
        label = { Text("Medication Strength") },
        placeholder = { Text("Ex: 100mg") }
    )
}
