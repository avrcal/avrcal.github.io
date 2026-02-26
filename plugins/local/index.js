import { binder } from "@revenge/mod"; // Basic Revenge/Vendetta imports
import { findByProps, findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

const MessageStore = findByProps("getMessage", "getMessages");
const Dispatcher = findByProps("dispatch", "subscribe");
const ContextMenu = findByName("MessageContextMenu", false);

export default {
    onLoad: () => {
        this.patch = after("default", ContextMenu, ([{ message }], res) => {
            // Check if message exists to avoid crashes
            if (!message) return;

            // Add the "Edit Locally" button to the context menu
            res.props.children.push(
                <ContextMenu.Item
                    label="Edit Message Locally"
                    id="edit-locally"
                    action={() => {
                        // Trigger input for the new text
                        showEditModal(message);
                    }}
                />
            );
        });
    },
    onUnload: () => {
        this.patch?.();
    }
};

function showEditModal(message) {
    // Simplified logic: Use a prompt or a custom modal to get new text
    const newContent = prompt("Enter new message content:", message.content);
    
    if (newContent !== null) {
        applyLocalChange(message.channel_id, message.id, newContent);
    }
}

function applyLocalChange(channelId, messageId, newContent) {
    // Logic to update the local store without sending to Discord servers
    Dispatcher.dispatch({
        type: "MESSAGE_UPDATE",
        message: {
            ...MessageStore.getMessage(channelId, messageId),
            content: newContent,
            guild_id: MessageStore.getGuildId(channelId)
        }
    });
  }
