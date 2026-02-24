package com.taskflow.mobile.data.repo

import com.taskflow.mobile.data.api.AuthApi
import com.taskflow.mobile.data.api.CreateListRequest
import com.taskflow.mobile.data.api.CreateTaskRequest
import com.taskflow.mobile.data.api.LoginRequest
import com.taskflow.mobile.data.api.RegisterRequest
import com.taskflow.mobile.data.api.TaskDto
import com.taskflow.mobile.data.api.TaskFlowApi
import com.taskflow.mobile.data.api.TaskListDto
import com.taskflow.mobile.data.api.UpdateTaskRequest
import com.taskflow.mobile.data.api.UserProfile
import com.taskflow.mobile.data.auth.TokenManager

class TaskFlowRepository(
  private val api: TaskFlowApi,
  private val authApi: AuthApi,
  private val tokenManager: TokenManager
) {
  fun hasSession(): Boolean = !tokenManager.getAccessToken().isNullOrBlank()

  suspend fun login(email: String, password: String) {
    val tokens = authApi.login(LoginRequest(email = email, password = password))
    tokenManager.saveTokens(tokens.accessToken, tokens.refreshToken)
  }

  suspend fun register(email: String, password: String, phone: String) {
    val tokens = authApi.register(RegisterRequest(email = email, password = password, phone = phone))
    tokenManager.saveTokens(tokens.accessToken, tokens.refreshToken)
  }

  fun logout() = tokenManager.clear()

  suspend fun me(): UserProfile = api.getMe()

  suspend fun lists(): List<TaskListDto> = api.getLists()

  suspend fun createList(name: String): TaskListDto = api.createList(CreateListRequest(name))

  suspend fun tasks(listId: String?): List<TaskDto> = api.getTasks(listId = listId).items

  suspend fun createTask(listId: String, title: String): TaskDto =
    api.createTask(CreateTaskRequest(listId = listId, title = title))

  suspend fun setTaskDone(task: TaskDto, done: Boolean): TaskDto =
    api.updateTask(task.id, UpdateTaskRequest(status = if (done) "done" else "todo"))
}
