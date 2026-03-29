package com.project.edureach

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize WebView
        webView = findViewById(R.id.webview)

        // Set WebView settings
        webView.settings.javaScriptEnabled = true // Enable JavaScript
        webView.settings.domStorageEnabled = true // Enable DOM Storage
        webView.webViewClient = WebViewClient() // Handle links within WebView

        // Load the URL of your website
        webView.loadUrl("https://unrivaled-buttercream-25b45b.netlify.app/") // Replace with your URL

        // Handle back button in WebView
        webView.setOnKeyListener { _, keyCode, event ->
            if (keyCode == android.view.KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
                webView.goBack() // Navigate back if possible
                true
            } else {
                false
            }
        }
    }

    // Handle WebView back navigation
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack() // Go back in WebView history
        } else {
            super.onBackPressed() // Otherwise, perform normal back press
        }
    }
}
