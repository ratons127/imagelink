package com.taskflow.mobile.data

import android.content.Context
import com.google.gson.GsonBuilder
import com.taskflow.mobile.BuildConfig
import com.taskflow.mobile.data.api.AuthApi
import com.taskflow.mobile.data.api.TaskFlowApi
import com.taskflow.mobile.data.auth.TokenManager
import com.taskflow.mobile.data.network.AuthHeaderInterceptor
import com.taskflow.mobile.data.network.RefreshTokenInterceptor
import com.taskflow.mobile.data.repo.TaskFlowRepository
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class AppContainer(context: Context) {
  private val gson = GsonBuilder().create()
  val tokenManager = TokenManager(context)

  private val refreshClient = OkHttpClient.Builder()
    .connectTimeout(20, TimeUnit.SECONDS)
    .readTimeout(20, TimeUnit.SECONDS)
    .build()

  private val refreshRetrofit = Retrofit.Builder()
    .baseUrl(BuildConfig.API_BASE_URL)
    .client(refreshClient)
    .addConverterFactory(GsonConverterFactory.create(gson))
    .build()

  private val authApi: AuthApi = refreshRetrofit.create(AuthApi::class.java)

  private val apiClient = OkHttpClient.Builder()
    .connectTimeout(20, TimeUnit.SECONDS)
    .readTimeout(20, TimeUnit.SECONDS)
    .addInterceptor(AuthHeaderInterceptor(tokenManager))
    .addInterceptor(RefreshTokenInterceptor(tokenManager, authApi))
    .apply {
      if (BuildConfig.DEBUG) {
        addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
      }
    }
    .build()

  private val retrofit = Retrofit.Builder()
    .baseUrl(BuildConfig.API_BASE_URL)
    .client(apiClient)
    .addConverterFactory(GsonConverterFactory.create(gson))
    .build()

  private val api: TaskFlowApi = retrofit.create(TaskFlowApi::class.java)

  val repository = TaskFlowRepository(
    api = api,
    authApi = authApi,
    tokenManager = tokenManager
  )
}
