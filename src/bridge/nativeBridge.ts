/**
 * Native Bridge Module
 * Handles communication between the Ionic WebView and native iOS/Android code
 */

export const NativeBridge = {
  /**
   * Closes the webview by calling native methods
   * iOS: Uses webkit.messageHandlers
   * Android: Uses AndroidInterface
   */
  closeWebview: () => {
    console.log("NativeBridge: closeWebview called");

    // iOS
    if (window?.webkit?.messageHandlers?.closeWebview) {
      window.webkit.messageHandlers.closeWebview.postMessage(true);
    }

    // Android
    if (window.AndroidInterface?.closeWebview) {
      window.AndroidInterface.closeWebview();
    }
  },

  /**
   * Enables native swipe-back gesture (for iOS mainly)
   * Call this when user is on the root page
   */
  enableSwipeBack: () => {
    console.log("NativeBridge: enableSwipeBack called");

    // iOS
    if (window?.webkit?.messageHandlers?.enableSwipeBack) {
      window.webkit.messageHandlers.enableSwipeBack.postMessage(true);
    }

    // Android
    if (window.AndroidInterface?.enableSwipeBack) {
      window.AndroidInterface.enableSwipeBack();
    }
  },

  /**
   * Disables native swipe-back gesture
   * Call this when user navigates away from root page
   */
  disableSwipeBack: () => {
    console.log("NativeBridge: disableSwipeBack called");

    // iOS
    if (window?.webkit?.messageHandlers?.disableSwipeBack) {
      window.webkit.messageHandlers.disableSwipeBack.postMessage(false);
    }

    // Android
    if (window.AndroidInterface?.disableSwipeBack) {
      window.AndroidInterface.disableSwipeBack();
    }
  },

  /**
   * Send custom message to native side
   * @param message - Any data to send to native
   */
  sendMessage: (message: any) => {
    console.log("NativeBridge: sendMessage", message);

    // iOS
    if (window?.webkit?.messageHandlers?.customMessage) {
      window.webkit.messageHandlers.customMessage.postMessage(message);
    }

    // Android
    if (window.AndroidInterface?.receiveMessage) {
      window.AndroidInterface.receiveMessage(JSON.stringify(message));
    }
  },
};

// Type declarations for global window objects
declare global {
  interface Window {
    NativeBridge: typeof NativeBridge;
    AndroidInterface?: {
      closeWebview: () => void;
      enableSwipeBack: () => void;
      disableSwipeBack: () => void;
      receiveMessage: (message: string) => void;
    };
    webkit?: {
      messageHandlers?: {
        closeWebview?: {
          postMessage: (message: any) => void;
        };
        enableSwipeBack?: {
          postMessage: (message: any) => void;
        };
        disableSwipeBack?: {
          postMessage: (message: any) => void;
        };
        customMessage?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

// Expose to global window object
window.NativeBridge = NativeBridge;

export default NativeBridge;
