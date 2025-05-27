=== OpenWebUI Chat Widget ===
Contributors: snetting
Tags: chat, ai, llm, openwebui, rag
Requires at least: 5.0
Tested up to: 6.8
Stable tag: 1.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html 
Donate link: https://buymeacoffee.com/oh3spn

A lightweight OpenWebUI-powered AI chat via shortcode or widget, with page context, RAG support & per-session history.

\== Description ==
 Simple, customizable chatbot integration for WordPress. Configure your endpoint, token, prompts, model and RAG collection from **Settings → OpenWebUI Chat**, then drop the widget in via shortcode or Custom HTML.

\== Features ==
* **Floating toggle & chat box** – Click the 💬 button to open/close the chat panel.  
* **Multi-line input** – Replaces single-line inputs with a `<textarea>` for longer messages.  
* **Context-aware** – Automatically sends the first 3,000 characters of the page (`document.body.innerText`) as context.  
* **WordPress Settings UI** – Configure API URL, API Token, System Prompt, Show Thinking flag, LLM Model & Collection ID under **Settings → OpenWebUI Chat**.  
* **Per-session history** – Conversation history persists only for the current page load.  
* **Shortcode support** – Use `[openwebui_chat]` to place the widget in posts or pages.  
* **Widget support** – Drop the provided HTML snippet into any Custom HTML widget area.  
* **Custom headers** – Adds `X-User-ID` and `X-Site-Host` headers for per-user/site rate-limiting on the backend.  

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
= 1.1.0 =
* Updated “Tested up to” to 6.8.1.  
* Renamed plugin slug to `openwebui-chat`.  
* Added `uninstall.php` option-cleanup.  
* Moved all config into WP Settings UI.  
* Injected `X-User-ID` & `X-Site-Host` headers for rate-limiting.  

\== Upgrade Notice ==
\= 1.1.0 =
First release on WordPress.org.  Configure under Settings → OpenWebUI Chat to get started.

