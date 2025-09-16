// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant LoadingSpinner pour afficher un indicateur de chargement.
 */

import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', text = 'Chargement...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-agri-green`} />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
