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
 * 自創証書生成：完全用 Canvas 繪製，無需範本圖片
 */
export async function generateCertificateCanvas(
  data: CertificateData
): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {
      alpha: false,
      willReadFrequently: false
    });

    if (!ctx) {
      throw new Error('無法獲取 Canvas 上下文');
    }

    // 設置画布尺寸（A4 横向 300dpi）
    canvas.width = 2400;
    canvas.height = 1600;

    // 1. 繪製背景漸變
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. 繪製邊框
    ctx.strokeStyle = '#0071e3';
    ctx.lineWidth = 20;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // 3. 繪製裝飾角落
    drawCornerDecorations(ctx, canvas.width, canvas.height);

    // 4. 繪製標題
    ctx.font = 'bold 140px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"';
    ctx.fillStyle = '#0071e3';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('證書', canvas.width / 2, 250);

    // 5. 繪製副標題
    ctx.font = '50px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"';
    ctx.fillStyle = '#666666';
    ctx.fillText('Gemini 企業協作課程結業証書', canvas.width / 2, 380);

    // 6. 繪製分隔線
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 480);
    ctx.lineTo(canvas.width - 300, 480);
    ctx.stroke();

    // 7. 繪製核心內容
    const contentStartY = 600;
    const lineHeight = 180;

    // 文本行
    ctx.font = '50px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText('茲証明', canvas.width / 2, contentStartY);

    // 姓名
    ctx.font = 'bold 80px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"';
    ctx.fillStyle = '#10b981';
    ctx.fillText(data.userName, canvas.width / 2, contentStartY + lineHeight);

    // 完成文本
    ctx.font = '50px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"';
    ctx.fillStyle = '#333333';
    ctx.fillText('已完成「Gemini 全方位實戰大師課」的所有課程', canvas.width / 2, contentStartY + lineHeight * 2);

    // 日期和編號
    ctx.font = '40px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"';
    ctx.fillStyle = '#666666';
    const dateStr = data.completionDate.toLocaleDateString('zh-TW');
    ctx.fillText(`完成日期：${dateStr}`, canvas.width / 2, contentStartY + lineHeight * 2.9);
    ctx.fillText(`証書編號：${data.certificateNumber}`, canvas.width / 2, contentStartY + lineHeight * 3.6);

    // 8. 繪製簽名區域
    ctx.font = '35px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"';
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'center';

    // 左邊簽名
    ctx.fillText('大豐貿易集團', canvas.width / 4, 1380);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 - 150, 1320);
    ctx.lineTo(canvas.width / 4 + 150, 1320);
    ctx.stroke();

    // 右邊日期
    ctx.fillText(new Date().getFullYear().toString(), (canvas.width * 3) / 4, 1380);
    ctx.beginPath();
    ctx.moveTo((canvas.width * 3) / 4 - 80, 1320);
    ctx.lineTo((canvas.width * 3) / 4 + 80, 1320);
    ctx.stroke();

    // 9. 底部裝飾
    ctx.fillStyle = '#0071e3';
    ctx.globalAlpha = 0.1;
    ctx.font = '200px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"';
    ctx.textAlign = 'center';
    ctx.fillText('Gemini', canvas.width / 2, canvas.height - 150);
    ctx.globalAlpha = 1.0;

    resolve(canvas);
  });
}

/**
 * 繪製裝飾性角落
 */
function drawCornerDecorations(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.fillStyle = '#d4af37';

  // 四個角的小方塊
  const cornerSize = 40;
  const offset = 80;

  // 左上
  ctx.fillRect(offset, offset, cornerSize, cornerSize);
  // 右上
  ctx.fillRect(width - offset - cornerSize, offset, cornerSize, cornerSize);
  // 左下
  ctx.fillRect(offset, height - offset - cornerSize, cornerSize, cornerSize);
  // 右下
  ctx.fillRect(width - offset - cornerSize, height - offset - cornerSize, cornerSize, cornerSize);

  // 角落裝飾線
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;

  // 左上裝飾線
  ctx.beginPath();
  ctx.moveTo(offset + cornerSize + 30, offset);
  ctx.lineTo(offset + cornerSize + 200, offset);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(offset, offset + cornerSize + 30);
  ctx.lineTo(offset, offset + cornerSize + 200);
  ctx.stroke();

  // 右上裝飾線
  ctx.beginPath();
  ctx.moveTo(width - offset - cornerSize - 30, offset);
  ctx.lineTo(width - offset - cornerSize - 200, offset);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - offset, offset + cornerSize + 30);
  ctx.lineTo(width - offset, offset + cornerSize + 200);
  ctx.stroke();

  // 左下裝飾線
  ctx.beginPath();
  ctx.moveTo(offset + cornerSize + 30, height - offset);
  ctx.lineTo(offset + cornerSize + 200, height - offset);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(offset, height - offset - cornerSize - 30);
  ctx.lineTo(offset, height - offset - cornerSize - 200);
  ctx.stroke();

  // 右下裝飾線
  ctx.beginPath();
  ctx.moveTo(width - offset - cornerSize - 30, height - offset);
  ctx.lineTo(width - offset - cornerSize - 200, height - offset);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - offset, height - offset - cornerSize - 30);
  ctx.lineTo(width - offset, height - offset - cornerSize - 200);
  ctx.stroke();
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
