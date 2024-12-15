package com.example.inventoryapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.collectAsState
import com.example.inventoryapp.ui.theme.InventoryAppTheme

class MainActivity : ComponentActivity() {
    private val viewModel = FormEntryViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        viewModel.init()
        setContent {
            InventoryAppTheme {
                EntryFormContainer(
                    viewModel.uiState.collectAsState().value,
                    onSubmitClicked = { viewModel.submitForm() }
                )
            }
        }
    }
}
