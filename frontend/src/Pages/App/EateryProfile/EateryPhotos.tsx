import React, { useEffect, useState } from 'react';
import { EateryProfileProps } from '../../../interface';
import { useEateryContext } from '../../../hooks/useEateryContext';


export const EateryPhotos: React.FC<EateryProfileProps> = ({ eatery }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { getEateryImage} = useEateryContext();

  useEffect(() => {
    const fetchImages = async () => {
      const urls: string[] = [];
      if (eatery && eatery.eatery_image) {
        for (const imageId of eatery.eatery_image) {
          try {
            const url = await getEateryImage (imageId);
            if (url) {
              urls.push(url);
            }
          } catch (error) {
            console.error(`Failed to fetch image with ID ${imageId}: `, error);
          }
        }
      }
      setImageUrls(urls);
    };
    fetchImages();
  }, [getEateryImage, eatery?.eatery_image]);

  return ( 
    <>
      <div className="image-grid">
        {imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Eatery ${index}`} 
            onClick={() => { 
              setModalImage(url);
              setModalVisible(true);
            }}
          />
        ))}
      </div>

      {isModalVisible && (
        <div 
          className="mod" 
          onClick={() => setModalVisible(false)}
        >
          <img src={modalImage} alt="Modal view" />
        </div>
      )}
    </>
  )
};