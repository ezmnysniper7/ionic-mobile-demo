//
//  LoyaltyViewController.swift
//  OctopusApp
//
//  Native Loyalty home screen with clickable campaign banners
//

import UIKit

class LoyaltyViewController: UIViewController {

    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private var canNavigate = true

    override func viewDidLoad() {
        super.viewDidLoad()

        title = "Loyalty Rewards"
        view.backgroundColor = UIColor(red: 0.96, green: 0.96, blue: 0.96, alpha: 1.0) // #f5f5f5

        // Configure navigation bar appearance
        setupNavigationBar()

        setupScrollView()
        setupUI()
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

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Re-enable navigation when returning to this screen
        canNavigate = true
        NSLog("🟢 LoyaltyViewController: viewWillAppear - navigation stack count: %d", navigationController?.viewControllers.count ?? 0)
        if let viewControllers = navigationController?.viewControllers {
            for (index, vc) in viewControllers.enumerated() {
                NSLog("  [%d]: %@", index, String(describing: type(of: vc)))
            }
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        NSLog("🟢 LoyaltyViewController: viewDidAppear")
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        // Disable navigation to prevent any accidental pushes
        canNavigate = false
        NSLog("🔴 LoyaltyViewController: viewWillDisappear")
    }

    private func setupScrollView() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false

        view.addSubview(scrollView)
        scrollView.addSubview(contentView)

        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor)
        ])
    }

    private func setupUI() {
        // Header gradient view
        let headerView = createGradientView()
        headerView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(headerView)

        // Points balance
        let pointsLabel = UILabel()
        pointsLabel.text = "2,450"
        pointsLabel.font = .systemFont(ofSize: 48, weight: .bold)
        pointsLabel.textColor = .white
        pointsLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(pointsLabel)

        let pointsTextLabel = UILabel()
        pointsTextLabel.text = "Loyalty Points"
        pointsTextLabel.font = .systemFont(ofSize: 16, weight: .medium)
        pointsTextLabel.textColor = .white
        pointsTextLabel.alpha = 0.9
        pointsTextLabel.translatesAutoresizingMaskIntoConstraints = false
        headerView.addSubview(pointsTextLabel)

        // Section title
        let sectionLabel = UILabel()
        sectionLabel.text = "Active Campaigns"
        sectionLabel.font = .systemFont(ofSize: 20, weight: .bold)
        sectionLabel.textColor = .darkGray
        sectionLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(sectionLabel)

        // Campaign banners
        let coffeeBanner = createCampaignBanner(
            emoji: "☕",
            title: "Coffee Frenzy",
            subtitle: "Double Points at Coffee Shops",
            badge: "2x Points",
            campaignId: "coffee-frenzy"
        )

        let supermarketBanner = createCampaignBanner(
            emoji: "🛒",
            title: "Weekend Supermarket Cashback",
            subtitle: "Extra Savings on Weekends",
            badge: "5% Cashback",
            campaignId: "supermarket-weekend"
        )

        let cinemaBanner = createCampaignBanner(
            emoji: "🎬",
            title: "Cinema Rewards",
            subtitle: "Free Popcorn with Movie Tickets",
            badge: "Free Popcorn",
            campaignId: "cinema-rewards"
        )

        let stackView = UIStackView(arrangedSubviews: [coffeeBanner, supermarketBanner, cinemaBanner])
        stackView.axis = .vertical
        stackView.spacing = 12
        stackView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(stackView)

        // Layout constraints
        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: contentView.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 200),

            pointsLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor),
            pointsLabel.centerYAnchor.constraint(equalTo: headerView.centerYAnchor, constant: -10),

            pointsTextLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor),
            pointsTextLabel.topAnchor.constraint(equalTo: pointsLabel.bottomAnchor, constant: 8),

            sectionLabel.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: 20),
            sectionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            sectionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),

            stackView.topAnchor.constraint(equalTo: sectionLabel.bottomAnchor, constant: 12),
            stackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            stackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            stackView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20)
        ])
    }

    private func createGradientView() -> UIView {
        let view = UIView()
        let gradientLayer = CAGradientLayer()
        gradientLayer.colors = [
            UIColor(red: 1.0, green: 0.42, blue: 0.0, alpha: 1.0).cgColor, // #FF6B00
            UIColor(red: 1.0, green: 0.72, blue: 0.0, alpha: 1.0).cgColor  // #FFB800
        ]
        gradientLayer.startPoint = CGPoint(x: 0, y: 0)
        gradientLayer.endPoint = CGPoint(x: 1, y: 1)
        gradientLayer.frame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: 200)
        view.layer.insertSublayer(gradientLayer, at: 0)
        return view
    }

    private func createCampaignBanner(emoji: String, title: String, subtitle: String, badge: String, campaignId: String) -> UIView {
        let container = UIView()
        container.backgroundColor = .white
        container.layer.cornerRadius = 12
        container.layer.shadowColor = UIColor.black.cgColor
        container.layer.shadowOpacity = 0.08
        container.layer.shadowOffset = CGSize(width: 0, height: 2)
        container.layer.shadowRadius = 8
        container.translatesAutoresizingMaskIntoConstraints = false
        container.heightAnchor.constraint(equalToConstant: 100).isActive = true

        // Emoji
        let emojiLabel = UILabel()
        emojiLabel.text = emoji
        emojiLabel.font = .systemFont(ofSize: 40)
        emojiLabel.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(emojiLabel)

        // Title
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = .systemFont(ofSize: 16, weight: .bold)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(titleLabel)

        // Subtitle
        let subtitleLabel = UILabel()
        subtitleLabel.text = subtitle
        subtitleLabel.font = .systemFont(ofSize: 13)
        subtitleLabel.textColor = .gray
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(subtitleLabel)

        // Badge
        let badgeLabel = createBadge(text: badge)
        container.addSubview(badgeLabel)

        // Chevron
        let chevronImageView = UIImageView(image: UIImage(systemName: "chevron.right"))
        chevronImageView.tintColor = .lightGray
        chevronImageView.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(chevronImageView)

        NSLayoutConstraint.activate([
            emojiLabel.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 16),
            emojiLabel.centerYAnchor.constraint(equalTo: container.centerYAnchor),

            titleLabel.leadingAnchor.constraint(equalTo: emojiLabel.trailingAnchor, constant: 12),
            titleLabel.topAnchor.constraint(equalTo: container.topAnchor, constant: 20),

            subtitleLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),

            badgeLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            badgeLabel.topAnchor.constraint(equalTo: subtitleLabel.bottomAnchor, constant: 8),

            chevronImageView.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -16),
            chevronImageView.centerYAnchor.constraint(equalTo: container.centerYAnchor)
        ])

        // Add tap gesture
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(campaignTapped(_:)))
        container.addGestureRecognizer(tapGesture)
        container.isUserInteractionEnabled = true
        container.accessibilityIdentifier = campaignId

        return container
    }

    private func createBadge(text: String) -> UILabel {
        let label = UILabel()
        label.text = text
        label.font = .systemFont(ofSize: 11, weight: .medium)
        label.textColor = UIColor(red: 1.0, green: 0.42, blue: 0.0, alpha: 1.0)
        label.backgroundColor = UIColor(red: 1.0, green: 0.42, blue: 0.0, alpha: 0.1)
        label.layer.cornerRadius = 4
        label.clipsToBounds = true
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        label.widthAnchor.constraint(equalToConstant: 90).isActive = true
        label.heightAnchor.constraint(equalToConstant: 22).isActive = true
        return label
    }

    @objc private func campaignTapped(_ sender: UITapGestureRecognizer) {
        guard let campaignId = sender.view?.accessibilityIdentifier else { return }

        // Guard against multiple rapid taps or navigation while transitioning
        guard canNavigate else {
            NSLog("⛔️ LoyaltyViewController: navigation blocked - canNavigate is false")
            return
        }

        // Immediately disable navigation to prevent double-tap issues
        canNavigate = false

        NSLog("🔵 LoyaltyViewController: campaignTapped - campaignId: %@", campaignId)

        // Create and push WebView controller
        let webVC = WebViewViewController(campaignId: campaignId)
        // IMPORTANT: Do NOT set hidesBottomBarWhenPushed to true
        // This ensures the tab bar remains visible
        navigationController?.pushViewController(webVC, animated: true)
        NSLog("🔵 LoyaltyViewController: pushed WebViewController")
    }
}
