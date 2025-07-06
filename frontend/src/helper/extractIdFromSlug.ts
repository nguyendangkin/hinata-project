export const extractIdFromSlug = (slug: string): string => {
    // Bỏ đuôi .html nếu có
    const cleanSlug = slug.replace(/\.html$/, "");
    // Tách theo dấu gạch ngang
    const parts = cleanSlug.split("-");
    // Lấy phần tử cuối (là id)
    return parts[parts.length - 1];
};
