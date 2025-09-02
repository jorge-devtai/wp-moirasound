<?php
/**
 * Plugin Name: REST Menús públicos
 */

add_filter( 'rest_authentication_errors', function( $result ) {
    // Permitir acceso anónimo a /wp/v2/menu-items y /wp/v2/menus
    if ( strpos( $_SERVER['REQUEST_URI'], '/wp-json/wp/v2/menu-items' ) === 0 ||
         strpos( $_SERVER['REQUEST_URI'], '/wp-json/wp/v2/menus' )       === 0 ) {
        return true;   // salta autenticación
    }
    return $result;
}, 20 );