Wordpress OpenWebUI Chat Plugin
===============================

A simple WordPress plugin that embeds a floating chat widget powered by an OpenWebUI backend. Users can chat with your AI model directly from any post, page, or widget area.

* * * * *

Features
--------

-   **Floating toggle & chat box**: Click the 💬 button to open/close.

-   **Multi-line input**: Automatically replaces the single-line input with a textarea.

-   **Context-aware**: Sends the first 3,000 characters of page text as context.

-   **Configurable**: All sensitive values (`API`, `API_TOKEN`, `SYSTEM_PROMPT`, `SHOW_THINKING`, `LLM_MODEL`) live in `config.js`.

-   **Shortcode support**: Insert the widget anywhere with `[openwebui_chat]`.

-   **Widget support**: Paste the HTML snippet into a Custom HTML widget.

> ⚠️ **Tested only** with an OpenWebUI backend. Other servers *should* work if they conform to the standard chat/completions API, but compatibility isn't guaranteed.

* * * * *

Installation
------------

1.  **Download or clone** this repo into your WordPress `wp-content/plugins/` folder, e.g.:

    ```
    cd wp-content/plugins
    git clone git@github.com:snetting/Wordpress-OpenWebUI-Plugin.git openwebui-chat
    ```

2.  **Activate** the plugin in the WordPress Admin under **Plugins → Installed Plugins → OpenWebUI Chat Widget**.

* * * * *

Configuration (`config.js`)
---------------------------

All connection details and prompts are stored in `config.js` at the plugin root. Edit this file to match your backend and preferences. **This repo is private**, so the following example values are valid for testing:

```
// config.js
export const API = "https://dogbox.track3.org.uk:4001/api/chat/completions";
export const API_TOKEN = "sk-7db43b229f614481b413ceba13a1f186";

export const SYSTEM_PROMPT =
  "You are an expert in the supplied page content. Please ask questions to clarify the user's request. " +
  "Do not reference any documents or context the user cannot access, and do NOT include any bracketed citations (e.g., [1], [2]) in your responses. " +
  "Keep all responses short and succinct.";

export const SHOW_THINKING = false;  // set to true to enable the <think> debug UI
export const LLM_MODEL    = "qwen-general4b";  // model identifier to send in payload
```

> **Note:** Be sure to exclude `config.js` from public repos or version control if you use real credentials.

* * * * *

Usage
-----

### As a Shortcode

Add the following shortcode anywhere in your post or page content:

```
[openwebui_chat]
```

WordPress will render the chat toggle and box in place.

### In a Custom HTML Widget

1.  In **Appearance → Widgets**, drag a **Custom HTML** widget into a sidebar or footer area.

2.  Paste this snippet into the widget content:

```
<button id="owui-chat-toggle">
  💬 <span style="vertical-align:middle;">Ask questions about this topic</span>
</button>

<div id="owui-chat-box" style="display:none;">
  <!-- ADD THIS HEADER BACK IN -->
  <div id="owui-chat-header">Ask questions about this topic</div>

  <div id="owui-chat-body"></div>
  <div id="owui-chat-input">
    <input type="text" id="owui-input" placeholder="Type a message..." />
    <button id="owui-send">Send</button>
  </div>
</div>
```

The plugin's JS and CSS will automatically style and wire up the widget.

* * * * *

Development & Customization
---------------------------

-   **Enqueueing**: `openwebui-chat.php` enqueues `chat.css`, `config.js`, and `chat.js` as ES modules.

-   **Script loader**: Uses `script_loader_tag` filter to inject `type="module"` on those scripts.

-   **Context**: `chat.js` grabs the first 3,000 chars of `document.body.innerText` and includes it as a second system instruction.

Feel free to fork and extend:

-   Add admin settings instead of `config.js`.

-   Swap in your own CSS or UI framework.

-   Change the session token logic or message history handling.

* * * * *

License
-------

TBC
