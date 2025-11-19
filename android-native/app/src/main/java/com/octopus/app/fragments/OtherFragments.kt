package com.octopus.app.fragments

import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.TextView
import androidx.fragment.app.Fragment

/**
 * Placeholder fragments for other tabs (Manage, Top Up, Travel, Message)
 */

class ManageFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return createPlaceholderView("Manage Octopus\n(Native Screen)")
    }
}

class TopUpFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return createPlaceholderView("Top Up Octopus\n(Native Screen)")
    }
}

class TravelFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return createPlaceholderView("Travel & Payments\n(Native Screen)")
    }
}

class MessageFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return createPlaceholderView("Messages\n(Native Screen)")
    }
}

private fun createPlaceholderView(text: String): View {
    val frameLayout = FrameLayout(this.requireContext()).apply {
        setBackgroundColor(Color.parseColor("#f5f5f5"))
    }

    val textView = TextView(this.requireContext()).apply {
        this.text = text
        textSize = 24f
        setTextColor(Color.GRAY)
        gravity = Gravity.CENTER
        setTypeface(null, android.graphics.Typeface.BOLD)
    }

    frameLayout.addView(textView, FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT
    ))

    return frameLayout
}
