package com.taskflow.mobile.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.taskflow.mobile.data.AppContainer
import com.taskflow.mobile.data.api.TaskDto
import com.taskflow.mobile.data.api.TaskListDto
import com.taskflow.mobile.data.api.UserProfile
import com.taskflow.mobile.data.repo.TaskFlowRepository
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicLong

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
  private val activeActionCount = AtomicInteger(0)
  private val taskLoadGeneration = AtomicLong(0L)

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
    _uiState.update { it.copy(selectedListId = listId, tasks = emptyList()) }
    val generation = taskLoadGeneration.incrementAndGet()
    launchAction {
      val tasks = repo.tasks(listId)
      if (taskLoadGeneration.get() == generation && _uiState.value.selectedListId == listId) {
        _uiState.update { it.copy(tasks = tasks) }
      }
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
      val tasks = repo.tasks(listId)
      if (_uiState.value.selectedListId == listId) {
        _uiState.update { it.copy(tasks = tasks) }
      }
    }
  }

  fun toggleDone(task: TaskDto) = launchAction {
    val done = task.status == "done"
    repo.setTaskDone(task, !done)
    val listId = _uiState.value.selectedListId ?: task.listId
    val tasks = repo.tasks(listId)
    if (_uiState.value.selectedListId == listId) {
      _uiState.update { it.copy(tasks = tasks) }
    }
  }

  private suspend fun refreshAllInternal() {
    val user = repo.me()
    val lists = repo.lists()
    val selected = _uiState.value.selectedListId
      ?.takeIf { currentId -> lists.any { it.id == currentId } }
      ?: lists.firstOrNull()?.id
    val generation = if (selected != null) taskLoadGeneration.incrementAndGet() else null
    val tasks = if (selected != null) repo.tasks(selected) else emptyList()

    _uiState.update { current ->
      val finalSelected = current.selectedListId
        ?.takeIf { currentId -> lists.any { it.id == currentId } }
        ?: selected
      val canApplyTasks = generation != null &&
        taskLoadGeneration.get() == generation &&
        finalSelected == selected
      current.copy(
        isAuthenticated = true,
        user = user,
        lists = lists,
        selectedListId = finalSelected,
        tasks = when {
          canApplyTasks -> tasks
          finalSelected == current.selectedListId -> current.tasks
          else -> emptyList()
        },
        errorMessage = null
      )
    }
  }

  private fun launchAction(block: suspend () -> Unit) {
    viewModelScope.launch {
      activeActionCount.incrementAndGet()
      _uiState.update { it.copy(loading = true, errorMessage = null) }
      try {
        block()
      } catch (e: CancellationException) {
        throw e
      } catch (e: Exception) {
        if (!repo.hasSession()) {
          _uiState.update { it.copy(isAuthenticated = false, user = null, lists = emptyList(), tasks = emptyList()) }
        }
        _uiState.update { it.copy(errorMessage = e.message ?: "Request failed") }
      } finally {
        val remaining = activeActionCount.decrementAndGet().coerceAtLeast(0)
        _uiState.update { it.copy(loading = remaining > 0) }
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
