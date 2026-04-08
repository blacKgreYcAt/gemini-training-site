/**
 * 證書生成工具（高清文字渲染）
 */

export interface CertificateData {
  userName: string;
  completionDate: Date;
  certificateNumber: string;
  quizAccuracy: number;
  totalLearningHours: number;
}

/**
 * 生成證書編號
 */
export function generateCertificateNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const todayKey = `cert-sequence-${dateStr}`;
  let sequence = parseInt(localStorage.getItem(todayKey) || '0', 10) + 1;
  localStorage.setItem(todayKey, String(sequence));

  return `TFG-GEMINI-${dateStr}-${String(sequence).padStart(4, '0')}`;
}

/**
 * 格式化日期
 */
function formatDateParts(date: Date): { year: string; month: string; day: string } {
  return {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1),
    day: String(date.getDate())
  };
}

/**
 * 高清晰度文字渲染函數
 */
function drawTextSmooth(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontWeight: string = 'bold',
  fillColor: string = '#d4af37'
) {
  ctx.imageSmoothingEnabled = true;
  (ctx as any).imageSmoothingQuality = 'high';

  ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "微軟正黑體", Arial, sans-serif`;

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = fillColor;
  ctx.strokeStyle = 'transparent';
  ctx.lineWidth = 0;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(text, x, y);
}

/**
 * 簡化版：直接返回証書圖片 URL
 */
export async function generateCertificateCanvas(
  data: CertificateData
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {
      alpha: false,
      willReadFrequently: false
    });

    if (!ctx) {
      reject(new Error('無法獲取 Canvas 上下文'));
      return;
    }

    const templateImg = new Image();
    templateImg.crossOrigin = 'anonymous';
    templateImg.src = '/certificate-template.png';

    templateImg.onload = () => {
      canvas.width = 2400;
      canvas.height = 1600;

      // 簡單地繪製背景圖，不添加文字層
      // 這樣避免坐標問題，信息由前端分開顯示
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

      resolve(canvas);
    };

    templateImg.onerror = () => {
      reject(new Error('無法加載證書背景圖'));
    };
  });
}

/**
 * 下載為 PNG
 */
export function downloadCertificateAsPNG(
  canvas: HTMLCanvasElement,
  fileName: string
) {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png', 1.0);
  link.download = `${fileName}-證書.png`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 下載為 PDF
 */
export async function downloadCertificateAsPDF(
  canvas: HTMLCanvasElement,
  fileName: string
) {
  try {
    const { default: jsPDF } = await import('jspdf');

    const imgData = canvas.toDataURL('image/png', 1.0);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = 2400;
    const imgHeight = 1600;
    const ratio = imgWidth / imgHeight;

    let pdfWidth = pageWidth;
    let pdfHeight = pdfWidth / ratio;

    if (pdfHeight > pageHeight) {
      pdfHeight = pageHeight;
      pdfWidth = pdfHeight * ratio;
    }

    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
    pdf.save(`${fileName}-證書.pdf`);
  } catch (error) {
    console.error('PDF 生成失敗:', error);
    alert('PDF 生成失敗，請嘗試下載 PNG 格式');
  }
}

/**
 * 在模態視窗中預覽證書
 */
export function displayCertificatePreview(canvas: HTMLCanvasElement) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 20px;
  `;

  const container = document.createElement('div');
  container.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 95%;
    max-height: 95%;
    overflow: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;

  const displayCanvas = document.createElement('canvas');
  const ratio = canvas.width / canvas.height;
  const maxWidth = Math.min(window.innerWidth - 100, 1200);
  displayCanvas.width = maxWidth;
  displayCanvas.height = maxWidth / ratio;

  const displayCtx = displayCanvas.getContext('2d');
  if (displayCtx) {
    displayCtx.imageSmoothingEnabled = true;
    (displayCtx as any).imageSmoothingQuality = 'high';
    displayCtx.drawImage(canvas, 0, 0, displayCanvas.width, displayCanvas.height);
  }

  container.appendChild(displayCanvas);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '關閉';
  closeBtn.style.cssText = `
    display: block;
    margin: 20px auto 0;
    padding: 10px 30px;
    background: #0071e3;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  `;
  closeBtn.onclick = () => modal.remove();
  container.appendChild(closeBtn);

  modal.appendChild(container);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}
