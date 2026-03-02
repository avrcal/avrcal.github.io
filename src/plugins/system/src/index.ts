import { findByProps } from "@vendetta/metro";
import { logger } from "@vendetta";

const { ReactNative } = findByProps("ReactNative");

export function onLoad() {
	// Register the slash command
	const commandsModule = findByProps("registerCommand");
	
	if (!commandsModule?.registerCommand) {
		logger.error("Could not find registerCommand");
		return;
	}

	commandsModule.registerCommand({
		name: "system",
		description: "Shows Android device version and device name",
		inputType: 1, // CHAT_INPUT
		handler: async (args) => {
			try {
				// Get device information
				const deviceInfo = ReactNative.NativeModules.PlatformConstants || {};
				const osVersion = ReactNative.Platform.Version || "Unknown";
				const deviceName = ReactNative.NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] 
					? "iOS Device" 
					: deviceInfo.Release || "Android Device";

				// Alternative way to get Android device info
				const Build = ReactNative.NativeModules.Build || {};
				const androidVersion = Build.VERSION?.RELEASE || osVersion;
				const model = Build.MODEL || deviceInfo.brand || "Unknown";
				const brand = Build.BRAND || "Unknown";

				return {
					content: `\`\`\`
📱 System Information
━━━━━━━━━━━━━━━━━━━━━━
Device Name: ${brand} ${model}
Android Version: ${androidVersion}
\`\`\``,
				};
			} catch (error) {
				logger.error("System command error:", error);
				return {
					content: "❌ Error retrieving system information",
				};
			}
		},
	});

	logger.log("System plugin loaded successfully");
}

export function onUnload() {
	logger.log("System plugin unloaded");
}
