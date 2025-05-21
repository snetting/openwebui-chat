<?php
/**
 * Plugin Name: OpenWebUI Chat Widget
 * Description: Simple chat widget powered by OpenWebUI.
 * Version: 1.0
 * Author: Your Name
 */

if ( ! defined('ABSPATH') ) exit;

// Enqueue our scripts & styles
add_action('wp_enqueue_scripts', function(){
    // 1) Enqueue CSS
    wp_enqueue_style(
        'owui-chat-style',
        plugin_dir_url(__FILE__) . 'chat.css'
    );

    // 2) Enqueue config.js (must load before chat.js)
    wp_enqueue_script(
        'owui-config-script',
        plugin_dir_url(__FILE__) . 'config.js',
        [],    // no dependencies
        null,  // no version
        true   // load in footer
    );

    // 3) Enqueue chat.js
    wp_enqueue_script(
        'owui-chat-script',
        plugin_dir_url(__FILE__) . 'chat.js',
        [],    // we’ll force module loading below
        null,
        true
    );

    // (Optional) pass PHP-side config into JS if needed
    wp_localize_script('owui-chat-script', 'OWUI_Config', [
        'apiUrl' => 'https://YOUR-OPENWEBUI-SERVER/api/chat'
    ]);
});

// Rewrite our scripts to load as ES modules
add_filter('script_loader_tag', function($tag, $handle, $src){
    // Only target these two handles
    if ( in_array($handle, ['owui-config-script', 'owui-chat-script'], true) ) {
        return sprintf(
            '<script type="module" src="%s"></script>',
            esc_url($src)
        );
    }
    return $tag;
}, 10, 3);

// Shortcode handler
add_shortcode('openwebui_chat', function(){
    return <<<HTML
<button id="owui-chat-toggle">💬</button>
<div id="owui-chat-box">
  <div id="owui-chat-header">Chat with us</div>
  <div id="owui-chat-body"></div>
  <div id="owui-chat-input">
    <input type="text" id="owui-input" placeholder="Type a message…" />
    <button id="owui-send">Send</button>
  </div>
</div>
HTML;
});
