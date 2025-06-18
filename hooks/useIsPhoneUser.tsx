import { useEffect, useState } from 'react';

export function useIsPhoneUser() {
  const [isPhoneUser, setIsPhoneUser] = useState(false);
  useEffect(() => {
    setIsPhoneUser(window.screen.width < 768 || window.screen.height < 768);
  }, []);

  return isPhoneUser;
}
