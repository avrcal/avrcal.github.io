import { findByProps, findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { Forms } from "@vendetta/ui/components";

const { TextInput } = Forms;
const MessageStore = findByProps("getMessage", "getMessages");
const Dispatcher = findByProps("dispatch", "subscribe");
const ContextMenu = findByName("MessageContextMenu", false);
const { showInputAlert } = findByProps("showInputAlert");

let patch;

export default {
  onLoad: () => {
    patch = after("default", ContextMenu, ([{ message }], res) => {
      // Find the group of items in the context menu
      const group = res.props.children.props.children;

      group.push(
        <Forms.FormRow
          label="Edit Locally"
          onPress={() => {
            showInputAlert({
              title: "Edit Message Locally",
              placeholder: "Enter new content",
              initialValue: message.content,
              confirmText: "Apply",
              cancelText: "Cancel",
              onConfirm: (newContent: string) => {
                applyLocalChange(message.channel_id, message.id, newContent);
              },
            });
          }}
        />
      );
    });
  },
  onUnload: () => {
    patch?.();
  },
};

function applyLocalChange(channelId: string, messageId: string, content: string) {
  Dispatcher.dispatch({
    type: "MESSAGE_UPDATE",
    message: {
      ...MessageStore.getMessage(channelId, messageId),
      content: content,
      guild_id: MessageStore.getGuildId(channelId),
    },
  });
}
