package com.octopus.app

import android.graphics.Color
import android.os.Bundle
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.octopus.app.fragments.*

/**
 * MainActivity with bottom navigation bar (5 tabs)
 * Tab bar remains visible when showing fragments
 */
class MainActivity : AppCompatActivity() {

    private lateinit var bottomNav: BottomNavigationView
    private lateinit var toolbar: Toolbar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Setup toolbar
        toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(true)

        // Style toolbar
        toolbar.setBackgroundColor(Color.WHITE)
        toolbar.setTitleTextColor(Color.BLACK)

        bottomNav = findViewById(R.id.bottom_navigation)

        // Set up bottom navigation listener
        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_manage -> {
                    supportActionBar?.title = "Manage"
                    loadFragment(ManageFragment())
                    true
                }
                R.id.nav_loyalty -> {
                    supportActionBar?.title = "Loyalty Rewards"
                    loadFragment(LoyaltyFragment())
                    true
                }
                R.id.nav_topup -> {
                    supportActionBar?.title = "Top Up"
                    loadFragment(TopUpFragment())
                    true
                }
                R.id.nav_travel -> {
                    supportActionBar?.title = "Travel"
                    loadFragment(TravelFragment())
                    true
                }
                R.id.nav_message -> {
                    supportActionBar?.title = "Messages"
                    loadFragment(MessageFragment())
                    true
                }
                else -> false
            }
        }

        // Load default fragment
        if (savedInstanceState == null) {
            supportActionBar?.title = "Manage"
            loadFragment(ManageFragment())
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }

    // Public method to navigate to Loyalty tab
    fun navigateToLoyalty() {
        bottomNav.selectedItemId = R.id.nav_loyalty
    }
}
