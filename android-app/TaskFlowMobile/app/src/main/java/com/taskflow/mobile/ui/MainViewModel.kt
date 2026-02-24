package com.taskflow.mobile.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.taskflow.mobile.data.AppContainer
import com.taskflow.mobile.data.api.TaskDto
import com.taskflow.mobile.data.api.TaskListDto
import com.taskflow.mobile.data.api.UserProfile
import com.taskflow.mobile.data.repo.TaskFlowRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class MainUiState(
  val loading: Boolean = false,
  val isAuthenticated: Boolean = false,
  val user: UserProfile? = null,
  val lists: List<TaskListDto> = emptyList(),
  val selectedListId: String? = null,
  val tasks: List<TaskDto> = emptyList(),
  val authMode: AuthMode = AuthMode.Login,
  val errorMessage: String? = null
)

enum class AuthMode { Login, Register }

class MainViewModel(
  private val repo: TaskFlowRepository
) : ViewModel() {
  private val _uiState = MutableStateFlow(MainUiState())
  val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()

  init {
    if (repo.hasSession()) {
      refreshAll()
    }
  }

  fun setAuthMode(mode: AuthMode) {
    _uiState.update { it.copy(authMode = mode, errorMessage = null) }
  }

  fun login(email: String, password: String) = launchAction {
    repo.login(email.trim(), password)
    refreshAllInternal()
  }

  fun register(email: String, password: String, phone: String) = launchAction {
    repo.register(email.trim(), password, phone.trim())
    refreshAllInternal()
  }

  fun logout() {
    repo.logout()
    _uiState.value = MainUiState()
  }

  fun refreshAll() = launchAction { refreshAllInternal() }

  fun selectList(listId: String) {
    _uiState.update { it.copy(selectedListId = listId) }
    launchAction {
      _uiState.update { it.copy(tasks = repo.tasks(listId)) }
    }
  }

  fun ensureDefaultList() = launchAction {
    if (repo.lists().isEmpty()) {
      repo.createList("My Tasks")
    }
    refreshAllInternal()
  }

  fun createTask(title: String) {
    val listId = _uiState.value.selectedListId ?: return
    if (title.isBlank()) return
    launchAction {
      repo.createTask(listId, title.trim())
      _uiState.update { it.copy(tasks = repo.tasks(listId)) }
    }
  }

  fun toggleDone(task: TaskDto) = launchAction {
    val done = task.status == "done"
    repo.setTaskDone(task, !done)
    val listId = _uiState.value.selectedListId
    _uiState.update { it.copy(tasks = repo.tasks(listId)) }
  }

  private suspend fun refreshAllInternal() {
    val user = repo.me()
    val lists = repo.lists()
    val selected = _uiState.value.selectedListId ?: lists.firstOrNull()?.id
    val tasks = if (selected != null) repo.tasks(selected) else emptyList()
    _uiState.update {
      it.copy(
        isAuthenticated = true,
        user = user,
        lists = lists,
        selectedListId = selected,
        tasks = tasks,
        errorMessage = null
      )
    }
  }

  private fun launchAction(block: suspend () -> Unit) {
    viewModelScope.launch {
      _uiState.update { it.copy(loading = true, errorMessage = null) }
      try {
        block()
      } catch (e: Exception) {
        if (!repo.hasSession()) {
          _uiState.update { it.copy(isAuthenticated = false, user = null, lists = emptyList(), tasks = emptyList()) }
        }
        _uiState.update { it.copy(errorMessage = e.message ?: "Request failed") }
      } finally {
        _uiState.update { it.copy(loading = false) }
      }
    }
  }

  companion object {
    fun factory(container: AppContainer): ViewModelProvider.Factory =
      object : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
          return MainViewModel(container.repository) as T
        }
      }
  }
}

