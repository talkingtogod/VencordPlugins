// WhoPingedMe.tsx
import { Plugin } from "vencord";
import { findByProps } from "@webpack";
import { getGuildId } from "@utils/discord";
import { addListener, removeListener } from "@utils/events";

const MessageStore = findByProps("getMessages");
const UserStore = findByProps("getUser");

export default class WhoPingedMe implements Plugin {
    onStart() {
        window.addEventListener("keydown", this.keyHandler);
    }

    onStop() {
        window.removeEventListener("keydown", this.keyHandler);
    }

    keyHandler = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey) {
            const guildId = getGuildId();
            if (!guildId) return alert("You must be in a server!");

            const channelMessages = MessageStore.getMessages();
            const mentions: string[] = [];

            for (const [channelId, messageStore] of channelMessages.entries()) {
                for (const msg of messageStore._array) {
                    if (msg.mentions?.includes(UserStore.getCurrentUser().id)) {
                        const user = UserStore.getUser(msg.author.id);
                        if (user && !mentions.includes(user.username)) {
                            mentions.push(user.username);
                        }
                    }
                }
            }

            const html = `
                <html>
                    <head><title>Who Pinged Me</title></head>
                    <body>
                        <h1>Pings in this server:</h1>
                        <ul>
                            ${mentions.length > 0
                                ? mentions.map(m => `<li>${m}</li>`).join("")
                                : "<li>No mentions found</li>"}
                        </ul>
                    </body>
                </html>
            `;

            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        }
    };
}
