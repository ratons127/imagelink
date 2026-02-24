package com.taskflow.mobile.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.taskflow.mobile.BuildConfig
import com.taskflow.mobile.data.AppContainer
import com.taskflow.mobile.data.api.TaskDto

@Composable
fun TaskFlowApp(container: AppContainer) {
  val vm: MainViewModel = viewModel(factory = MainViewModel.factory(container))
  val state by vm.uiState.collectAsStateWithLifecycle()
  val snackbarHostState = remember { SnackbarHostState() }

  LaunchedEffect(state.errorMessage) {
    state.errorMessage?.let { snackbarHostState.showSnackbar(it) }
  }

  Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) { padding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .background(MaterialTheme.colorScheme.surface)
        .padding(padding)
    ) {
      if (state.isAuthenticated) {
        HomeScreen(
          state = state,
          onRefresh = vm::refreshAll,
          onLogout = vm::logout,
          onSelectList = vm::selectList,
          onCreateTask = vm::createTask,
          onToggleDone = vm::toggleDone,
          onEnsureDefaultList = vm::ensureDefaultList
        )
      } else {
        AuthScreen(
          state = state,
          onModeChange = vm::setAuthMode,
          onLogin = vm::login,
          onRegister = vm::register
        )
      }

      if (state.loading) {
        CircularProgressIndicator(
          modifier = Modifier
            .align(Alignment.TopEnd)
            .padding(16.dp)
        )
      }
    }
  }
}

