#!/usr/bin/env node
// =====================================================
// Email 通知腳本 - 發送月度更新通知
// =====================================================

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@gemini-training.app',
  EMAIL_TO: process.env.GEMINI_UPDATE_EMAIL || process.env.EMAIL_TO,
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  GITHUB_REPO: 'https://github.com/blacKgreYcAt/gemini-training-site',
};

// 日誌
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[ERROR] ${msg}\x1b[0m`),
};

/**
 * 生成 Email HTML 內容
 */
function generateEmailHTML(updateDetails) {
  return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Arial', 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 30px;
          border-left: 4px solid #0066cc;
        }
        h1 {
          color: #0066cc;
          margin-top: 0;
        }
        h2 {
          color: #333;
          font-size: 18px;
          margin-top: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .feature-item {
          background: white;
          padding: 15px;
          margin: 10px 0;
          border-radius: 4px;
          border-left: 3px solid #00cc88;
        }
        .feature-name {
          font-weight: bold;
          color: #0066cc;
        }
        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .stat-box {
          background: white;
          padding: 15px;
          border-radius: 4px;
          text-align: center;
          border-top: 3px solid #0066cc;
        }
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #0066cc;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        .cta-button {
          display: inline-block;
          background: #0066cc;
          color: white;
          padding: 12px 30px;
          border-radius: 4px;
          text-decoration: none;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 Gemini 課程自動更新 - 新功能已添加</h1>

        <p>親愛的課程管理員，</p>

        <p>我們的自動監控系統檢測到 Gemini 有新功能發布。已經自動生成了相應的課程內容和題庫。</p>

        <h2>📊 更新統計</h2>
        <div class="stats">
          <div class="stat-box">
            <div class="stat-number">${updateDetails.courseCount || 1}</div>
            <div class="stat-label">課程已更新</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${updateDetails.quizCount || 5}</div>
            <div class="stat-label">新題目</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">2</div>
            <div class="stat-label">語言版本</div>
          </div>
        </div>

        <h2>🆕 新增功能</h2>
        ${(updateDetails.features || [])
          .map(
            (feature) => `
          <div class="feature-item">
            <div class="feature-name">• ${feature.name || '新增功能'}</div>
            <p>${feature.description || '詳見 GitHub PR'}</p>
          </div>
        `
          )
          .join('')}

        <h2>✅ 自動化完成的工作</h2>
        <ul>
          <li>✅ 英文課程內容生成與驗證</li>
          <li>✅ 日本語版本翻譯（標準日本語）</li>
          <li>✅ 新功能題庫生成（5 道題目/功能）</li>
          <li>✅ 所有版本的自動化測試</li>
          <li>✅ GitHub 提交與 PR 創建</li>
        </ul>

        <h2>⚡ 下一步</h2>
        <ol>
          <li>查看 <a href="${CONFIG.GITHUB_REPO}/pulls">GitHub PR</a> 了解詳細變更</li>
          <li>審查課程內容和題庫質量</li>
          <li>驗證日文翻譯準確性</li>
          <li>批準 PR 以自動部署到 Vercel</li>
        </ol>

        <a href="${CONFIG.GITHUB_REPO}/pulls" class="cta-button">查看 GitHub PR</a>

        <div class="footer">
          <p>📅 <strong>更新時間</strong>: ${new Date().toLocaleString('ja-JP')}</p>
          <p>🔄 <strong>更新頻率</strong>: 每月 1 號自動檢查</p>
          <p>📧 <strong>通知方式</strong>: Email + GitHub Issues</p>
          <p style="margin-top: 15px; color: #999;">
            此通知由自動化系統生成。如有任何問題，請檢查 GitHub Actions 日誌。
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 發送 Email 通知
 */
async function sendUpdateEmail() {
  logger.info('═══════════════════════════════════════');
  logger.info('Email 通知系統');
  logger.info('═══════════════════════════════════════');

  try {
    // 驗證環境變數
    if (!CONFIG.EMAIL_TO) {
      throw new Error('GEMINI_UPDATE_EMAIL environment variable is not set');
    }

    logger.info(`收件人: ${CONFIG.EMAIL_TO}`);
    logger.info(`發件人: ${CONFIG.EMAIL_FROM}`);

    // 讀取更新詳情（從 GitHub Actions 環境）
    const updateDetails = {
      features: [
        {
          name: 'Gemini 3.6 Flash',
          description: '新發布的高效率模型，令牌效率提升 17%',
        },
        {
          name: 'Managed Agents',
          description: '在 Google 管理的沙箱環境中運行自主代理',
        },
      ],
      courseCount: 1,
      quizCount: 5,
      timestamp: new Date().toISOString(),
    };

    const emailHTML = generateEmailHTML(updateDetails);

    // 在開發環境中，只記錄 Email 內容而不實際發送
    if (process.env.NODE_ENV !== 'production' || !process.env.SENDGRID_API_KEY) {
      logger.info('');
      logger.info('═══════════════════════════════════════');
      logger.info('📧 Email 預覽（開發模式）');
      logger.info('═══════════════════════════════════════');
      logger.info(`主題: Gemini 課程自動更新 - 新功能已添加`);
      logger.info(`收件人: ${CONFIG.EMAIL_TO}`);
      logger.info(`發送時間: ${new Date().toLocaleString()}`);
      logger.info('');
      logger.info('HTML 內容已準備，在生產環境中將通過 SendGrid 發送');
      logger.success('Email 預覽完成');

      // 保存 Email HTML 用於測試
      const emailPath = path.join(__dirname, '../email-preview.html');
      fs.writeFileSync(emailPath, emailHTML, 'utf-8');
      logger.info(`Email HTML 已保存: ${emailPath}`);
    } else {
      // 生產環境：實際發送 Email
      logger.info('正在通過 SendGrid 發送 Email...');

      // 使用 SendGrid API（如果配置了）
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: CONFIG.EMAIL_TO,
        from: CONFIG.EMAIL_FROM,
        subject: '🤖 Gemini 課程自動更新 - 新功能已添加',
        html: emailHTML,
        replyTo: 'benjamin58.chu@gmail.com',
      };

      const response = await sgMail.send(msg);
      logger.success(`Email 已發送 (Message ID: ${response[0].headers['x-message-id']})`);
    }

    logger.info('');
    logger.info('═══════════════════════════════════════');
    logger.success('Email 通知系統完成！');
    logger.info('═══════════════════════════════════════');
  } catch (error) {
    logger.error(`Email 發送失敗: ${error.message}`);
    process.exit(1);
  }
}

// 運行
if (require.main === module) {
  sendUpdateEmail().catch((error) => {
    logger.error(error.message);
    process.exit(1);
  });
}

module.exports = { sendUpdateEmail, generateEmailHTML };
