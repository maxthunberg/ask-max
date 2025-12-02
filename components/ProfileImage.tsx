import React from 'react';

interface ProfileImageProps {
  className?: string;
  alt?: string;
}

// Professional placeholder image - Replace with your actual photo
// To add your photo: Convert to base64 at https://base64.guru/converter/encode/image
// Then replace PROFILE_IMAGE with: data:image/jpeg;base64,YOUR_BASE64_HERE
const PROFILE_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=526&h=701&fit=crop&crop=faces';

export function ProfileImage({ className, alt = "Max Thunberg, UX Lead" }: ProfileImageProps) {
  return (
    <img 
      src={PROFILE_IMAGE}
      alt={alt}
      className={className}
    />
  );
}
