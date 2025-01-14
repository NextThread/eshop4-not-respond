import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useCollection } from 'hooks/useCollection';

import { Loader } from 'components/common';

import ProductCard from './ProductCard';

import styles from './index.module.scss';

const validSlugs = [
  'products',
  't-shirts',
  'hoodies-sweatshirts',
  'accessories',
];

const CollectionPage = () => {
  const navigate = useNavigate();
  const { id: slugId } = useParams();

  const { getCollection, isLoading, hasMore, error } = useCollection();

  const [productVariants, setProductVariants] = useState(null);

  useEffect(() => {
    setProductVariants(null);
    if (!validSlugs.includes(slugId)) {
      navigate('/');
    }

    const fetchProductVariants = async () => {
      const productVariants = await getCollection({
        collectionName: slugId,
        isNewQuery: true,
      });
      setProductVariants(productVariants);
    };

    fetchProductVariants();
  }, [slugId]);

  const observer = useRef();
  const lastProductVariantRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          const moreProductVariants = await getCollection({
            collectionName: slugId,
          });

          setProductVariants((prevState) => [
            ...prevState,
            ...moreProductVariants,
          ]);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore]
  );

  return (
    <>
      <section className={styles.section}>
        {!productVariants && <Loader />}
        {productVariants && (
          <div className="main-container">
            <div className={styles.container}>
              {productVariants.map((productVariant, index) => (
                <div
                  id={productVariant.id}
                  key={productVariant.id}
                  ref={
                    index + 1 === productVariants.length
                      ? lastProductVariantRef
                      : undefined
                  }
                >
                  <ProductCard
                    model={productVariant.model}
                    color={productVariant.color}
                    currentPrice={productVariant.variantPrice}
                    actualPrice={productVariant.price}
                    type={productVariant.type}
                    slug={productVariant.slug + '-' + productVariant.color}
                    image={productVariant.images[0]}
                    numberOfVariants={productVariant.numberOfVariants}
                  />
                </div>
              ))}
            </div>
            {isLoading && <div className={styles.loading_more}>Loading</div>}
          </div>
        )}
      </section>
    </>
  );
};

export default CollectionPage;
