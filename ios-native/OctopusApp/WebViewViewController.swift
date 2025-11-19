//
//  WebViewViewController.swift
//  OctopusApp
//
//  Full-screen WebView controller that loads the Ionic app
//  IMPORTANT: Tab bar is HIDDEN when this view is shown (hidesBottomBarWhenPushed = true)
//

import UIKit
import WebKit

class WebViewViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {

    private let webView: WKWebView
    private let campaignId: String
    private var initialURL: URL?
    private var isLeavingViewController = false

    init(campaignId: String) {
        self.campaignId = campaignId

        // Configure WebView
        let configuration = WKWebViewConfiguration()

        // Ensure proper WebView behavior
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []

        self.webView = WKWebView(frame: .zero, configuration: configuration)

        super.init(nibName: nil, bundle: nil)

        // CRITICAL: Hide tab bar when this view controller is pushed
        self.hidesBottomBarWhenPushed = true

        // Configure WebView after super.init
        self.webView.scrollView.contentInsetAdjustmentBehavior = .never

        // Add message handlers after super.init (when self is fully initialized)
        configuration.userContentController.add(self, name: "closeWebview")
        configuration.userContentController.add(self, name: "enableSwipeBack")
        configuration.userContentController.add(self, name: "disableSwipeBack")
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .white
        title = "Campaign Details"

        // Hide navigation bar for full screen effect
        navigationController?.setNavigationBarHidden(true, animated: false)

        // Extend layout for full screen
        extendedLayoutIncludesOpaqueBars = true
        edgesForExtendedLayout = .all

        // Setup WebView
        webView.translatesAutoresizingMaskIntoConstraints = false
        // Disable WebView's own back/forward gestures to avoid conflicts with native navigation
        webView.allowsBackForwardNavigationGestures = false
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = .clear
        view.addSubview(webView)

        NSLayoutConstraint.activate([
            // Fill entire screen
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            // Go all the way to bottom (tab bar is hidden anyway)
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        // Load Ionic app URL
        // For development: http://localhost:5173/promo/coffee-frenzy
        // For production: load from app bundle or remote URL
        let urlString = "http://localhost:5173/promo/\(campaignId)"
        if let url = URL(string: urlString) {
            initialURL = url
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        isLeavingViewController = false
        NSLog("🟣 WebViewViewController: viewWillAppear for campaign: %@", campaignId)

        // Enable native swipe-back by default (web app will disable if needed)
        navigationController?.interactivePopGestureRecognizer?.isEnabled = true
        // CRITICAL: Set the delegate to nil to ensure the gesture works even with hidden nav bar
        navigationController?.interactivePopGestureRecognizer?.delegate = nil
        NSLog("✅ Native swipe-back ENABLED by default")
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        isLeavingViewController = true
        NSLog("🟠 WebViewViewController: viewWillDisappear for campaign: %@", campaignId)
        // Stop any pending WebView loads when leaving this screen
        webView.stopLoading()

        // Restore navigation bar when leaving
        navigationController?.setNavigationBarHidden(false, animated: true)
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        NSLog("🟠 WebViewViewController: viewDidDisappear for campaign: %@", campaignId)
        // Clear the WebView completely when we leave
        webView.loadHTMLString("", baseURL: nil)
    }

    // MARK: - WKScriptMessageHandler

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "closeWebview" {
            // Pop back to native Loyalty screen
            navigationController?.popViewController(animated: true)
        } else if message.name == "enableSwipeBack" {
            NSLog("✅ Native swipe-back ENABLED")
            navigationController?.interactivePopGestureRecognizer?.isEnabled = true
        } else if message.name == "disableSwipeBack" {
            NSLog("⛔️ Native swipe-back DISABLED")
            navigationController?.interactivePopGestureRecognizer?.isEnabled = false
        }
    }

    // MARK: - WKNavigationDelegate

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        NSLog("✅ WebView finished loading: %@", webView.url?.absoluteString ?? "unknown")
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Block all navigation if we're leaving this view controller
        if isLeavingViewController {
            NSLog("⛔️ WebView navigation BLOCKED - leaving view controller")
            decisionHandler(.cancel)
            return
        }

        // Allow initial load and user-initiated navigation
        if let url = navigationAction.request.url {
            NSLog("🌐 WebView navigation to: %@", url.absoluteString)
        }
        decisionHandler(.allow)
    }
}
