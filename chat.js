import { API, API_TOKEN, SYSTEM_PROMPT, SHOW_THINKING, LLM_MODEL } from './config.js';

(function(){
  const toggle        = document.getElementById('owui-chat-toggle');
  const box           = document.getElementById('owui-chat-box');
  const body          = document.getElementById('owui-chat-body');
  let   input         = document.getElementById('owui-input');
  const send          = document.getElementById('owui-send');
//  const API    = "https://dogbox.track3.org.uk:4001/api/chat/completions";
//  const API_TOKEN = 'sk-7db43b229f614481b413ceba13a1f186';
//  const SHOW_THINKING = false; // toggle this to true to show the <think> checkbox/UI
//    const SYSTEM_PROMPT =
//    "You are an expert in Tarot. Please ask questions to clarify the user's request. " +
//    "Do not reference any documents or context the user cannot access, and do NOT include any bracketed citations (e.g., [1], [2]) in your responses. " + 
//    "Keep all responses short and succinct.";

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
    if (sender === 'user') div.style.color = '#1E90FF';
    else if (sender === 'bot')  div.style.color = '#228B22';
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  // Send message and handle response
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

    try {
      const payload = {
        model:    LLM_MODEL,
        messages: history,
        session_token: SESSION_TOKEN
      };

      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) throw new Error('Unauthorized (401): check your API_TOKEN');
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      let raw = data.choices[0].message.content || '';
      // Use <think> only if SHOW_THINKING and checked
      let clean = (SHOW_THINKING && thinkCheckbox.checked)
        ? raw.trim()
        : raw.split(/<\/think>/i)[1]?.trim() || raw.trim();
      clean = clean.replace(/\[\d+\]/g, '').trim();
      clean = '\n' + clean;

      placeholder.style.whiteSpace = 'pre-wrap';
      placeholder.textContent = clean;

      // Spacer after reply
      const spacer = document.createElement('div');
      spacer.style.height = '1em';
      body.appendChild(spacer);
      body.scrollTop = body.scrollHeight;

      // Record assistant turn
      history.push({ role: 'assistant', content: clean });
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

