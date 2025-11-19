package com.octopus.app.fragments

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import com.octopus.app.WebViewActivity

/**
 * Native Loyalty Fragment
 * Shows point balance and campaign banners
 * Clicking a banner launches WebViewActivity (full-screen)
 */
class LoyaltyFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val scrollView = ScrollView(requireContext())
        scrollView.setBackgroundColor(Color.parseColor("#f5f5f5"))

        val mainLayout = LinearLayout(requireContext()).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        // Header gradient view
        val headerView = createHeaderView()
        mainLayout.addView(headerView)

        // Section title
        val sectionTitle = TextView(requireContext()).apply {
            text = "Active Campaigns"
            textSize = 20f
            setTextColor(Color.DKGRAY)
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(dpToPx(16), dpToPx(20), dpToPx(16), dpToPx(12))
        }
        mainLayout.addView(sectionTitle)

        // Campaign banners
        mainLayout.addView(createCampaignBanner(
            "☕",
            "Coffee Frenzy",
            "Double Points at Coffee Shops",
            "2x Points",
            "coffee-frenzy"
        ))

        mainLayout.addView(createCampaignBanner(
            "🛒",
            "Weekend Supermarket Cashback",
            "Extra Savings on Weekends",
            "5% Cashback",
            "supermarket-weekend"
        ))

        mainLayout.addView(createCampaignBanner(
            "🎬",
            "Cinema Rewards",
            "Free Popcorn with Movie Tickets",
            "Free Popcorn",
            "cinema-rewards"
        ))

        scrollView.addView(mainLayout)
        return scrollView
    }

    private fun createHeaderView(): View {
        val headerLayout = LinearLayout(requireContext()).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dpToPx(200)
            )
            setBackgroundColor(Color.parseColor("#FF6B00"))
            gravity = android.view.Gravity.CENTER
        }

        val pointsLabel = TextView(requireContext()).apply {
            text = "2,450"
            textSize = 48f
            setTextColor(Color.WHITE)
            setTypeface(null, android.graphics.Typeface.BOLD)
        }
        headerLayout.addView(pointsLabel)

        val pointsText = TextView(requireContext()).apply {
            text = "Loyalty Points"
            textSize = 16f
            setTextColor(Color.WHITE)
            alpha = 0.9f
        }
        headerLayout.addView(pointsText)

        return headerLayout
    }

    private fun createCampaignBanner(
        emoji: String,
        title: String,
        subtitle: String,
        badge: String,
        campaignId: String
    ): CardView {
        val card = CardView(requireContext()).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dpToPx(100)
            ).apply {
                setMargins(dpToPx(16), dpToPx(6), dpToPx(16), dpToPx(6))
            }
            radius = dpToPx(12).toFloat()
            cardElevation = dpToPx(4).toFloat()
            setCardBackgroundColor(Color.WHITE)
        }

        val contentLayout = LinearLayout(requireContext()).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
            setPadding(dpToPx(16), dpToPx(16), dpToPx(16), dpToPx(16))
            gravity = android.view.Gravity.CENTER_VERTICAL
        }

        // Emoji
        val emojiText = TextView(requireContext()).apply {
            text = emoji
            textSize = 40f
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                marginEnd = dpToPx(12)
            }
        }
        contentLayout.addView(emojiText)

        // Text content
        val textLayout = LinearLayout(requireContext()).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            )
        }

        val titleText = TextView(requireContext()).apply {
            text = title
            textSize = 16f
            setTextColor(Color.BLACK)
            setTypeface(null, android.graphics.Typeface.BOLD)
        }
        textLayout.addView(titleText)

        val subtitleText = TextView(requireContext()).apply {
            text = subtitle
            textSize = 13f
            setTextColor(Color.GRAY)
        }
        textLayout.addView(subtitleText)

        val badgeText = TextView(requireContext()).apply {
            text = badge
            textSize = 11f
            setTextColor(Color.parseColor("#FF6B00"))
            setBackgroundColor(Color.parseColor("#FFEFE5"))
            setPadding(dpToPx(8), dpToPx(4), dpToPx(8), dpToPx(4))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                topMargin = dpToPx(8)
            }
        }
        textLayout.addView(badgeText)

        contentLayout.addView(textLayout)

        // Chevron icon (simplified as >)
        val chevron = TextView(requireContext()).apply {
            text = "›"
            textSize = 32f
            setTextColor(Color.LTGRAY)
        }
        contentLayout.addView(chevron)

        card.addView(contentLayout)

        // Click listener to open WebView
        card.setOnClickListener {
            openWebView(campaignId)
        }

        return card
    }

    private fun openWebView(campaignId: String) {
        // Launch WebViewActivity (full-screen, not a fragment)
        val intent = Intent(requireContext(), WebViewActivity::class.java)
        intent.putExtra("url", "http://10.0.2.2:5173/promo/$campaignId")
        startActivity(intent)
    }

    private fun dpToPx(dp: Int): Int {
        val density = resources.displayMetrics.density
        return (dp * density).toInt()
    }
}
