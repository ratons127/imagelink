package com.taskflow.mobile.data.auth

import android.content.Context

class TokenManager(context: Context) {
  private val prefs = context.getSharedPreferences("taskflow_auth", Context.MODE_PRIVATE)

  fun getAccessToken(): String? = prefs.getString(KEY_ACCESS, null)

  fun getRefreshToken(): String? = prefs.getString(KEY_REFRESH, null)

  fun saveTokens(accessToken: String?, refreshToken: String?) {
    prefs.edit().apply {
      if (accessToken != null) putString(KEY_ACCESS, accessToken)
      if (refreshToken != null) putString(KEY_REFRESH, refreshToken)
    }.apply()
  }

  fun clear() {
    prefs.edit().remove(KEY_ACCESS).remove(KEY_REFRESH).apply()
  }

  companion object {
    private const val KEY_ACCESS = "accessToken"
    private const val KEY_REFRESH = "refreshToken"
  }
}

