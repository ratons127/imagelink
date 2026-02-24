package com.taskflow.mobile.data.network

import com.taskflow.mobile.data.auth.TokenManager
import okhttp3.Interceptor
import okhttp3.Response

class AuthHeaderInterceptor(
  private val tokenManager: TokenManager
) : Interceptor {
  override fun intercept(chain: Interceptor.Chain): Response {
    val access = tokenManager.getAccessToken()
    val request = if (access.isNullOrBlank()) {
      chain.request()
    } else {
      chain.request().newBuilder()
        .header("Authorization", "Bearer $access")
        .build()
    }
    return chain.proceed(request)
  }
}

