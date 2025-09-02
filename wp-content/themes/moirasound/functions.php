<?php

function setup_theme_supports() {
    add_theme_support('post-thumbnails');
    add_theme_support('menus');
}
    
add_action('after_setup_theme', 'setup_theme_supports');

function add_featured_image_to_artista_rest_api($data, $post, $context) {
    $featured_image_id = get_post_thumbnail_id($post->ID);
    if ($featured_image_id) {
        $featured_image_url = wp_get_attachment_image_src($featured_image_id, 'full');
        if ($featured_image_url) {
            $data->data['featured_image_url'] = $featured_image_url[0];
        }
    }
    return $data;
}
add_filter('rest_prepare_artista', 'add_featured_image_to_artista_rest_api', 10, 3);    

function disable_wp_frontend() {
    if (is_admin() || strpos($_SERVER['REQUEST_URI'], '/wp-json/') === 0 ) {
        return;
    }
    
    wp_redirect('http://localhost:4321', 301);
    exit;
}

add_action('template_redirect', 'disable_wp_frontend');





