package com.taskflow.mobile.data.api

data class AuthTokens(
  val accessToken: String,
  val refreshToken: String
)

data class LoginRequest(
  val email: String,
  val password: String
)

data class RegisterRequest(
  val email: String,
  val password: String,
  val phone: String
)

data class RefreshRequest(
  val refreshToken: String
)

data class UserProfile(
  val id: String,
  val email: String,
  val phone: String?,
  val name: String?,
  val createdAt: String?
)

data class ListMember(
  val id: String,
  val listId: String,
  val userId: String,
  val role: String
)

data class TaskListDto(
  val id: String,
  val name: String,
  val ownerId: String,
  val members: List<ListMember> = emptyList()
)

data class CreateListRequest(
  val name: String
)

data class AssignedUserDto(
  val id: String,
  val email: String?,
  val name: String?
)

data class SubTaskDto(
  val id: String,
  val taskId: String,
  val title: String,
  val done: Boolean,
  val order: Int = 0
)

data class TaskListRefDto(
  val id: String,
  val name: String
)

data class TaskDto(
  val id: String,
  val listId: String,
  val title: String,
  val description: String?,
  val dueDate: String?,
  val reminderTime: String?,
  val priority: String,
  val status: String,
  val tags: List<String> = emptyList(),
  val order: Int = 0,
  val archivedAt: String?,
  val assignedToId: String?,
  val subtasks: List<SubTaskDto> = emptyList(),
  val list: TaskListRefDto? = null,
  val assignedTo: AssignedUserDto? = null
)

data class TaskListResponse(
  val items: List<TaskDto>,
  val total: Int,
  val page: Int,
  val pageSize: Int
)

data class CreateTaskRequest(
  val listId: String,
  val title: String,
  val description: String? = null,
  val priority: String? = null,
  val status: String? = null
)

data class UpdateTaskRequest(
  val title: String? = null,
  val description: String? = null,
  val dueDate: String? = null,
  val reminderTime: String? = null,
  val priority: String? = null,
  val status: String? = null,
  val archivedAt: String? = null
)

