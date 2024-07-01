export const fixImageUrls = () => {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src && src.startsWith("https//")) {
        img.setAttribute("src", src.replace("https//", "https://"));
      }
    });
  };