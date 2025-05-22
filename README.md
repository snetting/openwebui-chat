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

-   **Amateur Radio Blog including RAG**: https://www.m0spn.co.uk/chat/
-   **Tarot Education Site**:   https://www.learningtarot.net
-   **UAP-focused site**: https://www.nordic-ufo.org

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
