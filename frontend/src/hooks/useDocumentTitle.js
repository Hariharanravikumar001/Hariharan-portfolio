import { useEffect } from 'react';

/**
 * Custom React hook for dynamic SEO document title management
 * @param {string} title
 * @param {boolean} retainOnUnmount
 */
export const useDocumentTitle = (title, retainOnUnmount = false) => {
  useEffect(() => {
    const baseTitle = 'Hariharan Ravikumar';
    if (title) {
      document.title = `${title} | ${baseTitle}`;
    } else {
      document.title = `${baseTitle} | Full Stack Engineer & MERN Specialist`;
    }

    return () => {
      if (!retainOnUnmount) {
        document.title = `${baseTitle} | Full Stack Engineer & MERN Specialist`;
      }
    };
  }, [title, retainOnUnmount]);
};

export default useDocumentTitle;
