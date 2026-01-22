export function optimizeCloudinary(url: string): string {
  if (!url.includes("cloudinary")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_400,dpr_auto/");
}
