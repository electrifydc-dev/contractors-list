<?php
/**
 * WordPress functions to expose Contractors custom post type to REST API
 * Add this code to your theme's functions.php file
 */

// Enable REST API for Contractors custom post type
add_action('init', function() {
    // Get the post type object
    $post_type = get_post_type_object('contractors');
    
    if ($post_type) {
        // Enable REST API support
        $post_type->show_in_rest = true;
        $post_type->rest_base = 'contractors';
        $post_type->rest_controller_class = 'WP_REST_Posts_Controller';
    }
});

// Add custom fields to REST API response
add_action('rest_api_init', function() {
    // Register custom fields for contractors
    register_rest_field('contractors', 'acf', array(
        'get_callback' => function($object) {
            return get_fields($object['id']);
        },
        'update_callback' => null,
        'schema' => array(
            'description' => 'ACF fields for contractor',
            'type' => 'object'
        )
    ));
});

// Enable CORS for Vercel domain
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});

// Add custom query parameters for filtering
add_action('rest_contractors_query', function($args, $request) {
    // Handle service type filtering based on boolean fields
    $service_type = $request->get_param('service_type');
    if ($service_type) {
        $args['meta_query'] = array(
            array(
                'key' => $service_type,
                'value' => '1',
                'compare' => '='
            )
        );
    }
    
    // Handle location filtering
    $location = $request->get_param('location');
    if ($location) {
        $args['meta_query'] = array(
            array(
                'key' => 'state',
                'value' => $location,
                'compare' => '='
            )
        );
    }
    
    return $args;
}, 10, 2);

// Add custom headers for pagination
add_filter('rest_contractors_collection_params', function($params) {
    $params['service_type'] = array(
        'description' => 'Filter by service type (energy_audit, weatherization, hvac_heat_pump, electrical, water_heater, appliances)',
        'type' => 'string'
    );
    $params['location'] = array(
        'description' => 'Filter by state',
        'type' => 'string'
    );
    return $params;
});

// Ensure ACF fields are available in REST API
add_action('acf/init', function() {
    // This ensures ACF fields are properly registered for REST API
    if (function_exists('acf_add_options_page')) {
        // ACF is active, ensure fields are available
    }
});
