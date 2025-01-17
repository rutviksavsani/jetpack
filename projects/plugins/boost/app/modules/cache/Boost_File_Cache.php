<?php

namespace Automattic\Jetpack_Boost\Modules\Page_Cache;

/*
 * This file is loaded by advanced-cache.php and bypasses WordPress.
 * As it is loaded before WordPress is loaded, it is not autoloaded by Boost.
 */
require_once __DIR__ . '/Boost_Cache.php';

class Boost_File_Cache extends Boost_Cache {
	/*
	 * Returns the path to the cache directory for the given request, or current request
	 *
	 * @param string $request_uri - The request uri to get the path for. Defaults to current request.
	 * @return string - The path to the cache directory for the given request.
	 */
	private function path( $request_uri = false ) {
		if ( $request_uri !== false ) {
			$request_uri = $this->normalize_request_uri( $request_uri );
		} else {
			$request_uri = $this->request_uri;
		}

		$key  = $this->path_key( $request_uri );
		$path = WP_CONTENT_DIR . '/boost-cache/cache/';

		/*
		 * The cache directory is split into 5 levels of subdirectories.
		 * 2 characters of the md5 hash of the request uri are used for each level.
		 * This is done to prevent having too many files in a single directory.
		 */
		for ( $i = 0; $i < 10; $i += 2 ) {
			$path .= substr( $key, $i, 2 ) . '/';
		}

		return $path;
	}

	/*
	 * Returns the cache filename for the given request, or current request.
	 *
	 * @param array $args - an array containing the request_uri, cookies array, and get array representing the request.
	 * @return string - The cache path + filename for the given request.
	 */
	private function cache_filename( $args = array() ) {
		$defaults = array(
			'request_uri' => $this->request_uri,
			'cookies'     => $_COOKIE, // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			'get'         => $_GET, // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Recommended
		);
		$args     = array_merge( $defaults, $args );

		return $this->path( $args['request_uri'] ) . $this->cache_key( $args ) . '.html';
	}

	/*
	 * Outputs the cached page if it exists for the given request, or current request.
	 *
	 * @param array $args - an array containing the request_uri, cookies array, and get array representing the request.
	 * @return bool - false if page was not cached.
	 */
	public function get( $args = array() ) {
		if ( ! $this->is_cacheable() ) {
			return false;
		}
		if ( file_exists( $this->cache_filename( $args ) ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents, WordPress.Security.EscapeOutput.OutputNotEscaped
			echo file_get_contents( $this->cache_filename( $args ) ) . '<!-- cached -->';
			die();
		}
		return false;
	}

	/*
	 * Creates the cache directory if it doesn't exist.
	 *
	 * @param string $path - The path to the cache directory to create.
	 */
	private function create_cache_directory( $path ) {
		if ( ! is_dir( $path ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.dir_mkdir_dirname, WordPress.WP.AlternativeFunctions.file_system_operations_mkdir
			return mkdir( $path, 0755, true );
		}

		return true;
	}

	/*
	 * Saves the output buffer to the cache file for the given request, or current request.
	 * Then outputs the buffer to the browser.
	 *
	 * @param string $buffer - The output buffer to save to the cache file.
	 * @return bool|WP_Error - WP_Error if page was not cacheable.
	 */
	public function set( $buffer ) {
		if ( ! $this->is_cacheable() ) {
			return new \WP_Error( 'Page is not cacheable' );
		}

		if ( strlen( $buffer ) === 0 ) {
			return new \WP_Error( 'Empty buffer' );
		}

		$cache_filename = $this->cache_filename();
		if ( ! $this->create_cache_directory( dirname( $cache_filename ) ) ) {
			return new \WP_Error( 'Could not create cache directory' );
		}

		$tmp_filename = $cache_filename . uniqid( wp_rand(), true ) . '.tmp';
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
		if ( false === file_put_contents( $tmp_filename, $buffer ) ) {
			return new \WP_Error( 'Could not write to tmp file' );
		}

		// phpcs:ignore WordPress.WP.AlternativeFunctions.rename_rename
		if ( ! rename( $tmp_filename, $cache_filename ) ) {
			return new \WP_Error( 'Could not rename tmp file' );
		}

		return true;
	}
}
