import React, { useEffect, useState } from 'react';
import { Eatery, User } from '../../../interface';
import { useEateryContext } from '../../../hooks/useEateryContext';

interface EateryPhotosProps { 
  user: User,
  eatery: Eatery
}

export const EateryPhotos: React.FC<EateryPhotosProps> = ({ eatery, user }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [manageImages, setManageImages] = useState<boolean>(false);
  const {deleteImage, getEateryImage, addImage} = useEateryContext()
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const manageDeleteImage = async (index: number) => { 
    const imageId = eatery.eatery_image[index]
    await deleteImage(imageId)
  }

  const manageAddImage = async (file: File | null) => { 
    if(file) { 
      await addImage(file)
    }
  }

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
  }, [getEateryImage, eatery]);

  return ( 
    <>
      <div className="image-grid">
        {imageUrls.map((url, index) => (
          <div className='image-container'>
            <img key={index} src={url} alt={`Eatery ${index}`} 
              onClick={() => { 
                setModalImage(url);
                setModalVisible(true);
              }}
            className={manageImages ? "delete-image": ""}
            />
            
            {/* delete image */}
            {manageImages && (<i className="bi bi-x-circle" onClick={() => manageDeleteImage(index)}></i>)}
          </div>
          
        ))}

        {/* add images */}
        {manageImages && imageUrls.length < 6 && ( 
          <>
          <input type="file" id="upload" style={{ display: 'none' }} onChange={e => manageAddImage(e.target.files ? e.target.files[0] : null)} />
          <label htmlFor="upload" className='add-image'>
            <i className="bi bi-plus-circle"></i>
          </label>
        </>
        )}
      </div>

      {user.role === "eatery" && (<button className='manage-images' 
        onClick={() => {
          setManageImages(!manageImages)
          setModalImage("")
        }}> 
        Manage Images 
      </button>)}


      {/* Maximise image */}
      {isModalVisible && !manageImages && (
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