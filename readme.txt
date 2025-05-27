\=== OpenWebUI Chat Widget ===
Contributors: snetting
Tags: chat, ai, llm, openwebui, rag, wordpress
Requires at least: 5.0
Tested up to: 6.5
Stable tag: 1.1.0
License: AGPLv3
License URI: [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)
Donate link: [https://www.oh3spn.fi/donate](https://www.oh3spn.fi/donate)

\== Description ==
This plugin adds a floating AI chat widget powered by an OpenWebUI backend to your WordPress site.

Click the 💬 button to open a chat box anywhere on posts, pages, or widget areas. It can also be embedded on any static site with the provided HTML & JS snippet.

Key features:

* Floating toggle opens and closes the chat panel
* Multi-line input (textarea)
* Context-aware: sends first 3,000 chars of page text as RAG context
* WordPress Settings UI: configure API URL, API Token, System Prompt, Show Thinking, LLM Model & Collection ID
* Per-session history (resets on page reload)
* Shortcode: `[openwebui_chat]`
* Widget snippet: embed a chat snippet in a Custom HTML widget (see the **Usage** section below for the exact code)

\== Installation ==

\=== Automatic Install ===

1. Go to **Plugins → Add New** in your WordPress admin.
2. Search for “OpenWebUI Chat Widget” and click **Install Now**.
3. Click **Activate**.
4. Visit **Settings → OpenWebUI Chat** to configure.

\=== Manual Install ===

1. Download the plugin zip from the WordPress directory or GitHub.
2. Upload the zip under **Plugins → Add New → Upload Plugin** and click **Install Now**.
3. Activate the plugin.
4. Configure under **Settings → OpenWebUI Chat**.

\== Usage ==

\=== Shortcode (WordPress) ===
Use the `[openwebui_chat]` shortcode in any post or page to render the chat toggle and box.

\=== Widget (Custom HTML) ===
Paste the following snippet into a Custom HTML widget in **Appearance → Widgets**:

```html
<button id="owui-chat-toggle">
  💬 <span style="vertical-align:middle;">Ask questions about this topic</span>
</button>
<div id="owui-chat-box" style="display:none;">
  <div id="owui-chat-header">Ask questions about this topic</div>
  <div id="owui-chat-body"></div>
  <div id="owui-chat-input">
    <input type="text" id="owui-input" placeholder="Type a message…" />
    <button id="owui-send">Send</button>
  </div>
</div>
```

\== Screenshots ==
1. screenshot-1.png — Front-end widget open on a post, showing the multi-colored user (blue) and bot (green) messages in the chat box.  
2. screenshot-2.png — Chat embedded on a static HTML page via the provided `<button>`/`<div>` snippet.  
3. screenshot-3.png — The “OpenWebUI Chat” settings screen in WordPress Admin (Settings → OpenWebUI Chat), with all configuration fields.  

\== Changelog ==
\= 1.1.0 =

* Initial WordPress.org release
* Added `uninstall.php` cleanup to remove options on uninstall
* Created `readme.txt` for WP.org directory
* Implemented WordPress Settings UI for all configuration
* Added `X-User-ID` and `X-Site-Host` headers for backend rate-limiting

\== Upgrade Notice ==
\= 1.1.0 =
First release on WordPress.org.  Configure under Settings → OpenWebUI Chat to get started.

