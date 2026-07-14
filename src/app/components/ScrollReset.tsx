'use client';

import { useEffect } from 'react';

export default function ScrollReset() {
  useEffect(() => {
    // Check if there is a hash in the URL on load
    if (window.location.hash) {
      // Remove the hash from the URL without triggering a reload
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    // Force scroll to top
    window.scrollTo(0, 0);
  }, []);

  return null;
}
