import { toBlob } from 'html-to-image';

export async function generateStoryBlob(
  node: HTMLElement,
  width: number,
  height: number
): Promise<Blob> {
  const blob = await toBlob(node, {
    width,
    height,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: '#ffffff',
  });

  if (!blob) {
    throw new Error('Não foi possível gerar a imagem.');
  }

  return blob;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Retorna true se a imagem foi compartilhada pelo share sheet nativo, false se caiu no download. */
export async function shareOrDownload(blob: Blob, filename: string): Promise<boolean> {
  const file = new File([blob], filename, { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return true;
      }
    }
  }

  downloadBlob(blob, filename);
  return false;
}
