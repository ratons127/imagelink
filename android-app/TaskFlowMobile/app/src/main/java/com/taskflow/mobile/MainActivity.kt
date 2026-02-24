package com.taskflow.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.taskflow.mobile.data.AppContainer
import com.taskflow.mobile.ui.TaskFlowApp

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    val container = AppContainer(applicationContext)
    setContent {
      Surface(color = MaterialTheme.colorScheme.background) {
        TaskFlowApp(container)
      }
    }
  }
}
