package com.taskflow.mobile.data.api

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface TaskFlowApi {
  @GET("users/me")
  suspend fun getMe(): UserProfile

  @GET("task-lists")
  suspend fun getLists(): List<TaskListDto>

  @POST("task-lists")
  suspend fun createList(@Body body: CreateListRequest): TaskListDto

  @GET("tasks")
  suspend fun getTasks(
    @Query("listId") listId: String? = null,
    @Query("page") page: Int = 1,
    @Query("pageSize") pageSize: Int = 50
  ): TaskListResponse

  @POST("tasks")
  suspend fun createTask(@Body body: CreateTaskRequest): TaskDto

  @PUT("tasks/{id}")
  suspend fun updateTask(@Path("id") taskId: String, @Body body: UpdateTaskRequest): TaskDto
}

