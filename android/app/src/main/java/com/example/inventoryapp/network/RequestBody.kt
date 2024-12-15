package com.example.inventoryapp.network

import kotlinx.serialization.Serializable

@Serializable
data class RequestBody(
    val name: String = "",
    val strength: String = "",
    val location: String = "",
    val quantity: Int = 0,
)
