import wasm_webp from '@saschazar/wasm-webp';
import defaultOptions from '@saschazar/wasm-webp/options';

// Compress file & return as WebP blob
export const compressFile = async (file) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = async (e) => {
		const img = new Image();
		img.src = e.target.result;
		img.onload = async () => {
			// Calculate the height to maintain aspect ratio
			const scale = 1600 / img.width;
			const height = img.height * scale;

			// Create a canvas and draw the image on it
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = 1600;
			canvas.height = height;
			ctx.drawImage(img, 0, 0, 1600, height);

			// Extract the raw RGBA data from the canvas
			const imageData = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);
			const uint8Data = new Uint8Array(imageData.data.buffer);
			const channels = 4; // RGBA
			const options = defaultOptions; // Or customize as needed

			// Initialize the WebAssembly Module
			const webpModulePromise = wasm_webp({
				onRuntimeInitialized() {
					webpModulePromise.then(async (webpModule) => {
						const webpBlob = new Blob(
							[
								webpModule.encode(
									uint8Data,
									canvas.width,
									canvas.height,
									channels,
									options
								),
							],
							{ type: 'image/webp' }
						);
						webpModule.free();

						// Perform the upload
						if (webpBlob) {
							return webpBlob;
						} else {
							const error = new Error();
							error.message = 'image failed to convert to webp';
							throw error;
						}
					});
				},
			});
		};
	};
};
