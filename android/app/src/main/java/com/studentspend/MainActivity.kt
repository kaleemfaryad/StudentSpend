package com.studentspend

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    private val splashDuration = 5000L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        showSplashScreen()
    }

    private fun showSplashScreen() {

        val rootView = findViewById<ViewGroup>(android.R.id.content)

        val splashView = LayoutInflater.from(this)
            .inflate(R.layout.splash_layout, rootView, false)

        rootView.addView(splashView)

        Handler(Looper.getMainLooper()).postDelayed({

            rootView.removeView(splashView)

        }, splashDuration)
    }

    override fun getMainComponentName(): String = "StudentSpend"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(
            this,
            mainComponentName,
            fabricEnabled
        )
}