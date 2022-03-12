import "./App.css";
import React, {useEffect, useState} from "react";

// lazy loading image
// lazy load using intesection oberserver
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Using_the_Intersection_Observer_API
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Intersection_Observer_with_custom_settings

const imagesUrl = [
  "https://i.pinimg.com/originals/34/f3/80/34f3807d8e588f8ac2095f47e740c923.png",
  "https://deadline.com/wp-content/uploads/2021/10/The-Lion-King-e1635332653876.jpeg?w=681&h=383&crop=1",
  "https://cdn11.bigcommerce.com/s-ydriczk/images/stencil/original/products/89322/94549/Genie-Disney-Aladdin-Card-Party-Face-Mask-available-now-at-starstills__14885.1597761288.jpg?c=2",
];
const range = (start, stop, step = 1) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
const imagesUrls = range(0, 1000).map(index => `https://picsum.photos/200/200/?image=${index}`);


const placeHolder =
  "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png";

const LazyImage = ({ src }) => {
  const [imageSrc, setImageSrc] = useState(placeHolder);
  const [imageRef, setImageRef] = useState();

  useEffect(
    () => {
      let observer;
      let didCancel = false;

      if (imageRef && imageSrc !== src) {
        if (IntersectionObserver) {
          observer = new IntersectionObserver(
            entries => {
              entries.forEach(entry => {
                if (
                  !didCancel &&
                  (entry.intersectionRatio > 0 || entry.isIntersecting)
                ) {
                  setImageSrc(src);
                  observer.unobserve(imageRef);
                }
              });
            },
            {
              threshold: 0.01,
              rootMargin: "100px"
            }
          );
          observer.observe(imageRef);
        } else {
          // Old browsers fallback
          setImageSrc(src);
        }
      }
      return () => {
        didCancel = true;
        if (observer && observer.unobserve) {
          observer.unobserve(imageRef);
        }
      };
    },
    [src, imageSrc, imageRef]
  );
  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      style={{height: '200px', width: '200px' }}
    />
  );  
};

function ImageGallery({ images = imagesUrls}) {
  return (
    <div style={{display:'grid',  gridTemplateColumns: '200px 200px 200px', gridTemplateRows: '200px'}}>
      {images.map((src, index) => (
        <LazyImage key={index} src={src} alt="placeholder" />
        ))}
    </div>
  );
}

export default ImageGallery;

