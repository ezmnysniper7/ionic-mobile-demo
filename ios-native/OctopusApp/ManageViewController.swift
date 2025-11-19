//
//  ManageViewController.swift
//  OctopusApp
//
//  Native Manage Octopus tab (placeholder with static content)
//

import UIKit

class ManageViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        title = "Manage Octopus"
        view.backgroundColor = UIColor(red: 0.96, green: 0.96, blue: 0.96, alpha: 1.0)

        let label = UILabel()
        label.text = "Manage Octopus\n(Native Screen)"
        label.numberOfLines = 0
        label.textAlignment = .center
        label.font = .systemFont(ofSize: 24, weight: .bold)
        label.textColor = .gray
        label.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(label)

        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}
