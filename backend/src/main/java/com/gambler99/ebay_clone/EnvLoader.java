package com.gambler99.ebay_clone;
import io.github.cdimascio.dotenv.Dotenv;

public class EnvLoader {

    // Define all the keys you expect to load from the .env file
    private static final String[] ENV_KEYS = {
            // Database connection details
            "DB_URL", "DB_USERNAME", "DB_PASSWORD",

            // JWT and OAuth2 details
            "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI",
            "EMAIL_USER", "EMAIL_PASS", "MAIL_DEBUG",
            "JWT_SECRET", "JWT_EXPIRATION_MS",

            // Add your Stripe keys here:
            "STRIPE_API_KEY_SECRET",
            "STRIPE_WEBHOOK_SECRET",

            // Server and application settings
            "SERVER_PORT", "DDL_AUTO", "SHOW_SQL", "APP_DEBUG",
            "LOG_LEVEL_WEBSOCKET", "LOG_LEVEL_MESSAGING", "LOG_LEVEL_TOMCAT_WEBSOCKET",
            "FRONTEND_URL"
    };

    public static void load() {
        // Configure to ignore if .env is missing or malformed,
        // useful for environments where .env might not be present (e.g., CI/CD with real env vars)
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()      // Won't throw error if .env is not found
                .ignoreIfMalformed()    // Won't throw error if .env has syntax errors
                .load();

        if (dotenv == null) {
            System.out.println("INFO: .env file not found or is malformed. Skipping .env loading.");
            return;
        }

        System.out.println("INFO: Loading environment variables from .env file...");

        for (String key : ENV_KEYS) {
            String value = dotenv.get(key);
            if (value != null && !value.isEmpty()) {
                System.setProperty(key, value);
                // For debugging, you might want to print what's being set, but remove for production.
                // System.out.println("INFO: Set system property: " + key + "=" + (key.contains("PASSWORD") || key.contains("SECRET") ? "****" : value));
            } else {
                // Optionally, log if an expected key is missing from .env but not critical enough to stop
                System.out.println("WARN: Environment variable '" + key + "' not found in .env file or is empty.");
            }
        }
        System.out.println("INFO: Finished loading environment variables from .env file.");
    }
}
