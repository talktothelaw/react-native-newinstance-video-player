import UIKit

final class DeviceOrientation {
    
    static let shared = DeviceOrientation()
    
    // MARK: - Private properties
    
    private var windowScene: UIWindowScene? {
        return UIApplication.shared.connectedScenes.first as? UIWindowScene
    }
    
    // MARK: - Public methods
    
    func set(orientation: UIInterfaceOrientationMask) {
        if #available(iOS 16.0, *) {
            windowScene?.requestGeometryUpdate(.iOS(interfaceOrientations: orientation))
        } else {
            UIDevice.current.setValue(orientation.toUIInterfaceOrientation.rawValue, forKey: "orientation")
        }
    }
    
    var isLandscape: Bool {
        if #available(iOS 16.0, *) {
            return windowScene?.interfaceOrientation.isLandscape ?? false
        }
        return UIDevice.current.orientation.isLandscape
    }
    
    var isPortrait: Bool {
        if #available(iOS 16.0, *) {
            return windowScene?.interfaceOrientation.isPortrait ?? false
        }
        return UIDevice.current.orientation.isPortrait
    }
    
    var isFlat: Bool {
        if #available(iOS 16.0, *) {
            return false
        }
        return UIDevice.current.orientation.isFlat
    }
}

extension UIInterfaceOrientationMask {
    var toUIInterfaceOrientation: UIInterfaceOrientation {
        switch self {
        case .portrait:
            return .portrait
        case .portraitUpsideDown:
            return .portraitUpsideDown
        case .landscapeRight:
            return .landscapeRight
        case .landscapeLeft:
            return .landscapeLeft
        default:
            return .unknown
        }
    }
}

@objc(NewinstanceVideoPlayer)
class NewinstanceVideoPlayer: NSObject {

    @objc(enterFullScreen)
    func enterFullScreen() {
        DispatchQueue.main.async {
            DeviceOrientation.shared.set(orientation: .landscapeRight)
            if let rootViewController = UIApplication.shared.windows.first?.rootViewController {
                rootViewController.view.window?.windowLevel = UIWindow.Level.statusBar + 1
                rootViewController.setNeedsStatusBarAppearanceUpdate()
                
                // Ensure the view controller is in full screen
                rootViewController.modalPresentationStyle = .fullScreen
                
                // Force layout update
                rootViewController.view.setNeedsLayout()
                rootViewController.view.layoutIfNeeded()
            }
        }
    }

    @objc(exitFullScreen)
    func exitFullScreen() {
        DispatchQueue.main.async {
            DeviceOrientation.shared.set(orientation: .portrait)
            if let rootViewController = UIApplication.shared.windows.first?.rootViewController {
                rootViewController.view.window?.windowLevel = UIWindow.Level.normal
                rootViewController.setNeedsStatusBarAppearanceUpdate()
                
                // Ensure the view controller is in normal presentation style
                rootViewController.modalPresentationStyle = .automatic
                
                // Force layout update
                rootViewController.view.setNeedsLayout()
                rootViewController.view.layoutIfNeeded()
            }
        }
    }
}