@Composable
private fun AuthScreen(
  state: MainUiState,
  onModeChange: (AuthMode) -> Unit,
  onLogin: (String, String) -> Unit,
  onRegister: (String, String, String) -> Unit
) {
  var email by rememberSaveable { mutableStateOf("") }
  var password by rememberSaveable { mutableStateOf("") }
  var phone by rememberSaveable { mutableStateOf("") }

  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .imePadding()
      .padding(20.dp),
    verticalArrangement = Arrangement.Center
  ) {
    Text("TaskFlow Mobile", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(8.dp))
    Text(
      "API URL: ${BuildConfig.API_BASE_URL}",
      style = MaterialTheme.typography.bodySmall,
      color = MaterialTheme.colorScheme.onSurfaceVariant
    )
    Spacer(Modifier.height(16.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
      OutlinedButton(
        onClick = { onModeChange(AuthMode.Login) },
        enabled = state.authMode != AuthMode.Login,
        modifier = Modifier.weight(1f)
      ) { Text("Login") }
      OutlinedButton(
        onClick = { onModeChange(AuthMode.Register) },
        enabled = state.authMode != AuthMode.Register,
        modifier = Modifier.weight(1f)
      ) { Text("Register") }
    }
    Spacer(Modifier.height(16.dp))
    OutlinedTextField(
      value = email,
      onValueChange = { email = it },
      label = { Text("Email") },
      keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
      modifier = Modifier.fillMaxWidth()
    )
    Spacer(Modifier.height(10.dp))
    OutlinedTextField(
      value = password,
      onValueChange = { password = it },
      label = { Text("Password") },
      modifier = Modifier.fillMaxWidth()
    )
    if (state.authMode == AuthMode.Register) {
      Spacer(Modifier.height(10.dp))
      OutlinedTextField(
        value = phone,
        onValueChange = { phone = it },
        label = { Text("Phone") },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
        modifier = Modifier.fillMaxWidth()
      )
    }
    Spacer(Modifier.height(16.dp))
    Button(
      onClick = {
        if (state.authMode == AuthMode.Login) onLogin(email, password)
        else onRegister(email, password, phone)
      },
      modifier = Modifier.fillMaxWidth()
    ) {
      Text(if (state.authMode == AuthMode.Login) "Sign In" else "Create Account")
    }
  }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HomeScreen(
  state: MainUiState,
  onRefresh: () -> Unit,
  onLogout: () -> Unit,
  onSelectList: (String) -> Unit,
  onCreateTask: (String) -> Unit,
  onToggleDone: (TaskDto) -> Unit,
  onEnsureDefaultList: () -> Unit
) {
  var newTaskTitle by rememberSaveable { mutableStateOf("") }

  Scaffold(
    topBar = {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .background(MaterialTheme.colorScheme.surfaceContainerLow)
          .padding(horizontal = 16.dp, vertical = 12.dp)
      ) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Column(modifier = Modifier.weight(1f)) {
            Text(
              text = state.user?.name?.takeIf { it.isNotBlank() } ?: state.user?.email.orEmpty(),
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.SemiBold
            )
            Text(
              text = state.user?.email.orEmpty(),
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
          IconButton(onClick = onRefresh) { Icon(Icons.Default.Refresh, contentDescription = "Refresh") }
          IconButton(onClick = onLogout) { Icon(Icons.Default.ExitToApp, contentDescription = "Logout") }
        }
        Spacer(Modifier.height(8.dp))
        if (state.lists.isEmpty()) {
          OutlinedButton(onClick = onEnsureDefaultList) { Text("Create My Tasks List") }
        } else {
          FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            state.lists.forEach { list ->
              FilterChip(
                selected = list.id == state.selectedListId,
                onClick = { onSelectList(list.id) },
                label = { Text(list.name) }
              )
            }
          }
        }
      }
    },
    floatingActionButton = {
      FloatingActionButton(
        onClick = {
          if (newTaskTitle.isNotBlank()) {
            onCreateTask(newTaskTitle)
            newTaskTitle = ""
          }
        }
      ) {
        Icon(Icons.Default.Add, contentDescription = "Add Task")
      }
    }
  ) { padding ->
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(padding)
        .padding(16.dp)
    ) {
      OutlinedTextField(
        value = newTaskTitle,
        onValueChange = { newTaskTitle = it },
        label = { Text("New task") },
        trailingIcon = {
          TextButton(onClick = {
            if (newTaskTitle.isNotBlank()) {
              onCreateTask(newTaskTitle)
              newTaskTitle = ""
            }
          }) { Text("Add") }
        },
        modifier = Modifier.fillMaxWidth()
      )
      Spacer(Modifier.height(12.dp))

      if (state.tasks.isEmpty()) {
        Surface(
          modifier = Modifier.fillMaxWidth(),
          shape = RoundedCornerShape(16.dp),
          tonalElevation = 1.dp
        ) {
          Column(modifier = Modifier.padding(16.dp)) {
            Text("No tasks", fontWeight = FontWeight.SemiBold)
            Text(
              "Create a task above for the selected list.",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        }
      } else {
        LazyColumn(
          modifier = Modifier.weight(1f),
          verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
          items(state.tasks, key = { it.id }) { task ->
            TaskRow(task = task, onToggleDone = { onToggleDone(task) })
          }
        }
      }
    }
  }
}

@Composable
private fun TaskRow(
  task: TaskDto,
  onToggleDone: () -> Unit
) {
  val done = task.status == "done"
  Card(
    modifier = Modifier.fillMaxWidth(),
    shape = RoundedCornerShape(16.dp)
  ) {
    Column(modifier = Modifier.padding(14.dp)) {
      Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
          imageVector = Icons.Default.CheckCircle,
          contentDescription = null,
          tint = if (done) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline,
          modifier = Modifier.clickable(onClick = onToggleDone).padding(end = 10.dp)
        )
        Column(modifier = Modifier.weight(1f)) {
          Text(
            text = task.title,
            style = MaterialTheme.typography.titleSmall,
            textDecoration = if (done) TextDecoration.LineThrough else null
          )
          task.description?.takeIf { it.isNotBlank() }?.let {
            Text(
              text = it,
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        }
        AssistChip(onClick = {}, label = { Text(task.status) })
      }
      if (!task.list?.name.isNullOrBlank()) {
        HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
        Text(
          text = "List: ${task.list?.name}",
          style = MaterialTheme.typography.labelMedium,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )
      }
    }
  }
}
