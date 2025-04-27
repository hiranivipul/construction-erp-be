// Function to extract company name from website URL
export const extractCompanyName = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
        // Ensure URL has a valid protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`; // Default to https
        }

        const hostname = new URL(url).hostname; // Extract hostname
        const parts = hostname.replace(/^www\./, '').split('.'); // Remove "www." if exists and split by "."

        // If domain has more than two parts, use second last part (e.g., "example.co.uk" → "example")
        return parts.length > 2 ? parts[parts.length - 2] : parts[0];
    } catch (error) {
        return null;
    }
};

export const extractNameFromEmail = (email: string): string | null => {
    if (!email) return null;
    const namePart = email.split('@')[0]; // Get the part before the '@'
    const name = namePart.replace(/[._\-]/g, ' '); // Replace dots, underscores, and hyphens with spaces
    return name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
};

export const extractFirstName = (
    fullName: string | undefined,
): string | null => {
    if (!fullName) return null;
    const names = fullName.split(' '); // Split the full name by spaces
    return names[0].charAt(0).toUpperCase() + names[0].slice(1); // Capitalize the first letter of the first name
};
