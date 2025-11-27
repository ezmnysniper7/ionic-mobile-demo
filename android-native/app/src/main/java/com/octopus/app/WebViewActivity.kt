package com.octopus.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

/**
 * WebViewActivity
 * Full-screen activity that loads the Ionic loyalty app in a WebView
 * The bottom navigation bar is NOT visible in this activity
 */
class WebViewActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Create WebView programmatically
        webView = WebView(this)

        // Enable JavaScript
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true

        // Set User-Agent to include Android for proper platform detection
        val defaultUserAgent = webView.settings.userAgentString
        webView.settings.userAgentString = "$defaultUserAgent Android"

        // Add JavaScript interface for native bridge
        webView.addJavascriptInterface(AndroidInterface(), "AndroidInterface")

        // Set WebView client
        webView.webViewClient = WebViewClient()

        // Set as content view (full screen)
        setContentView(webView)

        // Get URL from intent
        val url = intent.getStringExtra("url") ?: "http://10.0.2.2:5173/promo/coffee-frenzy"

        // Load the URL
        webView.loadUrl(url)
    }

    /**
     * AndroidInterface
     * JavaScript bridge that allows the web app to communicate with native Android
     */
    inner class AndroidInterface {
        @JavascriptInterface
        fun closeWebview() {
            // Close this activity and return to LoyaltyFragment
            runOnUiThread {
                finish()
            }
        }

        @JavascriptInterface
        fun enableSwipeBack() {
            // Placeholder for future gesture handling
            // Android uses hardware/software back button instead of swipe
        }

        @JavascriptInterface
        fun disableSwipeBack() {
            // Placeholder for future gesture handling
        }
    }

    override fun onBackPressed() {
        // If WebView can go back, go back in web history
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            // Otherwise close the activity
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }
}
