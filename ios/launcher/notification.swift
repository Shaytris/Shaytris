import Foundation
import UserNotifications

func requestNotificationPermission(completion: @escaping (Bool) -> Void) {
    let center = UNUserNotificationCenter.current()
    center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
        if let error = error {
            print("Error requesting notification permission: \(error.localizedDescription)")
            completion(false)
            return
        }
        completion(granted)
    }
}

//this is just an example, Notification can be used for much more then just install notification updates.
func scheduleNotification() {
    let content = UNMutableNotificationContent()
    content.title = "Version 1.3 is installed!"
    content.body = "Click to launch."
    content.sound = UNNotificationSound.default

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5, repeats: false)

    let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)

    UNUserNotificationCenter.current().add(request) { error in
        if let error = error {
            print("Error adding notification: \(error.localizedDescription)")
        } else {
            print("Notification scheduled successfully!")
        }
    }
}

requestNotificationPermission { granted in
    if granted {
        print("Notification permission granted.")
        scheduleNotification()
    } else {
        print("Notification permission denied.")
    }
}

RunLoop.main.run(until: Date(timeIntervalSinceNow: 10))
