Wordpress OpenWebUI Chat Plugin
===============================

A simple WordPress plugin that embeds a floating chat widget powered by an OpenWebUI backend. Users can chat with your AI model directly from any post, page, or widget area. You can also integrate the same chat widget on **any** static site (e.g., GitHub Pages, Netlify) by including the provided HTML/JS snippet.

* * * * *

Features
--------

-   **Floating toggle & chat box**: Click the 💬 button to open/close.
-   **Multi-line input**: Replaced previous single line input with textarea.
-   **Context-aware**: Sends the first 3,000 characters of page text as context (via `document.body.innerText`).
-   **Configurable**: All sensitive values (`API`, `API_TOKEN`, `SYSTEM_PROMPT`, `SHOW_THINKING`, `LLM_MODEL`) live in `config.js`.
-   **Per-chat history**: Retains conversation history for the current session (page load) only.
-   **Shortcode support**: Insert the widget anywhere with `[openwebui_chat]`.
-   **Widget support**: Paste the HTML snippet into a Custom HTML widget.
-   **Standalone support**: Embed on non-WordPress pages with a simple HTML + JS snippet.

> ⚠️ **Tested only** with an OpenWebUI backend. Other servers *should* work if they conform to the standard chat/completions API, but compatibility isn't guaranteed.

* * * * *

Installation
------------

1.  **Download or clone** this repo into your WordPress `wp-content/plugins/` folder, e.g.:

    ```bash
    cd wp-content/plugins
    git clone git@github.com:snetting/Wordpress-OpenWebUI-Plugin.git
    ```

2.  **Activate** the plugin in the WordPress Admin under **Plugins → Installed Plugins → OpenWebUI Chat Widget**.

* * * * *

Configuration (`config.js`)
---------------------------

All connection details and prompts are stored in `config.js` at the plugin root. Edit this file to match your backend and preferences. The following example values are provided **for demo purposes only** (uptime and responsiveness cannot be guaranteed):

```js
// config.js
export const API = "https://dogbox.track3.org.uk:4001/api/chat/completions";
export const API_TOKEN = "sk-7db43b229f614481b413ceba13a1f186";

export const SYSTEM_PROMPT =
  "You are an expert in the supplied page content. Please ask questions to clarify the user's request. " +
  "Do not reference any documents or context the user cannot access Do NOT include any bracketed citations/sources (e.g., [1], [2]) in your responses. " +
  "Keep all responses short and succinct. ";

export const SHOW_THINKING = false;  // set to true to enable the <think> debug UI
export const LLM_MODEL    = "qwen3-general06b";  // model identifier to send in payload
export const COLLECTION_IS  = ""; // knowledge collection, if used (otherwise empty)
```

> **Note:** Be sure to exclude `config.js` from public repos or version control if you use real credentials.

* * * * *

Usage
-----

### As a Shortcode (WordPress)

Add the following shortcode anywhere in your post or page content:

```
[openwebui_chat]
```

WordPress will render the chat toggle and box in place.

### In a Custom HTML Widget (WordPress)

1.  In **Appearance → Widgets**, drag a **Custom HTML** widget into a sidebar or footer area.
2.  Paste this snippet into the widget content:

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

The plugin's JS and CSS will automatically style and wire up the widget.

### On Any Static Site (GitHub Pages, Netlify, etc.)

1.  **Include HTML** at the end of your `<body>`:
    ```html
    <!-- Chat widget markup -->
    <button id="owui-chat-toggle">💬 Ask questions about this topic</button>
    <div id="owui-chat-box" style="display:none;">
      <div id="owui-chat-header">Ask questions about this topic</div>
      <div id="owui-chat-body"></div>
      <div id="owui-chat-input">
        <input id="owui-input" placeholder="Type a message…" />
        <button id="owui-send">Send</button>
      </div>
    </div>
    <!-- End chat widget -->
    ```

2.  **Define global config** before loading `chat.js`:
    ```html
    <script>
      window.OWUI_Config = {
        apiUrl:   "https://dogbox.track3.org.uk:4001/api/chat/completions",
        apiToken: "sk-7db43b229f614481b413ceba13f186"
      };
    </script>
    ```

3.  **Include JS & CSS**:
    ```html
    <link rel="stylesheet" href="/path/to/chat.css">
    <script type="module" src="/path/to/chat.js"></script>
    ```

* * * * *

Examples
--------

-   **Amateur Radio Blog (including RAG)**: https://www.m0spn.co.uk/chat/
-   **UAP-focused site (no RAG)**: https://www.nordic-ufo.org

* * * * *

Development & Customization
---------------------------

-   **Enqueueing**: `openwebui-chat.php` enqueues `chat.css`, `config.js`, and `chat.js` as ES modules.
-   **Script loader**: Uses `script_loader_tag` filter to inject `type="module"` on those scripts.
-   **Context**: `chat.js` grabs the first 3,000 chars of `document.body.innerText` and includes it as a second system instruction.
-   **Session isolation**: Each page-load uses a fresh session token to avoid cross-page or cross-site history bleed.

To do:

-   Add admin settings instead of `config.js`.

* * * * *

Hosted & Enterprise Services
-----------------------------

We plan to offer a paid, fully‑managed LLM endpoint with advanced features including:

- **RAG (Retrieval‑Augmented Generation)** pipelines for uploading and querying custom documents securely.
- **Fine‑tuning** services to embed specialized domain knowledge directly into model weights.
- **High‑availability**, SLA‑backed hosting, monitoring, and support.

Pricing, SLAs, and feature details will be published in due course. If you’re interested in early access or enterprise partnerships, please contact us.

License
-------

This plugin is licensed under **AGPLv3**. We may relicense or dual-license in the future for commercial offerings, but any modifications distributed under AGPLv3 must remain open-source and under the same terms.
