// src/plugins/WhoPingedMe.tsx

import { Plugin } from "@modules/plugin";
import { findByProps } from "@webpack";
import { getCurrentUser } from "@utils/user";
import { getGuildId } from "@utils/discord";

const MessageStore = findByProps("getMessages");
const UserStore = findByProps("getUser");

export default class WhoPingedMe implements Plugin {
    keyHandler = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey) {
            const userId = getCurrentUser()?.id;
            const guildId = getGuildId();

            if (!userId || !guildId) {
                alert("Please open a server first.");
                return;
            }

            const allMessages = MessageStore.getMessages();
            const mentioners: Set<string> = new Set();

            for (const channelId in allMessages) {
                const msgs = allMessages[channelId]?._array ?? [];
                for (const msg of msgs) {
                    if (msg?.mentions?.includes(userId)) {
                        const user = UserStore.getUser(msg.author.id);
                        if (user) mentioners.add(user.username);
                    }
                }
            }

            const html = `
                <html>
                    <head><title>Mentions</title></head>
                    <body>
                        <h1>People who pinged you in this server:</h1>
                        <ul>
                            ${
                                mentioners.size
                                    ? Array.from(mentioners).map(m => `<li>${m}</li>`).join("")
                                    : "<li>No mentions found</li>"
                            }
                        </ul>
                    </body>
                </html>
            `;

            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        }
    };

    onStart() {
        window.addEventListener("keydown", this.keyHandler);
    }

    onStop() {
        window.removeEventListener("keydown", this.keyHandler);
    }
}
