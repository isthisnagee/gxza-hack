package com.example.inventoryapp

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.inventoryapp.network.InventoryApi
import com.example.inventoryapp.network.RequestBody
import com.example.inventoryapp.network.RetrofitBuilder
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.Callback

class FormEntryViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(FormEntryUiState())
    val uiState: StateFlow<FormEntryUiState> = _uiState.asStateFlow()
    private lateinit var inventoryService: InventoryApi

    fun init() {
        inventoryService = RetrofitBuilder().getApiInterface()
    }

    fun submitForm() {

        val requestBody = RequestBody(
            name = _uiState.value.medicationName,
            strength = _uiState.value.medicationStrength,
            location = _uiState.value.medicationLocation,
            quantity = _uiState.value.medicationQuantity
        )

        viewModelScope.launch {
            inventoryService.postVoiceNote(requestBody = requestBody).enqueue(object : Callback<RequestBody> {
                override fun onResponse(call: retrofit2.Call<RequestBody>, response: retrofit2.Response<RequestBody>) {

                    println("<><> $response")
                    updateSnackBarText(textToShow = "Successfully uploaded")
                }

                override fun onFailure(call: retrofit2.Call<RequestBody>, t: Throwable) {
                    updateSnackBarText()
                }
            })
        }
    }

    fun updateSnackBarText(textToShow: String = "") {
        _uiState.value = _uiState.value.copy(snackbarText = textToShow)
    }
}
