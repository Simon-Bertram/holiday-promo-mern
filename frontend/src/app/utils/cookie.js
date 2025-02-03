export function getCookie(name) {
  if (typeof document === "undefined") {
    return null; // Or return an empty string, depending on your needs
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
