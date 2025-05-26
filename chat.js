//import { API, API_TOKEN, SYSTEM_PROMPT, SHOW_THINKING, LLM_MODEL, COLLECTION_ID } from './config.js';

const API           = OWUI_Config.apiUrl;
const API_TOKEN     = OWUI_Config.apiToken;
const SYSTEM_PROMPT = OWUI_Config.systemPrompt;
const SHOW_THINKING = OWUI_Config.showThinking;
const LLM_MODEL     = OWUI_Config.llmModel;
const COLLECTION_ID = OWUI_Config.collectionId;

(function(){
  const toggle        = document.getElementById('owui-chat-toggle');
  const box           = document.getElementById('owui-chat-box');
  const body          = document.getElementById('owui-chat-body');
  let   input         = document.getElementById('owui-input');
  const send          = document.getElementById('owui-send');

  // Replace single-line input with multi-line textarea
  const chatInputDiv  = document.getElementById('owui-chat-input');
  const originalInput = input;
  const textarea      = document.createElement('textarea');
  textarea.id          = 'owui-input';
  textarea.rows        = 3;
  textarea.placeholder = originalInput.placeholder;
  textarea.style.width = '100%';
  textarea.style.resize= 'vertical';
  textarea.style.padding = '8px';
  textarea.style.border  = '1px solid #ccc';
  textarea.style.borderRadius = '4px';
  chatInputDiv.replaceChild(textarea, originalInput);
  input = textarea;

  // One-session token to isolate this chat from previous sessions
  const SESSION_TOKEN = Date.now().toString();

  // Extract initial page context
  const pageText = (document.body.innerText || '').substring(0, 3000);
  let history = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: `Context from page:\n${pageText}` }
  ];

  // Optional <think> checkbox UI
  let thinkCheckbox = { checked: false };
  if (SHOW_THINKING) {
    const headerEl = document.getElementById('owui-chat-header');
    if (headerEl) {
      const thinkContainer = document.createElement('div');
      thinkContainer.style.display        = 'flex';
      thinkContainer.style.alignItems     = 'center';
      thinkContainer.style.justifyContent = 'flex-start';
      thinkContainer.style.gap            = '6px';
      thinkContainer.style.padding        = '4px 8px';

      thinkCheckbox = document.createElement('input');
      thinkCheckbox.type    = 'checkbox';
      thinkCheckbox.id      = 'owui-show-think';
      thinkCheckbox.style.cursor = 'pointer';
      thinkCheckbox.checked = false;

      const thinkLabel = document.createElement('label');
      thinkLabel.htmlFor     = 'owui-show-think';
      thinkLabel.textContent = 'show thinking';
      thinkLabel.style.color = '#000';
      thinkLabel.style.cursor= 'pointer';

      thinkContainer.appendChild(thinkCheckbox);
      thinkContainer.appendChild(thinkLabel);
      headerEl.appendChild(thinkContainer);
    }
  }

  // Toggle chat visibility
  toggle.addEventListener('click', () => {
    box.style.display = box.style.display === 'block' ? 'none' : 'block';
    if (box.style.display === 'block') input.focus();
  });

  // Append a message to chat body
  function appendMsg(text, sender) {
    const div = document.createElement('div');
    div.className = 'owui-message ' + sender;
    if (sender === 'user') {
      div.style.color     = '#1E90FF';
      div.style.textAlign = 'left';
    } else {
      div.style.color     = '#228B22';
      div.style.textAlign = 'left';
    }
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  // Send message and handle response
  // 1) Identify who & where
  const userId = window.OWUI_Config.wpUserId      // e.g. injected from PHP

  if (!userId) {
    userId = localStorage.getItem('owui_user_id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('owui_user_id', userId);
    }
  }

  const site   = window.location.host;
  
  async function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;

    // Record user turn
    appendMsg(msg, 'user');
    history.push({ role: 'user', content: msg });
    input.value = '';

    // Typing indicator
    appendMsg('... thinking ...', 'bot');
    const placeholder = body.lastChild;
    placeholder.style.whiteSpace = 'pre-wrap';
   
    // 1) Build your filesPayload
    const filesPayload = [];
    if (COLLECTION_ID) {
      filesPayload.push({
        type: "collection",
        id:   COLLECTION_ID
        });
    }

    try {
    // 2) Construct the payload
    const payload = {
      model:          LLM_MODEL,
      messages:       history,
      session_token:  SESSION_TOKEN,
      // 3) Conditionally spread in `files` only when you have something
      ...(filesPayload.length > 0 && { files: filesPayload })
    };

    //console.log('🛰️ OpenWebUI Payload:', JSON.stringify(payload, null, 2));

      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
	  'X-User-ID':     userId,
	  'X-Site-Host':   site
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) throw new Error('Unauthorized (401): check your API_TOKEN');
      if (res.status === 429 || res.status === 503) {
        throw new Error('You’re sending messages too quickly. Please wait a moment and try again.');
      }
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      let raw = data.choices[0].message.content || '';
      let clean;

      // Display and compute clean output
      if (SHOW_THINKING && thinkCheckbox.checked) {
        // Highlight <think> sections in grey
        const html = raw.replace(/<think>([\s\S]*?)<\/think>/gi,
          '<span class="owui-thinking">$1</span>'
        );
        placeholder.innerHTML = html;
        clean = raw.replace(/<\/??think>/gi, '').trim();
      } else {
        clean = raw.split(/<\/think>/i)[1]?.trim() || raw.trim();
        clean = clean.replace(/\[\d+\]/g, '').trim();
        placeholder.textContent = clean;
      }

      // Record clean assistant turn
      history.push({ role: 'assistant', content: clean });

      // Spacer after reply
      const spacer = document.createElement('div');
      spacer.style.height = '1em';
      body.appendChild(spacer);
      body.scrollTop = body.scrollHeight;
    } catch (err) {
      placeholder.textContent = `Error: ${err.message}`;
      console.error(err);
    }
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();

