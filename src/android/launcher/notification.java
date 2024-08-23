import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.TaskStackBuilder;
import androidx.core.app.ActivityCompat;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;

public class NotificationHelper {

    private static final String CHANNEL_ID = "default_channel";

    public static void requestNotificationPermission(final Context context, final PermissionCallback callback) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityResultLauncher<String> permissionLauncher = ((YourActivity) context).registerForActivityResult(
                new ActivityResultContracts.RequestPermission(),
                isGranted -> callback.onPermissionResult(isGranted)
            );
            permissionLauncher.launch(android.Manifest.permission.POST_NOTIFICATIONS);
        } else {
            callback.onPermissionResult(true); // No need to ask for permission on older versions
        }
    }

    public static void scheduleNotification(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Default Channel";
            String description = "Channel for general notifications";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        Intent intent = new Intent(context, MainActivity.class); // Change to your activity
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = TaskStackBuilder.create(context)
                .addNextIntentWithParentStack(intent)
                .getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification) // Change to your icon
                .setContentTitle("Version 1.3 is installed!")
                .setContentText("Click to launch.")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setSound(Settings.System.DEFAULT_NOTIFICATION_URI);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
        notificationManager.notify(1, builder.build());
    }

    public interface PermissionCallback {
        void onPermissionResult(boolean granted);
    }

    public static void main(String[] args) {
        Context context = ...; // Get the context

        requestNotificationPermission(context, new PermissionCallback() {
            @Override
            public void onPermissionResult(boolean granted) {
                if (granted) {
                    System.out.println("Notification permission granted.");
                    scheduleNotification(context);
                } else {
                    System.out.println("Notification permission denied.");
                }
            }
        });
    }
}
