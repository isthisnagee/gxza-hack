package com.example.inventoryapp.network

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RetrofitBuilder {
    private var retrofit: Retrofit
    private val BASE_URL = "https://tmp-morning-sun-9892.fly.dev"

    init {
        retrofit = Retrofit.Builder()
            .client(OkHttpClient())
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    fun getApiInterface(): InventoryApi {
        return retrofit.create(InventoryApi::class.java)
    }
}
