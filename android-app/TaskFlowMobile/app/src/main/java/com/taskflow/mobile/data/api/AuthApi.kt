package com.taskflow.mobile.data.api

import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
  @POST("auth/login")
  suspend fun login(@Body body: LoginRequest): AuthTokens

  @POST("auth/register")
  suspend fun register(@Body body: RegisterRequest): AuthTokens

  @POST("auth/refresh")
  suspend fun refresh(@Body body: RefreshRequest): AuthTokens
}

