package com.example.inventoryapp.network

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface InventoryApi {

    @POST("medication")
    @Headers("Content-Type: application/json",)
    fun postVoiceNote(@Body requestBody: RequestBody): Call<RequestBody>

}
