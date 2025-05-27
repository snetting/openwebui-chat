<?php
// If uninstall not called from WordPress, bail out.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

// Clean up all options
delete_option( 'owui_api_url' );
delete_option( 'owui_api_token' );
delete_option( 'owui_system_prompt' );
delete_option( 'owui_show_thinking' );
delete_option( 'owui_llm_model' );
delete_option( 'owui_collection_id' );
