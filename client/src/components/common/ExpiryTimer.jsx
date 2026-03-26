import React, { useEffect, useState } from 'react';
import { formatExpiry } from '../../utils/helpers';

export default function ExpiryTimer({ expiryTime }) {
  const [remaining, setRemaining] = useState(formatExpiry(expiryTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(formatExpiry(expiryTime));
    }, 30000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  return <span className="fb-expiry">⏱ {remaining}</span>;
}
