import { useDataSync } from '@automattic/jetpack-react-data-sync-client';
import { z } from 'zod';

export const qualityConfigSchema = z.object( {
	lossless: z.boolean(),
	quality: z.number().int().min( 20 ).max( 100 ),
} );

export const imageCdnSettingsSchema = z.object( {
	jpg: qualityConfigSchema,
	png: qualityConfigSchema,
	webp: qualityConfigSchema,
} );

export type ImageCdnSettings = z.infer< typeof imageCdnSettingsSchema >;
export type QualityConfig = z.infer< typeof qualityConfigSchema >;

export function useImageCdnQuality(): [ ImageCdnSettings, ( newValue: ImageCdnSettings ) => void ] {
	const [ { data: imageCdnQuality }, { mutate: setImageCdnQuality } ] = useDataSync(
		'jetpack_boost_ds',
		'image_cdn_quality',
		imageCdnSettingsSchema
	);

	if ( ! imageCdnQuality ) {
		throw new Error( 'Image CDN Quality not loaded' );
	}

	return [ imageCdnQuality, setImageCdnQuality ];
}
