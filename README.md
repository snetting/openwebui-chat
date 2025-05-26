# WordPress OpenWebUI Chat Plugin\
## Version 1.1

A simple WordPress plugin that embeds a floating chat widget powered by an OpenWebUI backend. Users can chat with your AI model directly from any post, page, widget area or **any static site** (e.g., GitHub Pages, Netlify) by including a small HTML/JS snippet.

* * * * *

Features
--------

-   **Floating toggle & chat box**: Click the 💬 button to open/close.

-   **Multi-line input**: Replaced single-line input with a textarea.

-   **Context‑aware**: Sends the first 3,000 characters of page text as context (`document.body.innerText`).

-   **WordPress UI configuration**: Set API URL, API Token, System Prompt, Show Thinking flag, LLM Model & Collection ID directly in Settings → OpenWebUI Chat.

-   **Per-session history**: Conversation history persists only for the current page load.

-   **Shortcode support**: Insert anywhere with `[openwebui_chat]`.

-   **Widget support**: Paste snippet into a Custom HTML widget.

-   **Standalone support**: Embed on non‑WordPress pages with a simple HTML + JS snippet.

-   **Custom headers**: Adds `X-User-ID` and `X-Site-Host` headers to enable per-user/site rate‑limiting on the backend.

> ⚠️ **Tested only** with an OpenWebUI backend. Other servers should work if they follow the standard `/api/chat/completions` spec, but compatibility isn't guaranteed.

* * * * *

Installation
------------

1.  **Download or clone** this repo into your WordPress `wp-content/plugins/` folder:

    ```
    cd wp-content/plugins
    git clone git@github.com:snetting/Wordpress-OpenWebUI-Plugin.git openwebui-chat
    ```

2.  **Activate** the plugin in WordPress Admin under **Plugins → Installed Plugins → OpenWebUI Chat Widget**.

* * * * *

Configuration (WordPress Settings UI)
-------------------------------------

After activating, visit **Settings → OpenWebUI Chat** to configure:

-   **API URL**: Full endpoint (e.g. `https://your-server.com:4000/api/chat/completions`)

-   **API Token**: Bearer token for authentication

-   **Show Thinking UI**: Enable `<think>...</think>` debug output

-   **LLM Model**: Model identifier (e.g. `qwen-general4b`)

-   **System Prompt**: (optional) Guide the assistant's behavior and tone

-   **Collection ID**: RAG knowledge collection UUID (optional)

Saved settings are automatically passed to the front-end script.

* * * * *

Usage
-----

### As a Shortcode (WordPress)

Add:

```
[openwebui_chat]
```

### In a Custom HTML Widget (WordPress)

Paste:

```
<button id="owui-chat-toggle">💬 Ask questions about this topic</button>
<div id="owui-chat-box" style="display:none;">
  <div id="owui-chat-header">Ask questions about this topic</div>
  <div id="owui-chat-body"></div>
  <div id="owui-chat-input">
    <input type="text" id="owui-input" placeholder="Type a message..." />
    <button id="owui-send">Send</button>
  </div>
</div>
```

### On Any Static Site

1.  **Include HTML** at end of `<body>`.

2.  **Define **`**window.OWUI_Config**` before loading scripts:

    ```
    <script>
      window.OWUI_Config = {
        apiUrl:        "https://your-server.com:4000/api/chat/completions",
        apiToken:      "your-api-key",
        systemPrompt:  "(optional) Your prompt here",
        showThinking:  false,
        llmModel:      "qwen-general4b",
        collectionId:  ""  // optional
      };
    </script>
    ```

3.  **Include assets**:

    ```
    <link rel="stylesheet" href="/path/to/chat.css">
    <script type="module" src="/path/to/chat.js"></script>
    ```

* * * * *

Examples
--------

-   Amateur Radio Blog (including RAG): <https://www.m0spn.co.uk/chat/>

-   Tarot demo (including RAG): <https://www.learningtarot.net>

-   UAP‑focused site (no RAG): <https://www.nordic-ufo.org>

* * * * *

Development & Customization
---------------------------

-   **Settings page**: Registers options via WP Settings API and localizes them into JS.

-   **Session isolation**: Generates a per-load session token so no cross-page history bleed.

-   **Custom headers**: `X-User-ID` (WP user or visitor UUID) and `X-Site-Host` help implement rate-limiting at the proxy.

Feel free to fork and extend.

* * * * *

Hosted & Enterprise Services
----------------------------

We plan to offer a fully‑managed LLM endpoint with:

-   **RAG pipelines** for secure document upload and querying

-   **Fine‑tuning** services to embed domain knowledge

-   **High‑availability**, SLA‑backed hosting & support

Contact us for early access and enterprise partnerships.

* * * * *

License
-------

This plugin is licensed under **AGPLv3**. We may relicense or dual-license in the future for commercial offerings, but any distributed modifications under AGPLv3 must remain open-source under the same terms.
