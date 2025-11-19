//
//  MainTabBarController.swift
//  OctopusApp
//
//  Main tab bar controller with 5 tabs
//

import UIKit

class MainTabBarController: UITabBarController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Style tab bar
        tabBar.tintColor = UIColor(red: 1.0, green: 0.42, blue: 0.0, alpha: 1.0) // #FF6B00
        tabBar.backgroundColor = .white
        tabBar.isTranslucent = false

        // Create view controllers
        let manageVC = createNavigationController(
            rootViewController: ManageViewController(),
            title: "Manage",
            imageName: "creditcard"
        )

        let loyaltyVC = createNavigationController(
            rootViewController: LoyaltyViewController(),
            title: "Loyalty",
            imageName: "star"
        )

        let topUpVC = createNavigationController(
            rootViewController: TopUpViewController(),
            title: "Top Up",
            imageName: "plus.circle.fill"
        )

        let travelVC = createNavigationController(
            rootViewController: TravelViewController(),
            title: "Travel",
            imageName: "airplane"
        )

        let messageVC = createNavigationController(
            rootViewController: MessageViewController(),
            title: "Message",
            imageName: "envelope"
        )

        viewControllers = [manageVC, loyaltyVC, topUpVC, travelVC, messageVC]

        // Make the Top Up icon larger
        if let topUpItem = topUpVC.tabBarItem {
            topUpItem.imageInsets = UIEdgeInsets(top: -8, left: 0, bottom: 8, right: 0)
        }
    }

    private func createNavigationController(
        rootViewController: UIViewController,
        title: String,
        imageName: String
    ) -> UINavigationController {
        let navController = UINavigationController(rootViewController: rootViewController)
        navController.tabBarItem.title = title
        navController.tabBarItem.image = UIImage(systemName: imageName)

        // Style navigation bar
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(red: 1.0, green: 0.42, blue: 0.0, alpha: 1.0)
        appearance.titleTextAttributes = [.foregroundColor: UIColor.white]

        navController.navigationBar.standardAppearance = appearance
        navController.navigationBar.scrollEdgeAppearance = appearance
        navController.navigationBar.tintColor = .white

        return navController
    }
}
