import { useLocationContext } from '../context/LocationContext';

export function useLocation() {
  const { location, error, status, requestLocation } = useLocationContext();
  return { location, error, status, requestLocation };
}
