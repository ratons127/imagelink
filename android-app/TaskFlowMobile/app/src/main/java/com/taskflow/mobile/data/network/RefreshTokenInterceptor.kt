package com.taskflow.mobile.data.network

import com.taskflow.mobile.data.api.AuthApi
import com.taskflow.mobile.data.api.RefreshRequest
import com.taskflow.mobile.data.auth.TokenManager
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response

class RefreshTokenInterceptor(
  private val tokenManager: TokenManager,
  private val authApi: AuthApi
) : Interceptor {
  private val lock = Any()

  override fun intercept(chain: Interceptor.Chain): Response {
    val request = chain.request()
    val response = chain.proceed(request)

    if (response.code != 401) return response
    if (request.url.encodedPath.endsWith("/auth/refresh")) return response
    if (request.header(RETRY_HEADER) == "1") return response

    val newAccess = synchronized(lock) {
      val activeAccess = tokenManager.getAccessToken()
      val activeHeader = activeAccess?.let { "Bearer $it" }
      if (!activeAccess.isNullOrBlank() && activeHeader != request.header("Authorization")) {
        activeAccess
      } else {
        refreshBlocking()
      }
    } ?: return response

    response.close()
    val retried = request.newBuilder()
      .header("Authorization", "Bearer $newAccess")
      .header(RETRY_HEADER, "1")
      .build()
    return chain.proceed(retried)
  }

  private fun refreshBlocking(): String? {
    val refreshToken = tokenManager.getRefreshToken() ?: return null
    return try {
      val tokens = runBlocking { authApi.refresh(RefreshRequest(refreshToken)) }
      tokenManager.saveTokens(tokens.accessToken, tokens.refreshToken)
      tokens.accessToken
    } catch (_: Exception) {
      tokenManager.clear()
      null
    }
  }

  companion object {
    private const val RETRY_HEADER = "X-TaskFlow-Retry"
  }
}

