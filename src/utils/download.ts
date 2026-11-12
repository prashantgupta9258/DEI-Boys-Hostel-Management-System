/**
 * Safely downloads a PDF from either a Base64 data URL or a standard HTTP/S URL.
 * Handles iframe constraints and browser security rules that block data URL navigation.
 */
export const downloadPDF = async (pdfUrl: string, fileName: string) => {
  if (!pdfUrl) return;

  try {
    if (pdfUrl.startsWith('data:')) {
      // Decode Base64 data URL to a local Blob URL
      const parts = pdfUrl.split(';base64,');
      if (parts.length < 2) {
        throw new Error('Invalid data URL format');
      }
      const contentType = parts[0].split(':')[1] || 'application/pdf';
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      const blob = new Blob([uInt8Array], { type: contentType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // For standard HTTP/S URLs, try fetching first to avoid target="_blank" blockages
      try {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error('Fetch failed');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (fetchErr) {
        // Fallback: standard anchor navigation in a new tab
        console.warn('CORS/Fetch blocked receipt direct download, falling back to open in tab:', fetchErr);
        // Force navigate to bypass popup blockers and iframe limitations
        window.location.assign(pdfUrl);
      }
    }
  } catch (error) {
    console.error('Failed to download PDF:', error);
    // Absolute fallback: force navigate
    window.location.assign(pdfUrl);
  }
};
