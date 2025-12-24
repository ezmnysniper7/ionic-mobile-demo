//
//  LoyaltyViewController.swift
//  OctopusApp
//
//  Loyalty home screen with WebView
//  Loads the Ionic React app with AEM integration
//

import UIKit
import WebKit

class LoyaltyViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {

    private var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        title = "Loyalty Rewards"
        view.backgroundColor = .white

        // Configure navigation bar appearance
        setupNavigationBar()

        // Setup WebView
        setupWebView()

        // Load the Ionic app home page
        if let url = URL(string: "http://localhost:5173/home") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    private func setupNavigationBar() {
        // Make sure title is visible (dark text on light background)
        if #available(iOS 13.0, *) {
            let appearance = UINavigationBarAppearance()
            appearance.configureWithOpaqueBackground()
            appearance.backgroundColor = .white
            appearance.titleTextAttributes = [
                .foregroundColor: UIColor.black,
                .font: UIFont.systemFont(ofSize: 17, weight: .semibold)
            ]
            navigationController?.navigationBar.standardAppearance = appearance
            navigationController?.navigationBar.scrollEdgeAppearance = appearance
        } else {
            navigationController?.navigationBar.barTintColor = .white
            navigationController?.navigationBar.titleTextAttributes = [
                .foregroundColor: UIColor.black,
                .font: UIFont.systemFont(ofSize: 17, weight: .semibold)
            ]
        }
    }

    private func setupWebView() {
        // Configure WebView
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []

        // Add JavaScript bridge handlers
        configuration.userContentController.add(self, name: "enableSwipeBack")
        configuration.userContentController.add(self, name: "disableSwipeBack")

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        // IMPORTANT: Allow back/forward swipe gestures in WebView
        // This enables Ionic's iOS swipe-back animation to work
        webView.allowsBackForwardNavigationGestures = true

        webView.isOpaque = false
        webView.backgroundColor = .white
        webView.translatesAutoresizingMaskIntoConstraints = false

        view.addSubview(webView)

        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }

    // MARK: - WKScriptMessageHandler

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "enableSwipeBack" {
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

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        NSLog("❌ WebView failed to load: %@", error.localizedDescription)
    }
}
