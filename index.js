// Version simplifiée pour Koyeb
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>🤖 Bot WhatsApp</h1><p>Déploiement en cours...</p>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur sur port ${PORT}`);
  
  // Démarrer le bot WhatsApp après un délai
  setTimeout(() => {
    startWhatsAppBot();
  }, 2000);
});

async function startWhatsAppBot() {
  try {
    console.log('🚀 Chargement des modules WhatsApp...');
    
    // Import dynamique pour éviter les erreurs de build
    const { makeWASocket, useMultiFileAuthState } = await import('@whiskeysockets/baileys');
    const qrcode = await import('qrcode-terminal');
    
    console.log('✅ Modules chargés');
    
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      browser: ['Koyeb-Bot', 'Chrome', '1.0']
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, qr } = update;
      
      if (qr) {
        console.log('\n📱 QR CODE POUR WHATSAPP:');
        qrcode.default.generate(qr, { small: true });
      }
      
      if (connection === 'open') {
        console.log('✅ CONNECTÉ À WHATSAPP !');
      }
    });

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const m = messages[0];
      if (!m.message) return;
      
      const text = m.message.conversation || '';
      const sender = m.key.remoteJid;
      
      if (text === '.ping') {
        await sock.sendMessage(sender, { text: '🏓 Pong !' });
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur bot:', error.message);
  }
}