import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import './Gallery.scss';

interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  aspectRatio?: number; // width/height ratio
}

interface GalleryProps {
  items: GalleryItem[];
  title?: string;
  subtitle?: string;
  columnCountSm?: number;
  columnCountMd?: number;
  columnCountLg?: number;
  gapSize?: number;
}

const Gallery: React.FC<GalleryProps> = ({
  items,
  title,
  subtitle,
  columnCountSm = 1,
  columnCountMd = 2,
  columnCountLg = 4,
  gapSize = 10,
}) => {
  const [columns, setColumns] = useState<GalleryItem[][]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // Determine current column count based on window width
  const getColumnCount = () => {
    // if (windowWidth < 576) return columnCountSm;
    if (windowWidth < 992) return columnCountMd;
    return columnCountLg;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Distribute items into columns
  useEffect(() => {
    const currentColumnCount = getColumnCount();
    
    // Create empty columns
    const newColumns: GalleryItem[][] = Array.from({ length: currentColumnCount }, () => []);
    
    // Distribute items across columns
    items.forEach((item, _index) => {
      // Find the shortest column
      const shortestColumnIndex = newColumns
        .map((column, i) => ({
          index: i,
          height: column.reduce((sum, item) => sum + (item.aspectRatio ? 1 / item.aspectRatio : 1), 0),
        }))
        .sort((a, b) => a.height - b.height)[0].index;
      
      // Add item to the shortest column
      newColumns[shortestColumnIndex].push(item);
    });
    
    setColumns(newColumns);
  }, [items, windowWidth, columnCountSm, columnCountMd, columnCountLg]);

  return (
    <section className="gallery-section">
      <Container>
        {(title || subtitle) && (
          <div className="gallery-header text-center mb-4">
            {title && <h2 className="gallery-title">{title}</h2>}
            {subtitle && <p className="gallery-subtitle">{subtitle}</p>}
          </div>
        )}
        
        <div className="gallery-container" style={{ gap: `${gapSize}px` }}>
          {columns.map((column, columnIndex) => (
            <div key={`column-${columnIndex}`} className="gallery-column">
              {column.map((item) => (
                <div 
                  key={item.id} 
                  className="gallery-item"
                  style={{ marginBottom: `${gapSize}px` }}
                >
                  <img 
                    src={item.image} 
                    alt={item.alt}
                    className="gallery-image"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Gallery;