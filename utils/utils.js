export function normilizeAngle(angle) {
	angle = angle % (Math.PI * 2);
	if (angle < 0) angle = (Math.PI * 2) + angle;
	return angle;
}

export function distance(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export function degreesToRadians(degrees) {
	return (degrees * Math.PI) / 180;
}

export function canvasReScale(canvas) {
	canvas.style.width = '800px';
	canvas.style.height = '800px';
}

export function createBitMap(ctx, imgRawData, imageWidth, imageHeight) {
  let image = ctx.createImageData(imageWidth, imageHeight); // only do this once per page

    try {
      for(let i = 0; i < imageWidth; i++) {
        for(let j = 0; j < imageHeight; j++) {
          // d[i * 50 * 4 + j * 4]      = 255 // r;
          // d[i * 50 * 4 + j * 4 + 1]  = 0   // g;
          // d[i * 50 * 4 + j * 4 + 2]  = 0   // b;
          // d[i * 50 * 4 + j * 4 + 3]  = 255 // a;

          image.data[i * imageWidth * 4 + j * 4]      = imgRawData[i * imageWidth * 4 + j * 4]
          image.data[i * imageWidth * 4 + j * 4 + 1]  = imgRawData[i * imageWidth * 4 + j * 4 + 1]
          image.data[i * imageWidth * 4 + j * 4 + 2]  = imgRawData[i * imageWidth * 4 + j * 4 + 2]
          image.data[i * imageWidth * 4 + j * 4 + 3]  = imgRawData[i * imageWidth * 4 + j * 4 + 3]
        }
      }

      return createImageBitmap(image, 0, 0, imageWidth, imageHeight);
    } catch(e) {
      console.log(e.message);
    }
}

export function renderSprites(sprites) {
  sprites.sort(function(obj1, obj2) {
    // Ascending: obj1.distance - obj2.distance;
    // Descending: obj2.distance - obj1.distance;
    return obj2.distance - obj1.distance;
  });
}