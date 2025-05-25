<?php
/**
 * Plugin Name: OpenWebUI Chat Widget
 * Description: Simple chat widget powered by OpenWebUI.
 * Version: 1.1
 * Author: Steve Netting OH3SPN
 * Author URI: https://www.oh3spn.fi
 */

if ( ! defined('ABSPATH') ) exit;

// 1a) Hook to create the admin menu
add_action( 'admin_menu', 'owui_add_settings_page' );
function owui_add_settings_page() {
    add_options_page(
        'OpenWebUI Chat Settings',       // page title
        'OpenWebUI Chat',                // menu title
        'manage_options',                // capability
        'owui-chat',                     // menu slug
        'owui_render_settings_page'      // callback
    );
}

// 1b) Hook to register our settings
add_action( 'admin_init', 'owui_register_settings' );
function owui_register_settings() {
    // Register each option, with a sanitization callback
    register_setting( 'owui_chat_options', 'owui_api_url',       'esc_url_raw' );
    register_setting( 'owui_chat_options', 'owui_api_token',     'sanitize_text_field' );
    register_setting( 'owui_chat_options', 'owui_system_prompt', 'sanitize_textarea_field' );
    register_setting( 'owui_chat_options', 'owui_show_thinking', 'absint' );
    register_setting( 'owui_chat_options', 'owui_llm_model',     'sanitize_text_field' );
    register_setting( 'owui_chat_options', 'owui_collection_id', 'sanitize_text_field' );

    // Add a settings section
    add_settings_section(
        'owui_main_section',
        'Chat Configuration',
        function(){ echo '<p>Set your OpenWebUI endpoint, token, prompts, etc.</p>'; },
        'owui-chat'
    );

    // Add each field
    add_settings_field( 'owui_api_url', 'API URL', function(){
        printf(
          '<input type="text" name="owui_api_url" value="%s" class="regular-text" />',
           esc_attr( get_option('owui_api_url') )
        );
    }, 'owui-chat', 'owui_main_section' );

    add_settings_field( 'owui_api_token', 'API Token', function(){
        printf(
          '<input type="password" name="owui_api_token" value="%s" class="regular-text" />',
           esc_attr( get_option('owui_api_token') )
        );
    }, 'owui-chat', 'owui_main_section' );

    add_settings_field( 'owui_llm_model', 'Model Name', function(){
        printf(
          '<input type="text" name="owui_llm_model" value="%s" class="regular-text" />',
           esc_attr( get_option('owui_llm_model') )
        );
    }, 'owui-chat', 'owui_main_section' );

    add_settings_field( 'owui_show_thinking', 'Show Thinking UI', function(){
        $val = get_option('owui_show_thinking') ? 'checked' : '';
        echo "<label><input type='checkbox' name='owui_show_thinking' value='1' $val /> Enable debug thinking output</label>";
    }, 'owui-chat', 'owui_main_section' );

   add_settings_field(
     'owui_optional_note',           // just a unique ID
     '',                             // empty title
      function(){
        echo '<p><em>Note:</em> The following fields are <strong>optional</strong>.</p>';
      },
      'owui-chat',                    // page slug
      'owui_main_section'             // same section
   );

    add_settings_field( 'owui_system_prompt', 'System Prompt', function(){
        printf(
          '<textarea name="owui_system_prompt" rows="4" cols="50">%s</textarea>',
           esc_textarea( get_option('owui_system_prompt') )
        );
    }, 'owui-chat', 'owui_main_section' );

    add_settings_field( 'owui_collection_id', 'Collection ID', function(){
        printf(
          '<input type="text" name="owui_collection_id" value="%s" class="regular-text" />',
           esc_attr( get_option('owui_collection_id') )
        );
    }, 'owui-chat', 'owui_main_section' );
}

// 1c) Render the settings page HTML
function owui_render_settings_page() {
    if ( ! current_user_can('manage_options') ) {
        return;
    }
    echo '<div class="wrap"><h1>OpenWebUI Chat Settings</h1>';
    echo '<form method="post" action="options.php">';
    settings_fields( 'owui_chat_options' );
    do_settings_sections( 'owui-chat' );
    submit_button();
    echo '</form></div>';
}

// Add a Settings link under the plugin on Plugins → Installed Plugins
add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), function( $links ) {
    $settings_link = '<a href="options-general.php?page=owui-chat">Settings</a>';
    array_unshift( $links, $settings_link );
    return $links;
} );

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
    
        // Gather our dynamic config from WP options:
    $cfg = array(
      'apiUrl'        => esc_url_raw( get_option('owui_api_url', '') ),
      'apiToken'      => sanitize_text_field( get_option('owui_api_token', '') ),
      'systemPrompt'  => sanitize_textarea_field( get_option('owui_system_prompt', '') ),
      'showThinking'  => (bool) get_option('owui_show_thinking', false),
      'llmModel'      => sanitize_text_field( get_option('owui_llm_model', '') ),
      'collectionId'  => sanitize_text_field( get_option( 'owui_collection_id', '') ),
    );

    wp_localize_script( 'owui-chat-script', 'OWUI_Config', $cfg );
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
  <div id="owui-chat-header">Ask Questions</div>
  <div id="owui-chat-body"></div>
  <div id="owui-chat-input">
    <input type="text" id="owui-input" placeholder="Type a message…" />
    <button id="owui-send">Send</button>
  </div>
</div>

HTML;
});
